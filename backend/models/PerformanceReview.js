// models/PerformanceReview.js
import { pool } from "../config/db.js";

async function getAll() {
  const [rows] = await pool.query("SELECT * FROM performance_reviews ORDER BY review_date DESC");
  return rows;
}

async function getByEmployee(employeeId) {
  const [rows] = await pool.query(
    "SELECT * FROM performance_reviews WHERE employee_id = ? ORDER BY review_date DESC",
    [employeeId]
  );
  return rows;
}

async function create(data) {
  const { employee_id, reviewer_id, period, review_date, technical_skill, collaboration, communication, strengths, areas_to_grow } = data;
  const [result] = await pool.query(
    `INSERT INTO performance_reviews
      (employee_id, reviewer_id, period, review_date, technical_skill, collaboration, communication, strengths, areas_to_grow)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [employee_id, reviewer_id, period, review_date, technical_skill, collaboration, communication, strengths, areas_to_grow]
  );
  const [rows] = await pool.query("SELECT * FROM performance_reviews WHERE review_id = ?", [result.insertId]);
  return rows[0];
}

export { getAll, getByEmployee, create };
