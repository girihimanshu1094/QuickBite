const Order = require('../models/Order');

// @desc    Get logged in student's order history
// @route   GET /api/orders/my-orders
// @access  Private (Student)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ studentId: req.user._id })
      .populate('canteenId', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching student orders' });
  }
};

// @desc    Get order by ID (with tracking status)
// @route   GET /api/orders/:id
// @access  Private (Student & Staff)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('canteenId', 'name')
      .populate('studentId', 'name rollNo email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access control:
    // If student: must be own order
    if (req.user.role === 'student' && order.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    // If staff: must be for their canteen
    if (req.user.role === 'staff' && order.canteenId._id.toString() !== req.user.canteenId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view orders from another canteen' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching order details' });
  }
};

module.exports = {
  getMyOrders,
  getOrderById,
};
