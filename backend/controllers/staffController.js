const Order = require('../models/Order');

// Allowed status transitions
const VALID_TRANSITIONS = {
  preparing: ['ready'],
  ready: ['collected'],
  collected: [],
};

// @desc    Get all orders for the logged-in staff member's canteen
// @route   GET /api/staff/orders
// @access  Private (Staff only)
const getStaffOrders = async (req, res) => {
  try {
    const canteenId = req.user.canteenId;

    if (!canteenId) {
      return res.status(403).json({ message: 'No canteen assigned to this staff account' });
    }

    const { date, status } = req.query;
    const filter = { canteenId };

    if (date) {
      filter.orderDate = date;
    }
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('studentId', 'name rollNo email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching staff orders' });
  }
};

// @desc    Update order status (Preparing -> Ready -> Collected)
// @route   PUT /api/staff/orders/:id/status
// @access  Private (Staff only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const canteenId = req.user.canteenId;

    if (!['preparing', 'ready', 'collected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Status must be one of: preparing, ready, collected',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Enforce canteen isolation: Staff can only edit orders for their own canteen
    if (order.canteenId.toString() !== canteenId.toString()) {
      return res.status(403).json({
        message: 'Access Denied: You cannot manage orders belonging to another canteen',
      });
    }

    const currentStatus = order.status;
    const allowedNext = VALID_TRANSITIONS[currentStatus] || [];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from "${currentStatus}" to "${status}". Allowed next step: ${
          allowedNext.join(', ') || 'None (order is already finalized)'
        }`,
      });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id).populate('studentId', 'name rollNo email');

    res.json({
      success: true,
      message: `Order #${order.orderNumber} updated to "${status}"`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating order status' });
  }
};

// @desc    Get dashboard summary metrics for staff's canteen
// @route   GET /api/staff/dashboard-stats
// @access  Private (Staff only)
const getStaffDashboardStats = async (req, res) => {
  try {
    const canteenId = req.user.canteenId;
    const today = new Date().toISOString().split('T')[0];

    const todayOrders = await Order.find({ canteenId, orderDate: today });

    const stats = {
      totalToday: todayOrders.length,
      preparing: todayOrders.filter((o) => o.status === 'preparing').length,
      ready: todayOrders.filter((o) => o.status === 'ready').length,
      collected: todayOrders.filter((o) => o.status === 'collected').length,
      totalRevenue: todayOrders
        .filter((o) => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching stats' });
  }
};

module.exports = {
  getStaffOrders,
  updateOrderStatus,
  getStaffDashboardStats,
};
