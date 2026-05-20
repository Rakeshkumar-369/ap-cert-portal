const svgCaptcha = require('svg-captcha');
const crypto = require('crypto');
const db = require('../config/sqlite');

const CAPTCHA_EXPIRY_MINUTES = 5;

/**
 * Generate a new CAPTCHA, store it, return id and SVG.
 */
function createCaptcha() {
  const captcha = svgCaptcha.create({
    size: 6,
    ignoreChars: '0o1il',
    noise: 2,
    color: true,
    background: '#f0f0f0'
  });
  const id = crypto.randomUUID();
  const now = Date.now();

  const stmt = db.prepare('INSERT INTO captchas (id, text, created_at, used) VALUES (?, ?, ?, 0)');
  stmt.run(id, captcha.text.toLowerCase(), now);

  return { id, svg: captcha.data };
}

/**
 * Verify a CAPTCHA by id and user input.
 * @returns {{ valid: boolean, message?: string }}
 */
function verifyCaptcha(id, userInput) {
  if (!id || !userInput) return { valid: false, message: 'Missing captcha id or text' };

  const row = db.prepare('SELECT text, used, created_at FROM captchas WHERE id = ?').get(id);
  if (!row) return { valid: false, message: 'Invalid captcha id' };
  if (row.used) return { valid: false, message: 'Captcha already used' };

  const expiryTime = row.created_at + CAPTCHA_EXPIRY_MINUTES * 60 * 1000;
  if (Date.now() > expiryTime) {
    // Mark as used so it can't be reused after expiry
    db.prepare('UPDATE captchas SET used = 1 WHERE id = ?').run(id);
    return { valid: false, message: 'Captcha expired' };
  }

  const isValid = row.text === userInput.trim().toLowerCase();
  if (isValid) {
    db.prepare('UPDATE captchas SET used = 1 WHERE id = ?').run(id);
    return { valid: true };
  } else {
    // Allow one more attempt? You could count attempts, but for simplicity we leave it as still unused.
    return { valid: false, message: 'Incorrect captcha' };
  }
}

/**
 * Clean up old captcha records (call periodically)
 */
function cleanupExpired() {
  const cutoff = Date.now() - CAPTCHA_EXPIRY_MINUTES * 60 * 1000;
  db.prepare('DELETE FROM captchas WHERE created_at < ?').run(cutoff);
}

module.exports = { createCaptcha, verifyCaptcha, cleanupExpired };