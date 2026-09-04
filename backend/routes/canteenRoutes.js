const express = require('express');
const router = express.Router();
const { getAllCanteens, getCanteenById } = require('../controllers/canteenController');

router.get('/', getAllCanteens);
router.get('/:id', getCanteenById);

module.exports = router;
