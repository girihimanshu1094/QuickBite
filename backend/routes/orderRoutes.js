const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

router.get('/my-orders', protect, authorizeRole('student'), getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
