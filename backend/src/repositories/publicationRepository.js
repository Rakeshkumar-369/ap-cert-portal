// src/repositories/publicationRepository.js
const pool = require('../config/db');

class PublicationRepository {
  async create({ title, description, file_path, original_filename, file_size, mime_type, uploaded_by }) {
    const [result] = await pool.query(
      `INSERT INTO publications (title, description, file_path, original_filename, file_size, mime_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, file_path, original_filename, file_size, mime_type, uploaded_by]
    );
    return { id: result.insertId };
  }

  async findAllActive(limit, offset) {
    const [rows] = await pool.query(
      `SELECT p.id, p.title, p.description, p.file_path, p.original_filename, p.file_size, p.mime_type,
              p.uploaded_by, u.name as uploader_name, p.created_at
       FROM publications p
       JOIN users u ON p.uploaded_by = u.id
       WHERE p.status = 'ACTIVE'
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async countAllActive() {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM publications WHERE status = 'ACTIVE'"
    );
    return rows[0].total;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, u.name as uploader_name
       FROM publications p
       JOIN users u ON p.uploaded_by = u.id
       WHERE p.id = ? AND p.status = 'ACTIVE'`,
      [id]
    );
    return rows[0];
  }

  async update(id, { title, description }) {
    const [result] = await pool.query(
      `UPDATE publications SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`,
      [title, description, id]
    );
    return result.affectedRows > 0;
  }

  async softDelete(id) {
    const [result] = await pool.query(
      "UPDATE publications SET status = 'DELETED' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new PublicationRepository();
