const express = require('express');
const router = express.Router();
const captchaService = require('../services/captchaService');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Limit CAPTCHA generation: 10 requests per minute per IP
const captchaLimiter = createRateLimiter(50, 1);

router.get('/', captchaLimiter, (req, res) => {
  try {
    const { id, svg } = captchaService.createCaptcha();
    res.json({ success: true, data: { id, svg } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate CAPTCHA' });
  }
});

module.exports = router;