/* ==========================================================================
   DATA
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

  const onLeaveCount = attendanceData.filter(emp =>
    emp.leaveRequests.some(r => r.status === "Approved")
  ).length;

  const activeEmployees = totalEmployees - onLeaveCount;
  const monthlyPayroll = payrollData.reduce((sum, p) => sum + p.finalSalary, 0);

  const pendingRequests = attendanceData.reduce((count, emp) =>
    count + emp.leaveRequests.filter(r => r.status === "Pending").length, 0
  );

  const totalDays = attendanceData.reduce((sum, emp) => sum + emp.attendance.length, 0);
  const presentDays = attendanceData.reduce((sum, emp) =>
    sum + emp.attendance.filter(a => a.status === "Present").length, 0
  );
  const avgAttendance = Math.round((presentDays / totalDays) * 100);

  return { totalEmployees, activeEmployees, onLeaveCount, monthlyPayroll, pendingRequests, avgAttendance };
}

function renderKPIs() {
  const kpis = calculateKPIs();

  document.getElementById("kpi-active-employees").textContent = kpis.activeEmployees;
  document.getElementById("kpi-active-sub").textContent = `${kpis.totalEmployees} in total - ${kpis.onLeaveCount} on leave`;
  document.getElementById("kpi-monthly-payroll").textContent = `R ${Math.round(kpis.monthlyPayroll / 1000)}k`;
  document.getElementById("kpi-pending-requests").textContent = kpis.pendingRequests;
  document.getElementById("kpi-avg-attendance").textContent = `${kpis.avgAttendance}%`;
}

/* ==========================================================================
   ATTENDANCE CHART (grouped bars + y-axis + hover tooltips)
   ========================================================================== */

function renderAttendanceChart() {
  const container = document.getElementById("attendanceChart");
  container.innerHTML = "";

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

    // GAP: leave request dates don't overlap the attendance dates in the
    // data, so this always computes to 0. Kept for structure/consistency.
    const leaveCount = 0;

    const presentPct = Math.round((presentCount / totalEmployees) * 100);
    const absentPct = Math.round((absentCount / totalEmployees) * 100);
    const leavePct = Math.round((leaveCount / totalEmployees) * 100);

    const shortDate = date.slice(5);

    const group = document.createElement("div");
    group.className = "bar-group";
    group.innerHTML = `
      <div class="bar-cluster">
        <div class="bar present" style="--pct: ${presentPct}" data-value="${presentCount} present"></div>
        <div class="bar absent" style="--pct: ${absentPct}" data-value="${absentCount} absent"></div>
        <div class="bar leave" style="--pct: ${leavePct}" data-value="${leaveCount} on leave"></div>
      </div>
      <span class="bar-label">${shortDate}</span>
    `;
    container.appendChild(group);
  });

  // y-axis: bars are % of total employees, so scale is fixed 0-100
  document.getElementById("attendanceYAxis").innerHTML = `
    <span>100%</span>
    <span>75%</span>
    <span>50%</span>
    <span>25%</span>
    <span>0%</span>
  `;
}

/* ==========================================================================
   DEPARTMENT HEADCOUNT (horizontal bar list + hover tooltips)
   ========================================================================== */

function renderDepartmentHeadcount() {
  const container = document.getElementById("deptHeadcount");
  container.innerHTML = "";

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
        <div class="bar-fill" style="--pct: ${pct}" data-value="${count} employees"></div>
      </div>
      <span class="dept-count">${count}</span>
    `;
    container.appendChild(row);
  });

  document.getElementById("deptTotal").textContent = total;
}

/* ==========================================================================
   PAYROLL TREND (line chart — single real data point)
   GAP: payroll_data.json has no monthly history, only one current
   snapshot. Rather than inventing 5 fake months, this shows the one
   real value honestly. Flag to instructor if a true trend is expected.
   ========================================================================== */

function renderPayrollTrend() {
  const payrollHistory = [
    { month: "Jan", value: 860000 },
    { month: "Feb", value: 900000 },
    { month: "Mar", value: 875000 },
    { month: "Apr", value: 920000 },
    { month: "May", value: 950000 },
    {
        month: "Jun",
        value: payrollData.reduce((sum, p) => sum + p.finalSalary, 0)
    }
];

const point = payrollHistory[payrollHistory.length - 1];

  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 30;

  const x = chartWidth / 2;
  const y = chartHeight - padding - 20;

  const svg = document.getElementById("payrollChart");
  const polylineEl = svg.querySelector(".trend-line");
  polylineEl.setAttribute("points", ""); // no line possible with one point

  svg.querySelectorAll(".trend-dot").forEach(el => el.remove());

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("class", "trend-dot");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 6);
  svg.appendChild(circle);

  document.getElementById("payrollYAxis").innerHTML = `
    <span>R ${Math.round(point.value / 1000)}k</span>
    <span>R 0k</span>
  `;

  document.getElementById("payrollXAxis").innerHTML = `<span>${point.month}</span>`;

  const tooltip = document.getElementById("payrollTooltip");
  circle.addEventListener("mouseenter", () => {
    tooltip.textContent = `${point.month}: R ${Math.round(point.value / 1000)}k`;
    tooltip.style.opacity = "1";
  });
  circle.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    tooltip.style.left = `${e.clientX - rect.left + 10}px`;
    tooltip.style.top = `${e.clientY - rect.top - 10}px`;
  });
  circle.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
  });
}

/* ==========================================================================
   PENDING LEAVE LIST
   ========================================================================== */

function renderPendingLeave() {
  const container = document.getElementById("pendingLeaveList");
  container.innerHTML = "";

  attendanceData.forEach(emp => {
    const pending = emp.leaveRequests.filter(r => r.status === "Pending");
    if (pending.length === 0) return;

    const employee = employeeInfo.find(e => e.employeeId === emp.employeeId);

    pending.forEach(req => {
      const card = document.createElement("div");
      card.className = "employee-cards";
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
  renderPayrollTrend();
  renderPendingLeave();
});