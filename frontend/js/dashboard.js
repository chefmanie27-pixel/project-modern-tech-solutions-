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

// --- Payroll Trend (line chart with aligned Y-axis and 150k margins) ---
function renderPayrollTrend(rows) {
  const svgEl = document.getElementById("payrollChart");
  const polyline = svgEl ? svgEl.querySelector(".trend-line") : null;
  const yAxisEl = document.getElementById("payrollYAxis");
  const xAxisEl = document.getElementById("payrollXAxis");
  const tooltip = document.getElementById("payrollTooltip");
  if (!svgEl || !polyline) return;

  // Clear existing circles on re-render
  svgEl.querySelectorAll(".trend-dot").forEach((el) => el.remove());

  rows = rows || [];
  if (rows.length === 0) {
    polyline.setAttribute("points", "");
    if (yAxisEl) yAxisEl.innerHTML = "";
    if (xAxisEl) xAxisEl.innerHTML = `<span>No payroll data available</span>`;
    return;
  }

  // Clean numbers and parse totals
  const parsedRows = rows
    .map((r) => {
      const rawVal = String(r.total || r.monthly_payroll || 0).replace(/[^0-9.]/g, "");
      return {
        month: r.month || r.period || "",
        total: parseFloat(rawVal) || 0,
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month));

  // Scale setup: 150k step size up to a 900k ceiling (0k to 900k)
  const stepSize = 150000;
  const peakTotal = parsedRows.reduce((max, r) => Math.max(max, r.total), 0) || 1;
  const maxTotal = Math.max(900000, Math.ceil(peakTotal / stepSize) * stepSize);
  const minFloor = 0;

  // Dimensions matching SVG viewBox (0 0 600 220)
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingTop = 15;
  const paddingBottom = 15;
  const usableHeight = svgHeight - paddingTop - paddingBottom;

  const stepX = parsedRows.length > 1 ? svgWidth / (parsedRows.length - 1) : 0;

  // Exact 1:1 mapping from data values to Y pixel coordinates
  const coordinates = parsedRows.map((row, i) => {
    const x = parsedRows.length > 1 ? i * stepX : svgWidth / 2;
    const pct = Math.min(1, Math.max(0, (row.total - minFloor) / maxTotal));
    // SVG origin (0,0) is top-left, so higher values move UP (smaller Y)
    const y = svgHeight - paddingBottom - pct * usableHeight;
    return { x, y, row };
  });

  // Plot trend line
  const points = coordinates.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  polyline.setAttribute("points", points);

  // Draw SVG circles & restore tooltips
  coordinates.forEach((c) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "trend-dot");
    circle.setAttribute("cx", c.x);
    circle.setAttribute("cy", c.y);
    circle.setAttribute("r", "5");

    svgEl.appendChild(circle);

    if (tooltip) {
      let monthLabel = c.row.month;
      if (c.row.month && c.row.month.includes("-")) {
        const parts = c.row.month.split("-");
        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1);
        monthLabel = dateObj.toLocaleString("en-ZA", { month: "short" });
      }

      circle.addEventListener("mouseenter", () => {
        tooltip.textContent = `${monthLabel}: R ${Math.round(c.row.total / 1000)}k`;
        tooltip.style.opacity = "1";
      });
      circle.addEventListener("mousemove", (e) => {
        const rect = svgEl.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 10}px`;
        tooltip.style.top = `${e.clientY - rect.top - 10}px`;
      });
      circle.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
      });
    }
  });

  // Render Y-Axis labels (R 900k down to R 0k in 150k steps)
  if (yAxisEl) {
    const stepCount = maxTotal / stepSize;
    const labels = [];
    for (let i = stepCount; i >= 0; i--) {
      labels.push(`R ${Math.round((i * stepSize) / 1000)}k`);
    }
    yAxisEl.innerHTML = labels.map((n) => `<span>${n}</span>`).join("");
  }

  // Render X-Axis labels
  if (xAxisEl) {
    xAxisEl.innerHTML = parsedRows
      .map((row) => {
        if (!row.month) return `<span>--</span>`;
        const parts = row.month.split("-");
        if (parts.length < 2) return `<span>${row.month}</span>`;
        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1);
        const monthLabel = dateObj.toLocaleString("en-ZA", { month: "short" });
        return `<span>${monthLabel}</span>`;
      })
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
