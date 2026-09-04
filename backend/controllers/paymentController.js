const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Menu = require('../models/Menu');
const { MAX_SLOT_CAPACITY } = require('./pickupSlotController');

// Initialize Razorpay instance
let razorpay = null;
if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('demo')
) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn('Razorpay initialization notice:', err.message);
  }
}

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private (Student)
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, canteenId, items, pickupSlot } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!pickupSlot) {
      return res.status(400).json({ message: 'Please select a pickup slot' });
    }

    // Backend Pre-check: Verify Pickup Slot Capacity
    const today = new Date().toISOString().split('T')[0];
    const slotCount = await Order.countDocuments({
      canteenId,
      pickupSlot,
      orderDate: today,
      paymentStatus: 'paid',
    });

    if (slotCount >= MAX_SLOT_CAPACITY) {
      return res.status(400).json({
        message: `Pickup slot "${pickupSlot}" is already full (${MAX_SLOT_CAPACITY}/${MAX_SLOT_CAPACITY}). Please choose another time slot.`,
      });
    }

    const receipt = `qb_rcpt_${Date.now()}`;
    const amountInPaise = Math.round(Number(amount) * 100);

    // If Razorpay live/test credentials exist with real key, create order via SDK
    if (razorpay) {
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
      });

      return res.json({
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Test/Viva Mock Razorpay order generator (when offline or using placeholder keys)
    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    res.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_quickbite_demo',
      isDemoMode: true,
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ message: error.message || 'Error generating payment order' });
  }
};

// @desc    Verify Payment and Finalize Order Creation in MongoDB
// @route   POST /api/payment/verify-and-order
// @access  Private (Student)
const verifyAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      canteenId,
      items,
      pickupSlot,
      totalAmount,
    } = req.body;

    if (!canteenId || !items || items.length === 0 || !pickupSlot) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    // 1. Double-check Pickup Slot Capacity
    const today = new Date().toISOString().split('T')[0];
    const slotCount = await Order.countDocuments({
      canteenId,
      pickupSlot,
      orderDate: today,
      paymentStatus: 'paid',
    });

    if (slotCount >= MAX_SLOT_CAPACITY) {
      return res.status(400).json({
        message: `Pickup slot "${pickupSlot}" is full. Order cannot be placed.`,
      });
    }

    // 2. Validate Items & Recompute price snapshot
    const itemIds = items.map((i) => i.menuItemId || i._id);
    const dbMenuItems = await Menu.find({ _id: { $in: itemIds }, canteenId });

    if (dbMenuItems.length !== items.length) {
      return res.status(400).json({
        message: 'Some items in your cart are no longer available in this canteen.',
      });
    }

    // Verify all items are marked available
    for (const dbItem of dbMenuItems) {
      if (!dbItem.isAvailable) {
        return res.status(400).json({
          message: `Item "${dbItem.name}" is currently unavailable. Please remove it from your cart.`,
        });
      }
    }

    // Build order items snapshot
    let computedTotal = 0;
    const orderItemsSnapshot = items.map((cartItem) => {
      const dbItem = dbMenuItems.find(
        (m) => m._id.toString() === (cartItem.menuItemId || cartItem._id).toString()
      );
      const itemPrice = dbItem.price;
      const quantity = Math.max(1, Number(cartItem.quantity) || 1);
      computedTotal += itemPrice * quantity;

      return {
        menuItemId: dbItem._id,
        name: dbItem.name,
        price: itemPrice,
        quantity,
      };
    });

    // 3. Signature verification (if razorpay secret is configured and not demo)
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret && razorpay_signature && !secret.includes('demo')) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature. Payment verification failed.' });
      }
    }

    // 4. Generate unique Order Number: e.g. "QB1042"
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `QB${randomSuffix}`;

    // 5. Create Order in DB (status defaults to 'preparing')
    const order = await Order.create({
      orderNumber,
      studentId: req.user._id,
      canteenId,
      items: orderItemsSnapshot,
      totalAmount: computedTotal,
      pickupSlot,
      orderDate: today,
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id || `pay_${Date.now()}`,
      status: 'preparing', // ONLY 'preparing', 'ready', 'collected'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('canteenId', 'name')
      .populate('studentId', 'name rollNo email');

    res.status(201).json({
      success: true,
      message: 'Payment verified and order placed successfully!',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message || 'Payment verification failed' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyAndCreateOrder,
};
