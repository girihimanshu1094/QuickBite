const mongoose = require('mongoose');

const pickupSlotSchema = new mongoose.Schema(
  {
    canteenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Canteen',
      required: true,
    },
    slotTime: {
      type: String,
      required: true, // e.g., "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"
    },
    date: {
      type: String,
      required: true, // e.g., "YYYY-MM-DD"
    },
    maxCapacity: {
      type: Number,
      default: 20,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

pickupSlotSchema.index({ canteenId: 1, date: 1, slotTime: 1 }, { unique: true });

module.exports = mongoose.model('PickupSlot', pickupSlotSchema);
