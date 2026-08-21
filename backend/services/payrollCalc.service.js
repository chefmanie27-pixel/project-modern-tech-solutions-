// services/payrollCalc.service.js
// Pure calculation logic: base salary -> gross/deductions/net.

const STANDARD_HOURS = 160; // assumed full-time hours per pay period
const TAX_RATE = 0.18; // assumed flat rate placeholder

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * @param {Object} params
 * @param {number} params.baseSalary - employee's base salary for the period
 * @param {number} [params.hoursWorked] - hours actually worked
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

  // Calculate gross pay (prorated if hours worked is provided)
  const grossPay = (hoursWorked != null && standardHours > 0)
    ? round2(baseSalary * (hoursWorked / standardHours))
    : round2(baseSalary);

  // Apply leave deductions
  const afterLeave = Math.max(0, round2(grossPay - leaveDeductions));
  
  // Calculate tax
  const taxDeductions = round2(afterLeave * taxRate);
  
  // Calculate net pay
  const netPay = round2(afterLeave - taxDeductions);

  return {
    gross_pay: grossPay,
    leave_deductions: round2(leaveDeductions),
    tax_deductions: taxDeductions,
    net_pay: netPay,
  };
}

export { calculatePayroll, STANDARD_HOURS, TAX_RATE };
