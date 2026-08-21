// models/Employee.js
// Raw SQL queries for the employees table. Controllers call these —
// keeps SQL out of route/controller files.

import { pool } from "../config/db.js";

// employees.html's form collects a free-text department name, not an id,
// so resolve/create the matching departments row here rather than forcing
// a frontend rework. Returns null (leaves department unset) for blank input.
async function findOrCreateDepartmentId(departmentName) {
  if (!departmentName || !departmentName.trim()) return null;
  const name = departmentName.trim();

  const [existing] = await pool.query(
    `SELECT department_id FROM departments WHERE name = ?`,
    [name]
  );
  if (existing[0]) return existing[0].department_id;

  const [result] = await pool.query(`INSERT INTO departments (name) VALUES (?)`, [name]);
  return result.insertId;
}

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

export { getAll, getById, create, update, remove, findOrCreateDepartmentId };
