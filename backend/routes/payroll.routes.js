// routes/payroll.routes.js
import express from "express";
const router = express.Router();

import {
  listPayroll,
  getEmployeePayroll,
  runPayroll,
  disbursePayroll,
  getPayslip,
} from "../controllers/payroll.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

// All payroll routes require a logged-in user
router.use(authMiddleware);

// Viewing payroll data — admin/hr/manager only (salary info is sensitive)
router.get("/", requireRole("admin", "hr", "manager"), listPayroll);
router.get("/:employeeId", requireRole("admin", "hr", "manager"), getEmployeePayroll);

// Running and disbursing payroll — admin/hr only
router.post("/run", requireRole("admin", "hr"), runPayroll);
router.post("/:id/disburse", requireRole("admin", "hr"), disbursePayroll);

// Payslip — admin/hr/manager for now; revisit if employees should view their own
router.get("/:id/payslip", requireRole("admin", "hr", "manager"), getPayslip);

export default router;
