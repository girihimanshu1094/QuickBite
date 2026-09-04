const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    canteenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Canteen',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    pickupSlot: {
      type: String,
      required: true,
    },
    orderDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ['preparing', 'ready', 'collected'],
      default: 'preparing',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
