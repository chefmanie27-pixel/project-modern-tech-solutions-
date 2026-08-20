// js/dashboard.js - Connected to backend API
document.addEventListener("DOMContentLoaded", async function() {
  await loadDashboardData();
});

async function loadDashboardData() {
  // Each section is loaded and rendered independently so that one
  // section failing (bad data, a slow/erroring endpoint) doesn't stop
  // the rest of the dashboard from rendering.
  const sections = [
    {
      name: "KPIs",
      run: async () => updateKPIs(await api.get("/dashboard/kpis")),
    },
    {
      name: "Attendance chart",
      run: async () =>
        renderAttendanceChart(await api.get("/dashboard/attendance-chart")),
    },
    {
      name: "Department headcount",
      run: async () =>
        renderDepartmentHeadcount(
          await api.get("/dashboard/department-headcount"),
        ),
    },
    {
      name: "Payroll trend",
      run: async () =>
        renderPayrollTrend(await api.get("/dashboard/payroll-trend")),
    },
    {
      name: "Pending leave",
      run: async () => renderPendingLeave(await api.get("/timeoff")),
    },
  ];

  for (const section of sections) {
    try {
      await section.run();
    } catch (error) {
      console.error(`Error loading dashboard section "${section.name}":`, error);
    }
  }
}

function updateKPIs(kpis) {
  document.getElementById("kpi-active-employees").textContent = kpis.active_employees || kpis.activeEmployees || 0;
  document.getElementById("kpi-active-sub").textContent = 
    `${kpis.total_employees || kpis.totalEmployees || 0} in total - ${kpis.on_leave_count || kpis.onLeaveCount || 0} on leave`;
  document.getElementById("kpi-monthly-payroll").textContent = 
    `R ${Math.round((kpis.monthly_payroll || kpis.monthlyPayroll || 0) / 1000)}k`;
  document.getElementById("kpi-pending-requests").textContent = kpis.pending_requests || kpis.pendingRequests || 0;
  document.getElementById("kpi-avg-attendance").textContent = 
    `${kpis.avg_attendance || kpis.avgAttendance || 0}%`;
}

// --- Attendance Overview (stacked bar chart) ---
function renderAttendanceChart(rows) {
  const chartEl = document.getElementById("attendanceChart");
  const yAxisEl = document.getElementById("attendanceYAxis");
  if (!chartEl) return;

  rows = rows || [];

  // Y axis: 0 - max present/absent/leave count across the days shown
  const maxCount = rows.reduce((max, row) => {
    const total = Number(row.present_count || 0) + Number(row.absent_count || 0) + Number(row.half_day_count || 0);
    return Math.max(max, total, 1);
  }, 1);

  if (yAxisEl) {
    const steps = 4;
    const labels = [];
    for (let i = steps; i >= 0; i--) {
      labels.push(Math.round((maxCount / steps) * i));
    }
    yAxisEl.innerHTML = labels.map((n) => `<span>${n}</span>`).join("");
  }

  if (rows.length === 0) {
    chartEl.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">No attendance data available.</p>`;
    return;
  }

  chartEl.innerHTML = rows
    .map((row) => {
      const present = Number(row.present_count || 0);
      const absent = Number(row.absent_count || 0);
      const leave = Number(row.half_day_count || 0);
      const dateLabel = new Date(row.record_date).toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
      });

      const presentPct = Math.round((present / maxCount) * 100);
      const absentPct = Math.round((absent / maxCount) * 100);
      const leavePct = Math.round((leave / maxCount) * 100);

      return `
        <div class="bar-group">
          <div class="bar-cluster">
            <div class="bar present" style="--pct:${presentPct}" data-value="${present} present"></div>
            <div class="bar absent" style="--pct:${absentPct}" data-value="${absent} absent"></div>
            <div class="bar leave" style="--pct:${leavePct}" data-value="${leave} on leave"></div>
          </div>
          <span class="bar-label">${dateLabel}</span>
        </div>
      `;
    })
    .join("");
}

// --- Department Headcount ---
function renderDepartmentHeadcount(rows) {
  const listEl = document.getElementById("deptHeadcount");
  const totalEl = document.getElementById("deptTotal");
  if (!listEl) return;

  rows = rows || [];
  const total = rows.reduce((sum, row) => sum + Number(row.count || 0), 0);
  const maxCount = rows.reduce((max, row) => Math.max(max, Number(row.count || 0)), 1) || 1;

  if (totalEl) totalEl.textContent = total;

  if (rows.length === 0) {
    listEl.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">No department data available.</p>`;
    return;
  }

  listEl.innerHTML = rows
    .map((row) => {
      const count = Number(row.count || 0);
      const pct = Math.round((count / maxCount) * 100);
      return `
        <div class="dept-bar-row">
          <span class="dept-name">${row.department}</span>
          <div class="bar-track"><div class="bar-fill" style="--pct:${pct}" data-value="${count}"></div></div>
          <span class="dept-count">${count}</span>
        </div>
      `;
    })
    .join("");
}

// --- Payroll Trend (line chart) ---
function renderPayrollTrend(rows) {
  const svgEl = document.getElementById("payrollChart");
  const polyline = svgEl ? svgEl.querySelector(".trend-line") : null;
  const yAxisEl = document.getElementById("payrollYAxis");
  const xAxisEl = document.getElementById("payrollXAxis");
  if (!svgEl || !polyline) return;

  rows = (rows || []).slice().reverse(); // controller returns most-recent-first; chart reads left-to-right

  if (rows.length === 0) {
    polyline.setAttribute("points", "");
    if (yAxisEl) yAxisEl.innerHTML = "";
    if (xAxisEl) xAxisEl.innerHTML = `<span>No payroll data available</span>`;
    return;
  }

  const maxTotal = rows.reduce((max, row) => Math.max(max, Number(row.total || 0)), 0) || 1;
  const width = 600;
  const height = 300;
  const stepX = rows.length > 1 ? width / (rows.length - 1) : 0;

  const points = rows
    .map((row, i) => {
      const x = rows.length > 1 ? i * stepX : width / 2;
      const y = height - (Number(row.total || 0) / maxTotal) * height;
      return `${x},${y}`;
    })
    .join(" ");

  polyline.setAttribute("points", points);

  if (yAxisEl) {
    const steps = 4;
    const labels = [];
    for (let i = steps; i >= 0; i--) {
      labels.push(`R ${Math.round((maxTotal / steps) * i / 1000)}k`);
    }
    yAxisEl.innerHTML = labels.map((n) => `<span>${n}</span>`).join("");
  }

  if (xAxisEl) {
    xAxisEl.innerHTML = rows
      .map((row) => `<span>${row.month}</span>`)
      .join("");
  }
}

// --- Pending Leave Requests ---
function renderPendingLeave(response) {
  const listEl = document.getElementById("pendingLeaveList");
  if (!listEl) return;

  const requests = (response && response.data ? response.data : response) || [];
  const pending = requests.filter((r) => r.status === "Pending");

  if (pending.length === 0) {
    listEl.innerHTML = `<p class="pending-leave-empty">No pending leave requests.</p>`;
    return;
  }

  listEl.innerHTML = pending
    .slice(0, 5)
    .map((req) => {
      const start = new Date(req.start_date || req.startDate);
      const end = new Date(req.end_date || req.endDate);
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      const fmt = (d) => d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short" });

      return `
        <div class="employee-cards">
          <div class="leave-card-body">
            <div class="leave-card-top">
              <h3>${req.employee || req.employee_name || "Unknown employee"}</h3>
              <span class="leave-type-badge">${req.leave_type || req.leaveType || ""}</span>
            </div>
            <div class="leave-card-meta">
              <span class="leave-duration">${days} day${days === 1 ? "" : "s"}</span>
              <span class="leave-dates">${fmt(start)} - ${fmt(end)}</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}
