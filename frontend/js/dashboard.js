// js/dashboard.js - Connected to backend API
document.addEventListener("DOMContentLoaded", async function() {
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    // Load KPIs
    const kpis = await api.get("/dashboard/kpis");
    updateKPIs(kpis);

    // Load attendance chart data
    const attendanceData = await api.get("/dashboard/attendance-chart");
    renderAttendanceChart(attendanceData);

    // Load department headcount
    const deptData = await api.get("/dashboard/department-headcount");
    renderDepartmentHeadcount(deptData);

    // Load payroll trend
    const payrollData = await api.get("/dashboard/payroll-trend");
    renderPayrollTrend(payrollData);

    // Load pending leave requests
    const leaveData = await api.get("/timeoff");
    renderPendingLeave(leaveData);

  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Fallback to hardcoded data if API fails
    loadFallbackData();
  }
}

function loadFallbackData() {
  // Use the hardcoded data from your original dashboard.js as fallback
  const kpis = calculateKPIs();
  updateKPIs(kpis);
  renderAttendanceChart();
  renderDepartmentHeadcount();
  renderPayrollTrend();
  renderPendingLeave();
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

// ... rest of your rendering functions (renderAttendanceChart, renderDepartmentHeadcount, etc.) 
// remain the same with their hardcoded data as fallback