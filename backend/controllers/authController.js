const crypto = require('crypto');
const User = require('../models/User');
const Canteen = require('../models/Canteen');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/email');

// @desc    Register a new Student
// @route   POST /api/auth/student/register
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, rollNo } = req.body;

    if (!name || !email || !password || !rollNo) {
      return res.status(400).json({ message: 'Please provide Name, Email, Password, and Roll No.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate random verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student',
      rollNo,
      isVerified: false,
      verificationToken,
    });

    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'QuickBite - Verify Your Email',
      text: `Hello ${user.name},\n\nPlease verify your student account by clicking on the link below:\n${verifyUrl}\n\nThank you,\nQuickBite Team`,
      link: verifyUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      verificationToken, // Provided for instant demo testing
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Register a new Staff member
// @route   POST /api/auth/staff/register
// @access  Public
const registerStaff = async (req, res) => {
  try {
    const { name, email, password, canteenName } = req.body;

    if (!name || !email || !password || !canteenName) {
      return res.status(400).json({ message: 'Please provide Name, Email, Password, and Canteen Name.' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Find or create canteen (Case-insensitive matching)
    const canteenNameClean = canteenName.trim();
    const canteenNameLower = canteenNameClean.toLowerCase();

    let canteen = await Canteen.findOne({ nameLower: canteenNameLower });
    if (!canteen) {
      canteen = await Canteen.create({
        name: canteenNameClean,
        nameLower: canteenNameLower,
      });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'staff',
      canteenId: canteen._id,
      isVerified: false,
      verificationToken,
    });

    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'QuickBite - Verify Staff Account',
      text: `Hello ${user.name},\n\nPlease verify your staff account for "${canteen.name}" by clicking the link:\n${verifyUrl}\n\nQuickBite Team`,
      link: verifyUrl,
    });

    res.status(201).json({
      success: true,
      message: `Staff registration successful for ${canteen.name}! Please verify your email.`,
      canteenName: canteen.name,
      verificationToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during staff registration' });
  }
};

// @desc    Login Student
// @route   POST /api/auth/student/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'student' }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        isVerified: false,
        verificationToken: user.verificationToken,
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      rollNo: user.rollNo,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Login Staff
// @route   POST /api/auth/staff/login
// @access  Public
const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'staff' })
      .select('+password')
      .populate('canteenId');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        isVerified: false,
        verificationToken: user.verificationToken,
      });
    }

    const token = generateToken(user._id, user.role, user.canteenId?._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      canteenId: user.canteenId?._id,
      canteenName: user.canteenId?.name,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during staff login' });
  }
};

// @desc    Verify Email Token
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findOne({ verificationToken: token }).populate('canteenId');
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const jwtToken = generateToken(user._id, user.role, user.canteenId?._id);

    res.json({
      success: true,
      message: 'Email successfully verified! You can now use QuickBite.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        canteenId: user.canteenId?._id,
        canteenName: user.canteenId?.name,
        token: jwtToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error verifying email' });
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please enter your registered email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'QuickBite - Password Reset Request',
      text: `Hello ${user.name},\n\nYou requested a password reset. Click the link below to set a new password:\n${resetUrl}\n\nIf you did not request this, ignore this email.\n\nQuickBite Team`,
      link: resetUrl,
    });

    res.json({
      success: true,
      message: 'Password reset link sent to your email!',
      resetToken, // For quick testing preview
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error sending reset password link' });
  }
};

// @desc    Reset Password with Token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully! Please login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error resetting password' });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('canteenId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerStudent,
  registerStaff,
  loginStudent,
  loginStaff,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
