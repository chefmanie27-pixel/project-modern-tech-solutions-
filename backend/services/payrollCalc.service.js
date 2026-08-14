// services/payrollCalc.service.js
// Pure calculation logic: base salary -> gross/deductions/net.
// No DB or HTTP calls here — controllers fetch the employee's base salary
// and pass it in, so this stays easy to unit test.
//
// Formula (per the implementation plan): finalSalary = base - leaveDeductions,
// adjusted by hoursWorked. Concretely:
//   1. Gross pay = base salary, prorated if hours_worked is supplied against
//      a standard full pay-period (STANDARD_HOURS below).
//   2. Leave deductions are subtracted from gross to get taxable pay.
//   3. Tax is calculated on that taxable pay at a flat rate (placeholder —
//      swap for a real tax table/bracket calc if the brief needs one).
//   4. Net pay = taxable pay - tax deductions.
//
// STANDARD_HOURS and TAX_RATE are assumptions, not values pulled from the
// existing front-end data — flag these with the team and adjust to match
// whatever payrollData/payroll.html actually assumes before demo day.
const STANDARD_HOURS = 160; // assumed full-time hours per pay period
const TAX_RATE = 0.18; // assumed flat rate placeholder

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * @param {Object} params
 * @param {number} params.baseSalary - employee's base salary for the period
 * @param {number} [params.hoursWorked] - hours actually worked; omit to use full base salary
 * @param {number} [params.leaveDeductions=0] - amount to deduct for unpaid/leave time
 * @param {number} [params.standardHours=STANDARD_HOURS]
 * @param {number} [params.taxRate=TAX_RATE]
 * @returns {{gross_pay: number, leave_deductions: number, tax_deductions: number, net_pay: number}}
 */
function calculatePayroll({
  baseSalary,
  hoursWorked,
  leaveDeductions = 0,
  standardHours = STANDARD_HOURS,
  taxRate = TAX_RATE,
}) {
  if (typeof baseSalary !== "number" || baseSalary < 0) {
    throw new Error("baseSalary must be a non-negative number");
  }
  if (leaveDeductions < 0) {
    throw new Error("leaveDeductions cannot be negative");
  }

  const grossPay =
    hoursWorked != null && standardHours > 0
      ? round2(baseSalary * (hoursWorked / standardHours))
      : round2(baseSalary);

  const afterLeave = Math.max(0, round2(grossPay - leaveDeductions));
  const taxDeductions = round2(afterLeave * taxRate);
  const netPay = round2(afterLeave - taxDeductions);

  return {
    gross_pay: grossPay,
    leave_deductions: round2(leaveDeductions),
    tax_deductions: taxDeductions,
    net_pay: netPay,
  };
}

module.exports = { calculatePayroll, STANDARD_HOURS, TAX_RATE };
