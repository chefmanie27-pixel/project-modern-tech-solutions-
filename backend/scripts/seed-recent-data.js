// scripts/seed-recent-data.js
//
// Regenerates attendance_records and payroll_runs so they're always
// relative to *today* instead of fixed calendar dates baked into
// db/seed.sql. Run this any time the dashboard's Attendance Overview
// or Payroll Trend looks stale ("last month's" dates, chart not
// updating, etc).
//
// Usage:
//   node scripts/seed-recent-data.js
//
// Safe to re-run: it deletes and reinserts only attendance_records and
// payroll_runs, leaving employees/departments/users/leave_requests intact.

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const STATUS_WEIGHTS = [
  ["Present", 0.86],
  ["Absent", 0.06],
  ["Half-Day", 0.05],
  ["Late", 0.03],
];

function pickStatus() {
  const r = Math.random();
  let acc = 0;
  for (const [status, weight] of STATUS_WEIGHTS) {
    acc += weight;
    if (r <= acc) return status;
  }
  return "Present";
}

function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}

// Last N *weekdays* ending today (or yesterday if today is a weekend),
// oldest first.
function lastNWeekdays(n, from = new Date()) {
  const days = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  while (days.length < n) {
    const dow = cursor.getDay(); // 0 = Sun, 6 = Sat
    if (dow !== 0 && dow !== 6) days.unshift(new Date(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  return days;
}

// Last N calendar months (as {start, end} pay periods), oldest first,
// ending with the month containing `from`.
function lastNMonths(n, from = new Date()) {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const start = new Date(from.getFullYear(), from.getMonth() - i, 1);
    const end = new Date(from.getFullYear(), from.getMonth() - i + 1, 0);
    months.push({ start, end });
  }
  return months;
}

async function seedRecentData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "moderntech",
  });

  try {
    const [employees] = await connection.query(
      "SELECT employee_id, salary FROM employees WHERE status != 'terminated'",
    );

    if (employees.length === 0) {
      console.log(
        "⚠️  No employees found — run scripts/setup-data.js first to create employees, then re-run this script.",
      );
      return;
    }

    console.log(`📦 Reseeding attendance & payroll for ${employees.length} employees...`);

    await connection.query("DELETE FROM attendance_records");
    await connection.query("DELETE FROM payroll_runs");

    // --- Attendance: last 10 weekdays, ending today ---
    const days = lastNWeekdays(10);
    const attendanceRows = [];
    for (const emp of employees) {
      for (const day of days) {
        const status = pickStatus();
        const clockIn = status === "Absent" ? null : "08:00";
        const clockOut = status === "Absent" ? null : "17:00";
        attendanceRows.push([
          emp.employee_id,
          fmtDate(day),
          status,
          clockIn,
          clockOut,
        ]);
      }
    }
    await connection.query(
      "INSERT INTO attendance_records (employee_id, record_date, status, clock_in, clock_out) VALUES ?",
      [attendanceRows],
    );
    console.log(`✅ Inserted ${attendanceRows.length} attendance records (${fmtDate(days[0])} → ${fmtDate(days[days.length - 1])})`);

    // --- Payroll: last 7 calendar months, ending with the current month ---
    const months = lastNMonths(7);
    const payrollRows = [];
    for (const { start, end } of months) {
      for (const emp of employees) {
        const monthlySalary = Number(emp.salary) / 12;
        // +/-6% natural month-to-month variation
        const variation = 1 + (Math.random() * 0.12 - 0.06);
        const gross = Math.round(monthlySalary * variation * 100) / 100;
        const taxDeductions = Math.round(gross * 0.18 * 100) / 100;
        const leaveDeductions =
          Math.random() < 0.2
            ? Math.round(monthlySalary * 0.03 * 100) / 100
            : 0;
        const netPay =
          Math.round((gross - taxDeductions - leaveDeductions) * 100) / 100;
        const hoursWorked = 144 + Math.floor(Math.random() * 30);
        // Most recent month is still "processed", older ones are "paid"
        const isCurrentMonth =
          start.getMonth() === new Date().getMonth() &&
          start.getFullYear() === new Date().getFullYear();

        payrollRows.push([
          emp.employee_id,
          fmtDate(start),
          fmtDate(end),
          hoursWorked,
          gross,
          leaveDeductions,
          taxDeductions,
          netPay,
          isCurrentMonth ? "processed" : "paid",
        ]);
      }
    }
    await connection.query(
      `INSERT INTO payroll_runs
        (employee_id, pay_period_start, pay_period_end, hours_worked, gross_pay, leave_deductions, tax_deductions, net_pay, status)
       VALUES ?`,
      [payrollRows],
    );
    console.log(
      `✅ Inserted ${payrollRows.length} payroll runs (${fmtDate(months[0].start)} → ${fmtDate(months[months.length - 1].end)})`,
    );

    console.log("🎉 Done. Refresh the dashboard to see current dates and a real payroll trend.");
  } catch (error) {
    console.error("❌ Error reseeding recent data:", error);
  } finally {
    await connection.end();
  }
}

seedRecentData();
