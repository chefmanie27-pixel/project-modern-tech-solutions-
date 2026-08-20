// routes/attendance.routes.js
const express = require("express");
const router = express.Router();

const {
  getAllAttendance,
  getAttendanceByEmployee,
  createAttendance,
  updateAttendance,
  getSummary,
} = require("../controllers/attendance.controller");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

// All attendance routes require authentication
router.use(authMiddleware);

// GET /api/v1/attendance/summary
router.get("/summary", getSummary);

// GET /api/v1/attendance
router.get("/", getAllAttendance);

// GET /api/v1/attendance/:employeeId
router.get("/:employeeId", getAttendanceByEmployee);

// POST /api/v1/attendance
router.post("/", createAttendance);

// PATCH /api/v1/attendance/:id
router.patch("/:id", requireRole("admin", "hr"), updateAttendance);

module.exports = router;