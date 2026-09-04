const express = require('express');
const router = express.Router();
const {
  getStaffOrders,
  updateOrderStatus,
  getStaffDashboardStats,
} = require('../controllers/staffController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorizeRole('staff'));

router.get('/orders', getStaffOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/dashboard-stats', getStaffDashboardStats);

module.exports = router;
