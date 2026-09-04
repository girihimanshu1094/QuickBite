const jwt = require('jsonwebtoken');

const generateToken = (id, role, canteenId = null) => {
  return jwt.sign(
    { id, role, canteenId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
