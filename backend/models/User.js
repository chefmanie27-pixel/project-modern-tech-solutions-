import { pool } from "../config/db.js";

async function findByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT user_id, employee_id, email, password_hash, role, created_at, last_login
     FROM users
     WHERE email = ?`,
    [email],
  );

  return rows[0] || null;
}

async function findById(userId) {
  const [rows] = await pool.execute(
    `SELECT user_id, employee_id, email, password_hash, role, created_at, last_login
     FROM users
     WHERE user_id = ?`,
    [userId],
  );

  return rows[0] || null;
}

async function updateLastLogin(userId) {
  await pool.execute(
    `UPDATE users
     SET last_login = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [userId],
  );
}

async function create({ employeeId, email, passwordHash, role }) {
  const [result] = await pool.execute(
    `INSERT INTO users (employee_id, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [employeeId || null, email, passwordHash, role],
  );

  return findById(result.insertId);
}

export {
  findByEmail,
  findById,
  updateLastLogin,
  create,
};
