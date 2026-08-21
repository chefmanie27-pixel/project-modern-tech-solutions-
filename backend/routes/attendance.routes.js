// routes/attendance.routes.js
import express from "express";
const router = express.Router();

import {
  getAllAttendance,
  getAttendanceByEmployee,
  createAttendance,
  updateAttendance,
  getSummary,
} from "../controllers/attendance.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

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

export default router;
