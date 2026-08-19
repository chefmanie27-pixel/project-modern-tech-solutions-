<<<<<<< HEAD
// models/User.js
// Raw SQL queries for the users table.
// Minimal for now (just what login/me needs) — Wendy owns expanding this
// (register, password reset, session/blacklist table, etc.) per the plan.

const { pool } = require("../config/db");

async function getByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0] || null;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT user_id, employee_id, email, role, created_at, last_login FROM users WHERE user_id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function touchLastLogin(id) {
  await pool.query(`UPDATE users SET last_login = NOW() WHERE user_id = ?`, [id]);
}

module.exports = { getByEmail, getById, touchLastLogin };
=======
const { pool } = require("../config/db");

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

module.exports = {
  findByEmail,
  findById,
  updateLastLogin,
  create,
};
>>>>>>> origin/backend/wendy
