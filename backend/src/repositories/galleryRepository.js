// src/repositories/galleryRepository.js
const pool = require('../config/db');

class GalleryRepository {
  async create({ title, caption, file_path, original_filename, file_size, mime_type, uploaded_by }) {
    const [result] = await pool.query(
      `INSERT INTO gallery (title, caption, file_path, original_filename, file_size, mime_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, caption, file_path, original_filename, file_size, mime_type, uploaded_by]
    );
    return { id: result.insertId };
  }

  async findAllActive(limit, offset) {
    const [rows] = await pool.query(
      `SELECT g.id, g.title, g.caption, g.file_path, g.original_filename, g.file_size, g.mime_type,
              g.uploaded_by, u.name as uploader_name, g.created_at
       FROM gallery g
       JOIN users u ON g.uploaded_by = u.id
       WHERE g.status = 'ACTIVE'
       ORDER BY g.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async countAllActive() {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM gallery WHERE status = 'ACTIVE'"
    );
    return rows[0].total;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT g.*, u.name as uploader_name
       FROM gallery g
       JOIN users u ON g.uploaded_by = u.id
       WHERE g.id = ? AND g.status = 'ACTIVE'`,
      [id]
    );
    return rows[0];
  }

  async softDelete(id) {
    const [result] = await pool.query(
      "UPDATE gallery SET status = 'DELETED' WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new GalleryRepository();
