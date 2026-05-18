// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const authRepo = require('../repositories/authRepository');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided', 
        data: [] 
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await authRepo.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive', 
        data: [] 
      });
    }

    // Verify session version matches (single session policy)
    if (user.session_version !== decoded.sv) {
      return res.status(401).json({ 
        success: false, 
        message: 'Session invalidated. Please login again.', 
        data: [] 
      });
    }

    // Attach user info to request
    req.user = {
      id: decoded.sub,
      name: user.name,
      email: user.email,
      session_version: decoded.sv
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired', 
        data: [] 
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token', 
        data: [] 
      });
    }
    res.status(401).json({ 
      success: false, 
      message: error.message, 
      data: [] 
    });
  }
};

module.exports = authMiddleware;