/* ==========================================================================
   API HELPER (temporary — swap for Azhar's shared api.js once it exists)
   ========================================================================== */

const API_BASE = "http://localhost:3000/api/v1";

async function apiRequest(endpoint) {
  const token = localStorage.getItem("moderntech_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Request failed: ${endpoint} (${res.status})`);
  return res.json();
}

/* ==========================================================================
   KPIs
   ========================================================================== */

async function renderKPIs() {
  const kpis = await apiRequest("/dashboard/kpis");

  document.getElementById("kpi-active-employees").textContent = kpis.active_employees;
  document.getElementById("kpi-active-sub").textContent =
    `${kpis.total_employees} in total - ${kpis.on_leave_count} on leave`;
  document.getElementById("kpi-monthly-payroll").textContent =
    `R ${Math.round(kpis.monthly_payroll / 1000)}k`;
  document.getElementById("kpi-pending-requests").textContent = kpis.pending_requests;
  document.getElementById("kpi-avg-attendance").textContent =
    kpis.avg_attendance !== null ? `${kpis.avg_attendance}%` : "N/A";

  return kpis;
}

/* ==========================================================================
   ATTENDANCE CHART
   ========================================================================== */

async function renderAttendanceChart(totalEmployees) {
  const rows = await apiRequest("/dashboard/attendance-chart");
  const container = document.getElementById("attendanceChart");
  container.innerHTML = "";

  document.getElementById("attendanceYAxis").innerHTML = `
    <span>100%</span>
    <span>75%</span>
    <span>50%</span>
    <span>25%</span>
    <span>0%</span>
  `;

  if (rows.length === 0) {
    container.innerHTML = `<p style="padding:1rem;">No attendance data yet.</p>`;
    return;
  }

  rows.forEach(row => {
    const presentPct = Math.round((row.present_count / totalEmployees) * 100);
    const absentPct = Math.round((row.absent_count / totalEmployees) * 100);
    const leavePct = Math.round((row.half_day_count / totalEmployees) * 100);
    const shortDate = row.record_date.slice(5, 10);

    const group = document.createElement("div");
    group.className = "bar-group";
    group.innerHTML = `
      <div class="bar-cluster">
        <div class="bar present" style="--pct: ${presentPct}" data-value="${row.present_count} present"></div>
        <div class="bar absent" style="--pct: ${absentPct}" data-value="${row.absent_count} absent"></div>
        <div class="bar leave" style="--pct: ${leavePct}" data-value="${row.half_day_count} on leave"></div>
      </div>
      <span class="bar-label">${shortDate}</span>
    `;
    container.appendChild(group);
  });
}

/* ==========================================================================
   DEPARTMENT HEADCOUNT
   ========================================================================== */

async function renderDepartmentHeadcount() {
  const rows = await apiRequest("/dashboard/department-headcount");
  const container = document.getElementById("deptHeadcount");
  container.innerHTML = "";

  const total = rows.reduce((sum, d) => sum + d.count, 0);

  rows.forEach(d => {
    const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
    const row = document.createElement("div");
    row.className = "dept-bar-row";
    row.innerHTML = `
      <span class="dept-name">${d.department}</span>
      <div class="bar-track">
        <div class="bar-fill" style="--pct: ${pct}" data-value="${d.count} employees"></div>
      </div>
      <span class="dept-count">${d.count}</span>
    `;
    container.appendChild(row);
  });

  document.getElementById("deptTotal").textContent = total;
}

/* ==========================================================================
   PAYROLL TREND
   ========================================================================== */

async function renderPayrollTrend() {
  const rows = await apiRequest("/dashboard/payroll-trend");
  const svg = document.getElementById("payrollChart");
  const polylineEl = svg.querySelector(".trend-line");

  if (rows.length === 0) {
    document.getElementById("payrollYAxis").innerHTML = "";
    document.getElementById("payrollXAxis").innerHTML = `<span>No payroll data yet</span>`;
    polylineEl.setAttribute("points", "");
    return;
  }

  const payrollHistory = rows.slice().reverse().map(r => ({ month: r.month, value: Number(r.total) }));

  const chartWidth = 600, chartHeight = 300, paddingX = 20, paddingTop = 20, paddingBottom = 20;

  function computeNiceScale(maxValue, tickCount = 5) {
    const rawStep = maxValue / (tickCount - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
    const residual = rawStep / magnitude;
    let niceResidual;
    if (residual > 5) niceResidual = 10;
    else if (residual > 2) niceResidual = 5;
    else if (residual > 1) niceResidual = 2;
    else niceResidual = 1;
    const step = niceResidual * magnitude;
    return { step, niceMax: step * (tickCount - 1) };
  }

  const maxValue = Math.max(...payrollHistory.map(p => p.value), 1);
  const { step, niceMax } = computeNiceScale(maxValue);

  const xFor = (index) =>
    payrollHistory.length > 1
      ? paddingX + (index / (payrollHistory.length - 1)) * (chartWidth - paddingX * 2)
      : chartWidth / 2;
  const yFor = (value) =>
    chartHeight - paddingBottom - (value / niceMax) * (chartHeight - paddingTop - paddingBottom);

  const pointsAttr = payrollHistory.map((p, i) => `${xFor(i)},${yFor(p.value)}`).join(" ");
  polylineEl.setAttribute("points", pointsAttr);

  svg.querySelectorAll(".trend-dot").forEach(el => el.remove());
  const tooltip = document.getElementById("payrollTooltip");

  payrollHistory.forEach((p, i) => {
    const cx = xFor(i), cy = yFor(p.value);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "trend-dot");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 6);
    svg.appendChild(circle);

    circle.addEventListener("mouseenter", () => {
      tooltip.textContent = `${p.month}: R ${Math.round(p.value / 1000)}k`;
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
  });

  let yAxisHtml = "";
  for (let i = 4; i >= 0; i--) {
    yAxisHtml += `<span>R ${Math.round((step * i) / 1000)}k</span>`;
  }
  document.getElementById("payrollYAxis").innerHTML = yAxisHtml;

  document.getElementById("payrollXAxis").innerHTML = payrollHistory
    .map(p => `<span>${p.month}</span>`)
    .join("");
}

/* ==========================================================================
   PENDING LEAVE LIST
   NOTE: depends on Wendy's /timeoff endpoint — field names below
   (employee_name, leave_type, start_date, end_date) are a best guess,
   confirm with Wendy once her route is live.
   ========================================================================== */

async function renderPendingLeave() {
  const container = document.getElementById("pendingLeaveList");
  container.innerHTML = "";

  try {
    const response = await apiRequest("/timeoff");
    const allRequests = response.data;
    const pending = allRequests.filter(req => req.status === "Pending");

    if (pending.length === 0) {
      container.innerHTML = `<p class="pending-leave-empty">No pending leave requests 🎉</p>`;
      return;
    }

    pending.forEach(req => {
      const card = document.createElement("div");
      card.className = "employee-cards";
      card.innerHTML = `
        <div class="leave-card-body">
          <div class="leave-card-top">
            <h3>${req.employee}</h3>
            <span class="leave-type-badge">${req.leave_type}</span>
          </div>
          <div class="leave-card-meta">
            <span class="leave-dates">${req.start_date} &rarr; ${req.end_date}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p class="pending-leave-empty">Couldn't load pending leave yet.</p>`;
  }
}

/* ==========================================================================
   INIT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const kpis = await renderKPIs();
    await renderAttendanceChart(kpis.total_employees);
    await renderDepartmentHeadcount();
    await renderPayrollTrend();
    await renderPendingLeave();
  } catch (err) {
    console.error(err);
    document.querySelector(".dashboard-container").innerHTML =
      `<p style="color:#e5484d; padding:2rem;">Couldn't load dashboard data. Make sure the server is running and you're logged in.</p>`;
  }
});