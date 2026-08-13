// models/Employee.js
// Raw SQL queries for the employees table. Controllers call these —
// keeps SQL out of route/controller files.

const { pool } = require("../config/db");

async function getAll() {
  const [rows] = await pool.query(
    `SELECT e.*, d.name AS department_name
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.department_id
     ORDER BY e.name`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT e.*, d.name AS department_name
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.department_id
     WHERE e.employee_id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create({ name, position, department_id, salary, contact, employment_history, hire_date }) {
  const [result] = await pool.query(
    `INSERT INTO employees (name, position, department_id, salary, contact, employment_history, hire_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, position, department_id, salary, contact, employment_history, hire_date]
  );
  return getById(result.insertId);
}

async function update(id, fields) {
  const columns = Object.keys(fields);
  if (columns.length === 0) return getById(id);

  const setClause = columns.map((col) => `${col} = ?`).join(", ");
  const values = columns.map((col) => fields[col]);

  await pool.query(`UPDATE employees SET ${setClause} WHERE employee_id = ?`, [...values, id]);
  return getById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM employees WHERE employee_id = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
