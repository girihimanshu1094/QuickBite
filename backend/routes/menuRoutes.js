const express = require('express');
const router = express.Router();
const {
  getMenuByCanteen,
  saveBulkMenu,
  saveAsDefaultMenu,
  useDefaultMenu,
  getDefaultMenu,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Public route to view a canteen's menu
router.get('/:canteenId', getMenuByCanteen);

// Staff-protected menu routes
router.post('/bulk', protect, authorizeRole('staff'), saveBulkMenu);
router.post('/default', protect, authorizeRole('staff'), saveAsDefaultMenu);
router.post('/use-default', protect, authorizeRole('staff'), useDefaultMenu);
router.get('/default/view', protect, authorizeRole('staff'), getDefaultMenu);
router.put('/:id', protect, authorizeRole('staff'), updateMenuItem);
router.delete('/:id', protect, authorizeRole('staff'), deleteMenuItem);

module.exports = router;
