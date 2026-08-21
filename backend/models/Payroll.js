// models/Payroll.js
// Raw SQL queries for the payroll_runs table. Controllers call these —
// keeps SQL out of route/controller files. Mirrors the style of Employee.js.

import { pool } from "../config/db.js";

async function getAll({ periodStart, periodEnd } = {}) {
  let sql = `SELECT p.*, e.name AS employee_name
             FROM payroll_runs p
             JOIN employees e ON p.employee_id = e.employee_id`;
  const conditions = [];
  const values = [];

  if (periodStart) {
    conditions.push("p.pay_period_start >= ?");
    values.push(periodStart);
  }
  if (periodEnd) {
    conditions.push("p.pay_period_end <= ?");
    values.push(periodEnd);
  }
  if (conditions.length) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }
  sql += " ORDER BY p.pay_period_end DESC, e.name";

  const [rows] = await pool.query(sql, values);
  return rows;
}

async function getByEmployeeId(employeeId) {
  const [rows] = await pool.query(
    `SELECT p.*, e.name AS employee_name
     FROM payroll_runs p
     JOIN employees e ON p.employee_id = e.employee_id
     WHERE p.employee_id = ?
     ORDER BY p.pay_period_end DESC`,
    [employeeId]
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, e.name AS employee_name, e.position, e.contact
     FROM payroll_runs p
     JOIN employees e ON p.employee_id = e.employee_id
     WHERE p.payroll_id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findExistingRun(employeeId, periodStart, periodEnd) {
  const [rows] = await pool.query(
    `SELECT * FROM payroll_runs
     WHERE employee_id = ? AND pay_period_start = ? AND pay_period_end = ?`,
    [employeeId, periodStart, periodEnd]
  );
  return rows[0] || null;
}

async function create({
  employee_id,
  pay_period_start,
  pay_period_end,
  hours_worked,
  gross_pay,
  leave_deductions,
  tax_deductions,
  net_pay,
  status = "processed",
}) {
  const [result] = await pool.query(
    `INSERT INTO payroll_runs
      (employee_id, pay_period_start, pay_period_end, hours_worked, gross_pay, leave_deductions, tax_deductions, net_pay, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employee_id,
      pay_period_start,
      pay_period_end,
      hours_worked,
      gross_pay,
      leave_deductions,
      tax_deductions,
      net_pay,
      status,
    ]
  );
  return getById(result.insertId);
}

async function updateStatus(id, status) {
  await pool.query(`UPDATE payroll_runs SET status = ? WHERE payroll_id = ?`, [status, id]);
  return getById(id);
}

export { getAll, getByEmployeeId, getById, findExistingRun, create, updateStatus };
