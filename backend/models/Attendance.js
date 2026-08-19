// models/Attendance.js
import { query as _query } from '../config/db';


async function findAll({ startDate, endDate, department, page = 1, limit = 50 } = {}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  let baseQuery = `
    SELECT a.attendance_id, a.employee_id, e.name AS employee_name,
           a.record_date, a.status, a.clock_in, a.clock_out
    FROM attendance_records a
    JOIN employees e ON e.employee_id = a.employee_id
  `;

  if (department) {
    baseQuery += ` JOIN departments d ON d.department_id = e.department_id `;
    conditions.push(`d.name = $${idx++}`);
    values.push(department);
  }
  if (startDate) {
    conditions.push(`a.record_date >= $${idx++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`a.record_date <= $${idx++}`);
    values.push(endDate);
  }

  if (conditions.length) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }

  const offset = (Math.max(1, page) - 1) * limit;
  baseQuery += ` ORDER BY a.record_date DESC LIMIT $${idx++} OFFSET $${idx++}`;
  values.push(limit, offset);

  const { rows } = await _query(baseQuery, values);
  return rows;
}

async function findByEmployeeId(employeeId, { startDate, endDate } = {}) {
  const conditions = ['employee_id = $1'];
  const values = [employeeId];
  let idx = 2;

  if (startDate) {
    conditions.push(`record_date >= $${idx++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`record_date <= $${idx++}`);
    values.push(endDate);
  }

  const query = `
    SELECT attendance_id, employee_id, record_date, status, clock_in, clock_out
    FROM attendance_records
    WHERE ${conditions.join(' AND ')}
    ORDER BY record_date DESC
  `;

  const { rows } = await _query(query, values);
  return rows;
}

async function create({ employee_id, record_date, status, clock_in, clock_out }) {
  const query = `
    INSERT INTO attendance_records (employee_id, record_date, status, clock_in, clock_out)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING attendance_id, employee_id, record_date, status, clock_in, clock_out
  `;
  const { rows } = await _query(query, [employee_id, record_date, status, clock_in || null, clock_out || null]);
  return rows[0];
}

async function update(attendanceId, fields) {
  const allowed = ['status', 'clock_in', 'clock_out', 'record_date'];
  const sets = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = $${idx++}`);
      values.push(fields[key]);
    }
  }

  if (!sets.length) return null;

  values.push(attendanceId);
  const query = `
    UPDATE attendance_records
    SET ${sets.join(', ')}
    WHERE attendance_id = $${idx}
    RETURNING attendance_id, employee_id, record_date, status, clock_in, clock_out
  `;
  const { rows } = await _query(query, values);
  return rows[0] || null;
}

/**
 * Aggregated present/absent/late/half-day counts for a date range.
 * Mirrors what dashboard.js's calculateKPIs() currently computes
 * client-side, so James's dashboard can call this instead of
 * recomputing from raw records.
 */
async function getSummary({ startDate, endDate } = {}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (startDate) {
    conditions.push(`record_date >= $${idx++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`record_date <= $${idx++}`);
    values.push(endDate);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      COUNT(*) FILTER (WHERE status = 'Present')  AS present_count,
      COUNT(*) FILTER (WHERE status = 'Absent')   AS absent_count,
      COUNT(*) FILTER (WHERE status = 'Late')     AS late_count,
      COUNT(*) FILTER (WHERE status = 'Half-Day') AS half_day_count,
      COUNT(*) AS total_records
    FROM attendance_records
    ${whereClause}
  `;

  const { rows } = await _query(query, values);
  const r = rows[0];
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
  let query = `SELECT 1 FROM attendance_records WHERE employee_id = $1 AND record_date = $2`;
  const values = [employeeId, recordDate];
  if (excludeAttendanceId) {
    query += ` AND attendance_id != $3`;
    values.push(excludeAttendanceId);
  }
  const { rows } = await _query(query, values);
  return rows.length > 0;
}

export default { findAll, findByEmployeeId, create, update, getSummary, existsForDate };