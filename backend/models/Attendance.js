// models/Attendance.js
import { query } from '../config/db.js';

async function findAll({ startDate, endDate, department, page = 1, limit = 50 } = {}) {
  const conditions = [];
  const values = [];

  let baseQuery = `
    SELECT a.attendance_id, a.employee_id, e.name AS employee_name,
           a.record_date, a.status, a.clock_in, a.clock_out
    FROM attendance_records a
    JOIN employees e ON e.employee_id = a.employee_id
  `;

  if (department) {
    baseQuery += ` JOIN departments d ON d.department_id = e.department_id `;
    conditions.push(`d.name = ?`);
    values.push(department);
  }
  if (startDate) {
    conditions.push(`a.record_date >= ?`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`a.record_date <= ?`);
    values.push(endDate);
  }

  if (conditions.length) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }

  const offset = (Math.max(1, page) - 1) * limit;
  baseQuery += ` ORDER BY a.record_date DESC LIMIT ? OFFSET ?`;
  values.push(limit, offset);

  const rows = await query(baseQuery, values);
  return rows;
}

async function findByEmployeeId(employeeId, { startDate, endDate } = {}) {
  const conditions = ['employee_id = ?'];
  const values = [employeeId];

  if (startDate) {
    conditions.push(`record_date >= ?`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`record_date <= ?`);
    values.push(endDate);
  }

  const sql = `
    SELECT attendance_id, employee_id, record_date, status, clock_in, clock_out
    FROM attendance_records
    WHERE ${conditions.join(' AND ')}
    ORDER BY record_date DESC
  `;

  const rows = await query(sql, values);
  return rows;
}

async function create({ employee_id, record_date, status, clock_in, clock_out }) {
  const sql = `
    INSERT INTO attendance_records (employee_id, record_date, status, clock_in, clock_out)
    VALUES (?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [employee_id, record_date, status, clock_in || null, clock_out || null]);
  
  // Get the inserted record
  const rows = await query(
    'SELECT attendance_id, employee_id, record_date, status, clock_in, clock_out FROM attendance_records WHERE attendance_id = LAST_INSERT_ID()'
  );
  return rows[0];
}

async function update(attendanceId, fields) {
  const allowed = ['status', 'clock_in', 'clock_out', 'record_date'];
  const sets = [];
  const values = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (!sets.length) return null;

  values.push(attendanceId);
  const sql = `
    UPDATE attendance_records
    SET ${sets.join(', ')}
    WHERE attendance_id = ?
  `;
  await query(sql, values);

  // Return updated record
  const rows = await query(
    'SELECT attendance_id, employee_id, record_date, status, clock_in, clock_out FROM attendance_records WHERE attendance_id = ?',
    [attendanceId]
  );
  return rows[0] || null;
}

async function getSummary({ startDate, endDate } = {}) {
  const conditions = [];
  const values = [];

  if (startDate) {
    conditions.push(`record_date >= ?`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`record_date <= ?`);
    values.push(endDate);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present_count,
      SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
      SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) AS late_count,
      SUM(CASE WHEN status = 'Half-Day' THEN 1 ELSE 0 END) AS half_day_count,
      COUNT(*) AS total_records
    FROM attendance_records
    ${whereClause}
  `;

  const rows = await query(sql, values);
  const r = rows[0] || {};
  const total = Number(r.total_records) || 0;
  const present = Number(r.present_count) || 0;

  return {
    present: present,
    absent: Number(r.absent_count) || 0,
    late: Number(r.late_count) || 0,
    halfDay: Number(r.half_day_count) || 0,
    totalRecords: total,
    attendanceRate: total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0,
  };
}

async function existsForDate(employeeId, recordDate, excludeAttendanceId = null) {
  let sql = `SELECT 1 FROM attendance_records WHERE employee_id = ? AND record_date = ?`;
  const values = [employeeId, recordDate];
  if (excludeAttendanceId) {
    sql += ` AND attendance_id != ?`;
    values.push(excludeAttendanceId);
  }
  const rows = await query(sql, values);
  return rows.length > 0;
}

export {
  findAll,
  findByEmployeeId,
  create,
  update,
  getSummary,
  existsForDate,
};
