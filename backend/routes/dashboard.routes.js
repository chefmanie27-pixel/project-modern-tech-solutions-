// routes/dashboard.routes.js
import express from "express";
const router = express.Router();

import {
  getKpis,
  getAttendanceChart,
  getDepartmentHeadcount,
  getPayrollTrend,
} from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.get("/kpis", getKpis);
router.get("/attendance-chart", getAttendanceChart);
router.get("/department-headcount", getDepartmentHeadcount);
router.get("/payroll-trend", getPayrollTrend);

export default router;
