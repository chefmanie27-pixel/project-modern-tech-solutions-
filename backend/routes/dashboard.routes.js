// routes/dashboard.routes.js
const express = require("express");
const router = express.Router();

const {
  getKpis,
  getAttendanceChart,
  getDepartmentHeadcount,
  getPayrollTrend,
} = require("../controllers/dashboard.controller");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/kpis", getKpis);
router.get("/attendance-chart", getAttendanceChart);
router.get("/department-headcount", getDepartmentHeadcount);
router.get("/payroll-trend", getPayrollTrend);

module.exports = router;