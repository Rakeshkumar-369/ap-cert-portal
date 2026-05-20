const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', '..', 'captcha.db'));

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS captchas (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0
  )
`);

module.exports = db;