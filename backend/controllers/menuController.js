const Menu = require('../models/Menu');

// @desc    Get active menu for a specific canteen
// @route   GET /api/menu/:canteenId
// @access  Public
const getMenuByCanteen = async (req, res) => {
  try {
    const { canteenId } = req.params;
    const items = await Menu.find({ canteenId, isDefault: false }).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching menu items' });
  }
};

// @desc    Bulk Save/Replace today's active menu
// @route   POST /api/menu/bulk
// @access  Private (Staff only)
const saveBulkMenu = async (req, res) => {
  try {
    const canteenId = req.user.canteenId;
    const { items } = req.body;

    if (!canteenId) {
      return res.status(403).json({ message: 'No canteen associated with this staff account' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one valid menu item' });
    }

    // Filter and validate rows
    const validItems = [];
    const seenNames = new Set();

    for (const item of items) {
      const name = item.name ? item.name.trim() : '';
      const price = Number(item.price);
      const isAvailable = item.isAvailable !== false; // default true

      // Skip empty rows
      if (!name && (!item.price || item.price === '')) {
        continue;
      }

      if (!name) {
        return res.status(400).json({ message: 'Food name is required for all entered items' });
      }

      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: `Price must be greater than 0 for "${name}"` });
      }

      const lowerName = name.toLowerCase();
      if (seenNames.has(lowerName)) {
        return res.status(400).json({ message: `Duplicate item "${name}" found in the menu list` });
      }
      seenNames.add(lowerName);

      validItems.push({
        canteenId,
        name,
        price,
        isAvailable,
        isDefault: false,
      });
    }

    if (validItems.length === 0) {
      return res.status(400).json({ message: 'No valid menu items to save' });
    }

    // Replace existing active menu for this canteen
    await Menu.deleteMany({ canteenId, isDefault: false });
    const createdItems = await Menu.insertMany(validItems);

    res.status(200).json({
      success: true,
      message: `Menu saved successfully with ${createdItems.length} items!`,
      items: createdItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error saving bulk menu' });
  }
};

// @desc    Save current active menu as the Default Daily Template
// @route   POST /api/menu/default
// @access  Private (Staff only)
const saveAsDefaultMenu = async (req, res) => {
  try {
    const canteenId = req.user.canteenId;

    if (!canteenId) {
      return res.status(403).json({ message: 'No canteen associated with this staff account' });
    }

    // Fetch active menu
    const activeItems = await Menu.find({ canteenId, isDefault: false });
    if (activeItems.length === 0) {
      return res.status(400).json({ message: 'No active menu items to save as default. Please create a menu first.' });
    }

    // Clear previous default and clone active items as default
    await Menu.deleteMany({ canteenId, isDefault: true });

    const defaultItems = activeItems.map((item) => ({
      canteenId,
      name: item.name,
      price: item.price,
      isAvailable: item.isAvailable,
      isDefault: true,
    }));

    await Menu.insertMany(defaultItems);

    res.json({
      success: true,
      message: `Current menu (${defaultItems.length} items) saved as Default Daily Menu!`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error saving default menu' });
  }
};

// @desc    Use/Publish Default Menu for today
// @route   POST /api/menu/use-default
// @access  Private (Staff only)
const useDefaultMenu = async (req, res) => {
  try {
    const canteenId = req.user.canteenId;

    if (!canteenId) {
      return res.status(403).json({ message: 'No canteen associated with this staff account' });
    }

    const defaultItems = await Menu.find({ canteenId, isDefault: true });
    if (defaultItems.length === 0) {
      return res.status(404).json({
        message: 'No default menu saved yet. Please create and save a menu as default first.',
      });
    }

    // Replace active menu with default template items
    await Menu.deleteMany({ canteenId, isDefault: false });

    const activeItems = defaultItems.map((item) => ({
      canteenId,
      name: item.name,
      price: item.price,
      isAvailable: item.isAvailable,
      isDefault: false,
    }));

    const publishedItems = await Menu.insertMany(activeItems);

    res.json({
      success: true,
      message: `Default menu applied successfully (${publishedItems.length} items loaded)!`,
      items: publishedItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error loading default menu' });
  }
};

// @desc    Get default menu template
// @route   GET /api/menu/default/view
// @access  Private (Staff only)
const getDefaultMenu = async (req, res) => {
  try {
    const canteenId = req.user.canteenId;
    const items = await Menu.find({ canteenId, isDefault: true }).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching default menu' });
  }
};

// @desc    Update single menu item (e.g. toggle availability)
// @route   PUT /api/menu/:id
// @access  Private (Staff only)
const updateMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify staff belongs to the same canteen
    if (item.canteenId.toString() !== req.user.canteenId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit menu items for another canteen' });
    }

    const { name, price, isAvailable } = req.body;
    if (name) item.name = name.trim();
    if (price !== undefined) {
      if (price <= 0) return res.status(400).json({ message: 'Price must be greater than 0' });
      item.price = Number(price);
    }
    if (isAvailable !== undefined) item.isAvailable = Boolean(isAvailable);

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating menu item' });
  }
};

// @desc    Delete single menu item
// @route   DELETE /api/menu/:id
// @access  Private (Staff only)
const deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (item.canteenId.toString() !== req.user.canteenId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete menu items for another canteen' });
    }

    await item.deleteOne();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting menu item' });
  }
};

module.exports = {
  getMenuByCanteen,
  saveBulkMenu,
  saveAsDefaultMenu,
  useDefaultMenu,
  getDefaultMenu,
  updateMenuItem,
  deleteMenuItem,
};
