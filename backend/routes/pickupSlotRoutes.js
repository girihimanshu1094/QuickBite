const express = require('express');
const router = express.Router();
const { getPickupSlots } = require('../controllers/pickupSlotController');

router.get('/:canteenId', getPickupSlots);

module.exports = router;
