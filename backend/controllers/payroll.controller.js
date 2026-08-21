// controllers/payroll.controller.js
// Request-handling logic for /api/v1/payroll.

import * as Payroll from "../models/Payroll.js";
import * as Employee from "../models/Employee.js";
import * as payrollCalc from "../services/payrollCalc.service.js";
import * as payrollApi from "../services/payrollApi.service.js";

// GET /api/v1/payroll — all payroll runs, optionally filtered by period
async function listPayroll(req, res, next) {
  try {
    const { periodStart, periodEnd } = req.query;
    const runs = await Payroll.getAll({ periodStart, periodEnd });
    res.json(runs);
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/payroll/:employeeId — one employee's payslip history
async function getEmployeePayroll(req, res, next) {
  try {
    const employee = await Employee.getById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const runs = await Payroll.getByEmployeeId(req.params.employeeId);
    res.json(runs);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/payroll/run — calculate and record a payroll run for one employee/period
async function runPayroll(req, res, next) {
  try {
    const {
      employee_id,
      pay_period_start,
      pay_period_end,
      hours_worked,
      leave_deductions,
      status,
    } = req.body;

    if (!employee_id || !pay_period_start || !pay_period_end) {
      return res.status(400).json({
        message: "employee_id, pay_period_start, and pay_period_end are required",
      });
    }
    if (new Date(pay_period_end) < new Date(pay_period_start)) {
      return res.status(400).json({ message: "pay_period_end cannot be before pay_period_start" });
    }

    const employee = await Employee.getById(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const existing = await Payroll.findExistingRun(employee_id, pay_period_start, pay_period_end);
    if (existing) {
      return res.status(409).json({
        message: "A payroll run already exists for this employee and period",
        payroll: existing,
      });
    }

    const calc = payrollCalc.calculatePayroll({
      baseSalary: Number(employee.salary),
      hoursWorked: hours_worked != null ? Number(hours_worked) : undefined,
      leaveDeductions: leave_deductions != null ? Number(leave_deductions) : 0,
    });

    const run = await Payroll.create({
      employee_id,
      pay_period_start,
      pay_period_end,
      hours_worked: hours_worked != null ? Number(hours_worked) : null,
      ...calc,
      status: status || "processed",
    });

    res.status(201).json(run);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/payroll/:id/disburse — call external payment API to pay out
async function disbursePayroll(req, res, next) {
  try {
    const run = await Payroll.getById(req.params.id);
    if (!run) {
      return res.status(404).json({ message: "Payroll run not found" });
    }
    if (run.status === "paid") {
      return res.status(409).json({ message: "This payroll run has already been paid", payroll: run });
    }

    const employee = await Employee.getById(run.employee_id);
    const result = await payrollApi.disburse({ payrollRun: run, employee });

    const updated = await Payroll.updateStatus(req.params.id, "paid");
    res.json({ payroll: updated, disbursement: result });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/payroll/:id/payslip — return payslip data (JSON; swap in a PDF
// renderer here later if the brief needs an actual PDF file)
async function getPayslip(req, res, next) {
  try {
    const run = await Payroll.getById(req.params.id);
    if (!run) {
      return res.status(404).json({ message: "Payroll run not found" });
    }

    res.json({
      payslip_id: run.payroll_id,
      employee: {
        id: run.employee_id,
        name: run.employee_name,
        position: run.position,
        contact: run.contact,
      },
      pay_period: {
        start: run.pay_period_start,
        end: run.pay_period_end,
      },
      hours_worked: run.hours_worked,
      earnings: {
        gross_pay: run.gross_pay,
      },
      deductions: {
        leave_deductions: run.leave_deductions,
        tax_deductions: run.tax_deductions,
      },
      net_pay: run.net_pay,
      status: run.status,
      processed_at: run.processed_at,
    });
  } catch (err) {
    next(err);
  }
}

export {
  listPayroll,
  getEmployeePayroll,
  runPayroll,
  disbursePayroll,
  getPayslip,
};
