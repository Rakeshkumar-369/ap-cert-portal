const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/ApiResponse');

function createRateLimiter(maxAttempts, windowMinutes) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxAttempts,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
      res.status(429).json(
        ApiResponse.error('Too many requests, please try again later.')
      );
    }
  });
}

module.exports = { createRateLimiter };