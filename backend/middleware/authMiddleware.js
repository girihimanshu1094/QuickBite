const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'quickbite_secret_key_mca_2026'
      );

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User account not found' });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Session expired or invalid token, please login again' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization required. No token provided.' });
  }
};

// Role-based authorization middleware
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRole };
