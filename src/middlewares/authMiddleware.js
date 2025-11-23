// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../db');
const { User, Employee, Team, Organisation, Log } = db;


module.exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists (security best practice)
    const user = await User.findByPk(payload.userId);
    if (!user) {
        return res.status(401).json({ message: 'Authentication failed: User not found' });
    }

    // Attach user and organisation info to the request
    req.user = { 
        userId: payload.userId, 
        orgId: payload.orgId, 
        email: user.email // optional, but useful
    };
    
    next();
  } catch (error) {
    // If token is invalid, expired, or malformed
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: 'Authentication failed: Invalid or expired token' });
  }
};