// src/repositories/downloadRepository.js
const pool = require('../config/db');

class DownloadRepository {
  async create({ title, description, file_path, original_filename, file_size, mime_type, uploaded_by }) {
    const [result] = await pool.query(
      `INSERT INTO downloads (title, description, file_path, original_filename, file_size, mime_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, file_path, original_filename, file_size, mime_type, uploaded_by]
    );
    return { id: result.insertId };
  }

  async findAllActive(limit, offset) {
    const [rows] = await pool.query(
      `SELECT d.id, d.title, d.description, d.file_path, d.original_filename, d.file_size, d.mime_type,
              d.uploaded_by, u.name as uploader_name, d.created_at
       FROM downloads d
       JOIN users u ON d.uploaded_by = u.id
       WHERE d.status = 'ACTIVE'
       ORDER BY d.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async countAllActive() {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM downloads WHERE status = 'ACTIVE'"
    );
    return rows[0].total;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT d.*, u.name as uploader_name
       FROM downloads d
       JOIN users u ON d.uploaded_by = u.id
       WHERE d.id = ? AND d.status = 'ACTIVE'`,
      [id]
    );
    return rows[0];
  }

  async update(id, { title, description }) {
    const [result] = await pool.query(
      `UPDATE downloads SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`,
      [title, description, id]
    );
    return result.affectedRows > 0;
  }

  async softDelete(id) {
    const [result] = await pool.query(
      "UPDATE downloads SET status = 'DELETED' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new DownloadRepository();
