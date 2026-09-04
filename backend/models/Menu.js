const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    canteenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Canteen',
      required: [true, 'Canteen ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be greater than 0'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Menu', menuSchema);
