// controllers/attendance.controller.js
const Attendance = require('../models/Attendance');

const VALID_STATUSES = ['Present', 'Absent', 'Late', 'Half-Day'];

async function getAllAttendance(req, res, next) {
  try {
    const { startDate, endDate, department, page, limit } = req.query;
    const records = await Attendance.findAll({
      startDate,
      endDate,
      department,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    res.json({ data: records });
  } catch (err) {
    next(err);
  }
}

async function getAttendanceByEmployee(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    const records = await Attendance.findByEmployeeId(employeeId, { startDate, endDate });
    res.json({ data: records });
  } catch (err) {
    next(err);
  }
}

async function createAttendance(req, res, next) {
  try {
    const { employee_id, record_date, status, clock_in, clock_out } = req.body;

    if (!employee_id || !record_date || !status) {
      return res.status(400).json({ message: 'employee_id, record_date, and status are required.' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const duplicate = await Attendance.existsForDate(employee_id, record_date);
    if (duplicate) {
      return res.status(409).json({ message: 'An attendance record already exists for this employee on this date.' });
    }

    const record = await Attendance.create({ employee_id, record_date, status, clock_in, clock_out });
    res.status(201).json({ data: record });
  } catch (err) {
    // Also guard against a race on the DB's UNIQUE(employee_id, record_date) constraint
    if (err.code === '23505') {
      return res.status(409).json({ message: 'An attendance record already exists for this employee on this date.' });
    }
    next(err);
  }
}

async function updateAttendance(req, res, next) {
  try {
    const { id } = req.params;
    const { status, clock_in, clock_out, record_date } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const updated = await Attendance.update(id, { status, clock_in, clock_out, record_date });
    if (!updated) {
      return res.status(404).json({ message: 'Attendance record not found or no fields provided to update.' });
    }
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function getSummary(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const summary = await Attendance.getSummary({ startDate, endDate });
    res.json({ data: summary });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllAttendance, getAttendanceByEmployee, createAttendance, updateAttendance, getSummary };