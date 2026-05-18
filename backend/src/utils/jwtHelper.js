// src/utils/jwtHelper.js
const jwt = require('jsonwebtoken');
const config = require('../config');

// Access Token logic - short lived
const generateToken = (payload) => {
  // Payload should contain only: sub, role_id, department_id, sv
  return jwt.sign(payload, config.jwt.secret, { 
    expiresIn: config.jwt.expiresIn 
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

// Refresh Token logic - longer lived
const generateRefreshToken = (payload) => {
  // Refresh token contains same minimal payload
  return jwt.sign(payload, config.jwt.refreshSecret, { 
    expiresIn: config.jwt.refreshExpiresIn 
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

// Decode without verification (useful for extracting info from expired tokens)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  decodeToken
};