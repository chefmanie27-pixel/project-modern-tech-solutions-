import { pool } from "../config/db.js";

async function getAll() {
  const [rows] = await pool.query(`
    SELECT
      lr.leave_id,
      lr.employee_id,
      e.name AS employee,
      lr.leave_type,
      lr.start_date,
      lr.end_date,
      lr.reason,
      lr.status,
      lr.reviewed_by,
      lr.requested_at,
      lr.reviewed_at
    FROM leave_requests lr
    INNER JOIN employees e
      ON e.employee_id = lr.employee_id
    ORDER BY lr.requested_at DESC
  `);

  return rows;
}

async function getById(leaveId) {
  const [rows] = await pool.query(
    `
      SELECT
        lr.leave_id,
        lr.employee_id,
        e.name AS employee,
        lr.leave_type,
        lr.start_date,
        lr.end_date,
        lr.reason,
        lr.status,
        lr.reviewed_by,
        lr.requested_at,
        lr.reviewed_at
      FROM leave_requests lr
      INNER JOIN employees e
        ON e.employee_id = lr.employee_id
      WHERE lr.leave_id = ?
    `,
    [leaveId],
  );

  return rows[0] || null;
}

async function create({ employeeId, leaveType, startDate, endDate, reason }) {
  const [result] = await pool.query(
    `
      INSERT INTO leave_requests
        (employee_id, leave_type, start_date, end_date, reason)
      VALUES (?, ?, ?, ?, ?)
    `,
    [employeeId, leaveType, startDate, endDate, reason || null],
  );

  return getById(result.insertId);
}

async function update(leaveId, { leaveType, startDate, endDate, reason }) {
  await pool.query(
    `
      UPDATE leave_requests
      SET
        leave_type = ?,
        start_date = ?,
        end_date = ?,
        reason = ?
      WHERE leave_id = ?
    `,
    [leaveType, startDate, endDate, reason || null, leaveId],
  );

  return getById(leaveId);
}

async function remove(leaveId) {
  const [result] = await pool.query(
    `
      DELETE FROM leave_requests
      WHERE leave_id = ?
    `,
    [leaveId],
  );

  return result.affectedRows > 0;
}

async function updateStatus(leaveId, status, reviewedBy) {
  await pool.query(
    `
      UPDATE leave_requests
      SET
        status = ?,
        reviewed_by = ?,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE leave_id = ?
    `,
    [status, reviewedBy, leaveId],
  );

  return getById(leaveId);
}

export {
  getAll,
  getById,
  create,
  update,
  remove,
  updateStatus,
};
