const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyAndCreateOrder,
} = require('../controllers/paymentController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.post('/create-order', protect, authorizeRole('student'), createRazorpayOrder);
router.post('/verify-and-order', protect, authorizeRole('student'), verifyAndCreateOrder);

module.exports = router;
