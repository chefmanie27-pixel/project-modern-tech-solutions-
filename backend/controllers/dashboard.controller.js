// controllers/dashboard.controller.js
const { pool } = require("../config/db");

async function getKpis(req, res, next) {
  try {
    const [[row]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM employees WHERE status = 'active') AS active_employees,
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT COUNT(*) FROM employees WHERE status = 'on_leave') AS on_leave_count,
        (SELECT COALESCE(SUM(net_pay), 0) FROM payroll_runs
           WHERE pay_period_end = (SELECT MAX(pay_period_end) FROM payroll_runs)) AS monthly_payroll,
        (SELECT COUNT(*) FROM leave_requests WHERE status = 'Pending') AS pending_requests,
        (SELECT ROUND(100.0 * SUM(status = 'Present') / NULLIF(COUNT(*), 0))
           FROM attendance_records WHERE record_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) AS avg_attendance
    `);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

async function getAttendanceChart(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT record_date,
        SUM(status = 'Present') AS present_count,
        SUM(status = 'Absent') AS absent_count,
        SUM(status = 'Half-Day') AS half_day_count
      FROM attendance_records
      WHERE record_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY record_date
      ORDER BY record_date
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getDepartmentHeadcount(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT d.name AS department, COUNT(e.employee_id) AS count
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.department_id AND e.status = 'active'
      GROUP BY d.name
      ORDER BY count DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getPayrollTrend(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(pay_period_end, '%Y-%m') AS month, SUM(net_pay) AS total
      FROM payroll_runs
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { getKpis, getAttendanceChart, getDepartmentHeadcount, getPayrollTrend };