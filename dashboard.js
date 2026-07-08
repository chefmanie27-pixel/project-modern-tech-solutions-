/* ==========================================================================
   DATA (hardcoded for now — swap for fetch() from /data once ready)
   ========================================================================== */

const employeeInfo = [
  { employeeId: 1, name: "Sibongile Nkosi", position: "Software Engineer", department: "Development", salary: 70000, contact: "sibongile.nkosi@moderntech.com" },
  { employeeId: 2, name: "Lungile Moyo", position: "HR Manager", department: "HR", salary: 80000, contact: "lungile.moyo@moderntech.com" },
  { employeeId: 3, name: "Thabo Molefe", position: "Quality Analyst", department: "QA", salary: 55000, contact: "thabo.molefe@moderntech.com" },
  { employeeId: 4, name: "Keshav Naidoo", position: "Sales Representative", department: "Sales", salary: 60000, contact: "keshav.naidoo@moderntech.com" },
  { employeeId: 5, name: "Zanele Khumalo", position: "Marketing Specialist", department: "Marketing", salary: 58000, contact: "zanele.khumalo@moderntech.com" },
  { employeeId: 6, name: "Sipho Zulu", position: "UI/UX Designer", department: "Design", salary: 65000, contact: "sipho.zulu@moderntech.com" },
  { employeeId: 7, name: "Naledi Moeketsi", position: "DevOps Engineer", department: "IT", salary: 72000, contact: "naledi.moeketsi@moderntech.com" },
  { employeeId: 8, name: "Farai Gumbo", position: "Content Strategist", department: "Marketing", salary: 56000, contact: "farai.gumbo@moderntech.com" },
  { employeeId: 9, name: "Karabo Dlamini", position: "Accountant", department: "Finance", salary: 62000, contact: "karabo.dlamini@moderntech.com" },
  { employeeId: 10, name: "Fatima Patel", position: "Customer Support Lead", department: "Support", salary: 58000, contact: "fatima.patel@moderntech.com" }
];

const attendanceData = [
  { employeeId: 1, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Absent" },
    { date: "2025-07-27", status: "Present" }, { date: "2025-07-28", status: "Present" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2025-07-22", reason: "Sick Leave", status: "Approved" },
    { date: "2024-12-01", reason: "Personal", status: "Pending" }
  ]},
  { employeeId: 2, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Absent" }, { date: "2025-07-28", status: "Present" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2025-07-15", reason: "Family Responsibility", status: "Denied" },
    { date: "2024-12-02", reason: "Vacation", status: "Approved" }
  ]},
  { employeeId: 3, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Present" }, { date: "2025-07-28", status: "Absent" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2025-07-10", reason: "Medical Appointment", status: "Approved" },
    { date: "2024-12-05", reason: "Personal", status: "Pending" }
  ]},
  { employeeId: 4, attendance: [
    { date: "2025-07-25", status: "Absent" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Present" }, { date: "2025-07-28", status: "Present" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2025-07-20", reason: "Bereavement", status: "Approved" }
  ]},
  { employeeId: 5, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Absent" }, { date: "2025-07-28", status: "Present" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2024-12-01", reason: "Childcare", status: "Pending" }
  ]},
  { employeeId: 6, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Absent" }, { date: "2025-07-28", status: "Present" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2025-07-18", reason: "Sick Leave", status: "Approved" }
  ]},
  { employeeId: 7, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Present" }, { date: "2025-07-28", status: "Absent" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2025-07-22", reason: "Vacation", status: "Pending" }
  ]},
  { employeeId: 8, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Absent" },
    { date: "2025-07-27", status: "Present" }, { date: "2025-07-28", status: "Present" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2024-12-02", reason: "Medical Appointment", status: "Approved" }
  ]},
  { employeeId: 9, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Present" }, { date: "2025-07-28", status: "Absent" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2025-07-19", reason: "Childcare", status: "Denied" }
  ]},
  { employeeId: 10, attendance: [
    { date: "2025-07-25", status: "Present" }, { date: "2025-07-26", status: "Present" },
    { date: "2025-07-27", status: "Absent" }, { date: "2025-07-28", status: "Present" }, { date: "2025-07-29", status: "Present" }
  ], leaveRequests: [
    { date: "2024-12-03", reason: "Vacation", status: "Pending" }
  ]}
];

const payrollData = [
  { employeeId: 1, hoursWorked: 160, leaveDeductions: 8, finalSalary: 69500 },
  { employeeId: 2, hoursWorked: 150, leaveDeductions: 10, finalSalary: 79000 },
  { employeeId: 3, hoursWorked: 170, leaveDeductions: 4, finalSalary: 54800 },
  { employeeId: 4, hoursWorked: 165, leaveDeductions: 6, finalSalary: 59700 },
  { employeeId: 5, hoursWorked: 158, leaveDeductions: 5, finalSalary: 57850 },
  { employeeId: 6, hoursWorked: 168, leaveDeductions: 2, finalSalary: 64800 },
  { employeeId: 7, hoursWorked: 175, leaveDeductions: 3, finalSalary: 71800 },
  { employeeId: 8, hoursWorked: 160, leaveDeductions: 0, finalSalary: 56000 },
  { employeeId: 9, hoursWorked: 155, leaveDeductions: 5, finalSalary: 61500 },
  { employeeId: 10, hoursWorked: 162, leaveDeductions: 4, finalSalary: 57750 }
];

/* ==========================================================================
   KPI CALCULATIONS
   ========================================================================== */

function calculateKPIs() {
  const totalEmployees = employeeInfo.length;

  // GAP: no field marks someone "currently on leave" for today.
  // Workaround: count employees who have at least one APPROVED leave request
  // (this is historical/approved-ever, not "on leave right now" — flag this
  // to your team if it matters for accuracy).
  const onLeaveCount = attendanceData.filter(emp =>
    emp.leaveRequests.some(r => r.status === "Approved")
  ).length;

  const activeEmployees = totalEmployees - onLeaveCount;

  // GAP: no monthly payroll history — this is a single current snapshot,
  // treated as "this month's" net pay total.
  const monthlyPayroll = payrollData.reduce((sum, p) => sum + p.finalSalary, 0);

  // Pending requests = leave requests with status "Pending", across everyone
  const pendingRequests = attendanceData.reduce((count, emp) =>
    count + emp.leaveRequests.filter(r => r.status === "Pending").length, 0
  );

  // Avg attendance = total present days / total possible days, across all employees
  const totalDays = attendanceData.reduce((sum, emp) => sum + emp.attendance.length, 0);
  const presentDays = attendanceData.reduce((sum, emp) =>
    sum + emp.attendance.filter(a => a.status === "Present").length, 0
  );
  const avgAttendance = Math.round((presentDays / totalDays) * 100);

  return { totalEmployees, activeEmployees, onLeaveCount, monthlyPayroll, pendingRequests, avgAttendance };
}

function renderKPIs() {
  const kpis = calculateKPIs();

  // NOTE: these ids don't exist in your HTML yet — add them to the h2/p
  // tags in card-row-1 for this to work (kpi-active-employees etc.)
  document.getElementById("kpi-active-employees").textContent = kpis.activeEmployees;
  document.getElementById("kpi-active-sub").textContent = `${kpis.totalEmployees} in total - ${kpis.onLeaveCount} on leave`;

  document.getElementById("kpi-monthly-payroll").textContent = `R ${Math.round(kpis.monthlyPayroll / 1000)}k`;

  document.getElementById("kpi-pending-requests").textContent = kpis.pendingRequests;

  document.getElementById("kpi-avg-attendance").textContent = `${kpis.avgAttendance}%`;
}

/* ==========================================================================
   ATTENDANCE CHART (grouped bars: present / absent / leave per day)
   ========================================================================== */

function renderAttendanceChart() {
  const container = document.getElementById("attendanceChart");
  container.innerHTML = ""; // clear placeholder bar-groups from HTML

  const totalEmployees = employeeInfo.length;
  const allDates = attendanceData[0].attendance.map(a => a.date);

  allDates.forEach(date => {
    let presentCount = 0;
    let absentCount = 0;

    attendanceData.forEach(emp => {
      const entry = emp.attendance.find(a => a.date === date);
      if (entry?.status === "Present") presentCount++;
      if (entry?.status === "Absent") absentCount++;
    });

    // GAP: leave requests don't fall on these attendance dates in the data,
    // so this will always compute to 0. Kept in for structure/consistency.
    const leaveCount = 0;

    const presentPct = Math.round((presentCount / totalEmployees) * 100);
    const absentPct = Math.round((absentCount / totalEmployees) * 100);
    const leavePct = Math.round((leaveCount / totalEmployees) * 100);

    const shortDate = date.slice(5); // "2025-07-25" -> "07-25"

    const group = document.createElement("div");
    group.className = "bar-group";
    group.innerHTML = `
      <div class="bar-cluster">
        <div class="bar present" style="--pct: ${presentPct}"></div>
        <div class="bar absent" style="--pct: ${absentPct}"></div>
        <div class="bar leave" style="--pct: ${leavePct}"></div>
      </div>
      <span class="bar-label">${shortDate}</span>
    `;
    container.appendChild(group);
  });
}

/* ==========================================================================
   DEPARTMENT HEADCOUNT (horizontal bar list)
   ========================================================================== */

function renderDepartmentHeadcount() {
  const container = document.getElementById("deptHeadcount");
  container.innerHTML = "";

  // Group employees by department
  const deptCounts = {};
  employeeInfo.forEach(emp => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
  });

  const total = employeeInfo.length;

  Object.entries(deptCounts).forEach(([dept, count]) => {
    const pct = Math.round((count / total) * 100);

    const row = document.createElement("div");
    row.className = "dept-bar-row";
    row.innerHTML = `
      <span class="dept-name">${dept}</span>
      <div class="bar-track">
        <div class="bar-fill" style="--pct: ${pct}"></div>
      </div>
      <span class="dept-count">${count}</span>
    `;
    container.appendChild(row);
  });

  document.getElementById("deptTotal").textContent = total;
}

/* ==========================================================================
   PENDING LEAVE LIST
   ========================================================================== */

function renderPendingLeave() {
  // NOTE: your HTML currently has ONE hardcoded .employee-cards div with no
  // wrapping id. Wrap it in something like <div id="pendingLeaveList"> so
  // this can inject multiple cards into it.
  const container = document.getElementById("pendingLeaveList");
  container.innerHTML = "";

  attendanceData.forEach(emp => {
    const pending = emp.leaveRequests.filter(r => r.status === "Pending");
    if (pending.length === 0) return;

    const employee = employeeInfo.find(e => e.employeeId === emp.employeeId);

    pending.forEach(req => {
      const card = document.createElement("div");
      card.className = "employee-cards";
      // GAP: no "type" or "duration" fields exist — using reason as type,
      // duration marked N/A since it isn't in the data.
      card.innerHTML = `
        <img class="avatar-img" src="images/${employee.name.toLowerCase().replace(/\s+/g, "-")}.jpg" alt="${employee.name}" />
        <h3>${employee.name}</h3>
        <p>Type: ${req.reason}</p>
        <p>Duration: N/A</p>
        <p>Start Date: ${req.date}</p>
      `;
      container.appendChild(card);
    });
  });
}

/* ==========================================================================
   INIT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderKPIs();
  renderAttendanceChart();
  renderDepartmentHeadcount();
  renderPendingLeave();
  // renderPayrollTrend() intentionally left out — no monthly history in the
  // data, so the SVG placeholder in the HTML stays static for now.
});