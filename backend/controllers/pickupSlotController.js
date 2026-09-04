const PickupSlot = require('../models/PickupSlot');
const Order = require('../models/Order');

const DEFAULT_SLOTS = [
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
];

const MAX_SLOT_CAPACITY = 20;

// @desc    Get pickup slots and real-time availability for a canteen
// @route   GET /api/pickup-slots/:canteenId
// @access  Public / Authenticated
const getPickupSlots = async (req, res) => {
  try {
    const { canteenId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Count existing paid/preparing/ready orders for each slot today
    const slotData = await Promise.all(
      DEFAULT_SLOTS.map(async (slotTime) => {
        const orderCount = await Order.countDocuments({
          canteenId,
          pickupSlot: slotTime,
          orderDate: today,
          paymentStatus: 'paid',
        });

        const availableSlots = Math.max(0, MAX_SLOT_CAPACITY - orderCount);

        return {
          slotTime,
          date: today,
          maxCapacity: MAX_SLOT_CAPACITY,
          bookedCount: orderCount,
          availableSlots,
          isFull: availableSlots <= 0,
        };
      })
    );

    res.json(slotData);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching pickup slots' });
  }
};

module.exports = {
  getPickupSlots,
  DEFAULT_SLOTS,
  MAX_SLOT_CAPACITY,
};
