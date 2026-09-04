const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerStaff,
  loginStudent,
  loginStaff,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);
router.post('/staff/register', registerStaff);
router.post('/staff/login', loginStaff);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
