// vue-app/app.js - Updated to use backend API
const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
  setup() {
    const activeTab = ref('attendance');
    const dashboardFilter = ref('');
    const attendanceFilter = ref('');
    const leaveFilterStatus = ref('all');
    const leaveFilterSearch = ref('');

    const employees = ref([]);
    const attendanceRecords = ref([]);
    const leaveRequests = ref([]);
    const weekDays = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

    // Normalizes both the live API shape (snake_case, e.g. employee_id,
    // department_name) and the fallback JSON shape (camelCase, department
    // as a plain string) into one consistent view model.
    function toEmployeeViewModel(row) {
      return {
        employeeId: row.employeeId != null ? row.employeeId : row.employee_id,
        name: row.name,
        position: row.position,
        department: row.department || row.department_name || '',
      };
    }

    function toAttendanceViewModel(row) {
      return {
        employeeId: row.employeeId != null ? row.employeeId : row.employee_id,
        date: row.date || row.record_date,
        status: row.status,
      };
    }

    function toLeaveViewModel(row) {
      return {
        employeeId: row.employeeId != null ? row.employeeId : row.employee_id,
        status: row.status,
      };
    }

    async function loadData() {
      try {
        // Load employees
        const empData = await api.get("/employees");
        employees.value = (empData || []).map(toEmployeeViewModel);

        // Load attendance records
        const attData = await api.get("/attendance");
        attendanceRecords.value = (attData.data || []).map(toAttendanceViewModel);

        // Load leave requests
        const leaveData = await api.get("/timeoff");
        leaveRequests.value = (leaveData.data || []).map(toLeaveViewModel);

      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to hardcoded data
        loadFallbackData();
      }
    }

    function loadFallbackData() {
      const empList = employeeData.employeeInformation;
      const attList = attendanceData.attendanceAndLeave;

      employees.value = empList.map(toEmployeeViewModel);

      const records = [];
      const leaves = [];
      attList.forEach(item => {
        (item.attendance || []).forEach(a => {
          records.push({ employeeId: item.employeeId, date: a.date, status: a.status });
        });
        (item.leaveRequests || []).forEach(lr => {
          leaves.push({ employeeId: item.employeeId, status: lr.status });
        });
      });

      attendanceRecords.value = records;
      leaveRequests.value = leaves;
    }

    // ---- Derived "week" of dates from whatever attendance data we have,
    // so the table works regardless of what today's real date is. ----
    const recentDates = computed(() => {
      const unique = [...new Set(attendanceRecords.value.map(r => r.date))];
      unique.sort(); // ISO dates sort correctly as strings
      return unique.slice(-5); // most recent 5 distinct days, ascending
    });

    const latestDate = computed(() => {
      const dates = recentDates.value;
      return dates.length ? dates[dates.length - 1] : null;
    });

    const dayLabels = computed(() =>
      recentDates.value.map(d =>
        new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short' }),
      ),
    );

    const dayLabelToDate = computed(() => {
      const map = {};
      recentDates.value.forEach((date, i) => {
        map[dayLabels.value[i]] = date;
      });
      return map;
    });

    // Keep the template's weekDays in sync with the real data.
    const weekDaysComputed = computed(() =>
      dayLabels.value.length ? dayLabels.value : weekDays.value,
    );

    function recordFor(employeeId, date) {
      return attendanceRecords.value.find(
        r => r.employeeId === employeeId && r.date === date,
      );
    }

    // ---- Present / Absent Today ----
    const presentToday = computed(() => {
      if (!latestDate.value) return 0;
      return attendanceRecords.value.filter(
        r => r.date === latestDate.value && r.status === 'Present',
      ).length;
    });

    const absentToday = computed(() => {
      if (!latestDate.value) return 0;
      return attendanceRecords.value.filter(
        r => r.date === latestDate.value && r.status === 'Absent',
      ).length;
    });

    function getTodayStatus(employeeId) {
      if (!latestDate.value) return 'No record';
      const record = recordFor(employeeId, latestDate.value);
      return record ? record.status : 'No record';
    }

    function getTodayStatusClass(employeeId) {
      const status = getTodayStatus(employeeId);
      if (status === 'Present') return 'badge-present';
      if (status === 'Absent') return 'badge-absent';
      if (status === 'Late' || status === 'Half-Day') return 'badge-pending';
      return 'badge-secondary';
    }

    function hasPendingLeave(employeeId) {
      return leaveRequests.value.some(
        lr => lr.employeeId === employeeId && lr.status === 'Pending',
      );
    }

    // ---- Weekly attendance grid ----
    function getDayStatusLetter(employeeId, day) {
      const date = dayLabelToDate.value[day];
      if (!date) return '—';
      const record = recordFor(employeeId, date);
      if (!record) return '—';
      if (record.status === 'Present') return 'P';
      if (record.status === 'Absent') return 'A';
      if (record.status === 'Late') return 'L';
      if (record.status === 'Half-Day') return 'H';
      return '—';
    }

    function getDayStatusClass(employeeId, day) {
      const letter = getDayStatusLetter(employeeId, day);
      if (letter === 'P') return 'day-present';
      if (letter === 'A') return 'day-absent';
      return '';
    }

    function getWeeklySummary(employeeId) {
      const days = recentDates.value;
      if (days.length === 0) return '—';
      const presentCount = days.filter(date => {
        const record = recordFor(employeeId, date);
        return record && record.status === 'Present';
      }).length;
      return `${presentCount}/${days.length}`;
    }

    function getWeeklySummaryClass(employeeId) {
      const days = recentDates.value;
      if (days.length === 0) return 'badge-secondary';
      const presentCount = days.filter(date => {
        const record = recordFor(employeeId, date);
        return record && record.status === 'Present';
      }).length;
      const ratio = presentCount / days.length;
      if (ratio >= 0.8) return 'badge-present';
      if (ratio >= 0.5) return 'badge-pending';
      return 'badge-absent';
    }

    // ---- Filters ----
    const filteredDashboardEmployees = computed(() => {
      const search = dashboardFilter.value.trim().toLowerCase();
      if (!search) return employees.value;
      return employees.value.filter(emp =>
        emp.name.toLowerCase().includes(search),
      );
    });

    const filteredAttendanceEmployees = computed(() => {
      const search = attendanceFilter.value.trim().toLowerCase();
      if (!search) return employees.value;
      return employees.value.filter(emp =>
        emp.name.toLowerCase().includes(search),
      );
    });

    onMounted(() => {
      loadData();
    });

    return {
      activeTab,
      dashboardFilter,
      attendanceFilter,
      leaveFilterStatus,
      leaveFilterSearch,
      employees,
      attendanceRecords,
      leaveRequests,
      weekDays: weekDaysComputed,
      presentToday,
      absentToday,
      getTodayStatus,
      getTodayStatusClass,
      hasPendingLeave,
      getDayStatusLetter,
      getDayStatusClass,
      getWeeklySummary,
      getWeeklySummaryClass,
      filteredDashboardEmployees,
      filteredAttendanceEmployees,
    };
  }
});

app.mount('#app');
