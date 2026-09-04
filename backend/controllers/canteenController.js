const Canteen = require('../models/Canteen');

// @desc    Get all active canteens
// @route   GET /api/canteens
// @access  Public
const getAllCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find({}).sort({ name: 1 });
    res.json(canteens);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching canteens' });
  }
};

// @desc    Get single canteen by ID
// @route   GET /api/canteens/:id
// @access  Public
const getCanteenById = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }
    res.json(canteen);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching canteen details' });
  }
};

module.exports = {
  getAllCanteens,
  getCanteenById,
};
