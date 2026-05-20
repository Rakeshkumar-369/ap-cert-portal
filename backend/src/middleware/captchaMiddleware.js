const { verifyCaptcha } = require('../services/captchaService');
const ApiError = require('../utils/ApiError');

function requireCaptcha(req, res, next) {
  const { captchaId, captchaText } = req.body;
  const result = verifyCaptcha(captchaId, captchaText);
  if (!result.valid) {
    return next(new ApiError(400, result.message || 'CAPTCHA verification failed'));
  }
  next();
}

module.exports = { requireCaptcha };