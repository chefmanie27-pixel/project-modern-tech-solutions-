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
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    async function loadData() {
      try {
        // Load employees
        const empData = await api.get("/employees");
        employees.value = empData || [];

        // Load attendance records
        const attData = await api.get("/attendance");
        attendanceRecords.value = attData.data || [];

        // Load leave requests
        const leaveData = await api.get("/timeoff");
        leaveRequests.value = leaveData.data || [];

      } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to hardcoded data
        loadFallbackData();
      }
    }

    function loadFallbackData() {
      const empList = employeeData.employeeInformation;
      const attList = attendanceData.attendanceAndLeave;

      employees.value = empList;

      const leaves = [];
      attList.forEach(item => {
        const emp = empList.find(e => e.employeeId === item.employeeId);
        const empName = emp ? emp.name : item.name;

        item.leaveRequests.forEach((lr, idx) => {
          leaves.push({
            _uid: `${item.employeeId}-${idx}-${Date.now()}`,
            employeeId: item.employeeId,
            employeeName: empName,
            date: lr.date,
            reason: lr.reason,
            status: lr.status,
            _attRef: item,
            _lrRef: lr
          });
        });
      });

      leaveRequests.value = leaves;
      attendanceRecords.value = attList;
    }

    // --- Normalization helpers -------------------------------------------
    // The live API and the hardcoded fallback data use different field
    // names (snake_case DB columns vs. the original camelCase mock data).
    // Everything below reads from these normalized views instead of
    // touching employees.value / attendanceRecords.value / leaveRequests.value
    // directly, so the table renders correctly no matter which data source
    // loadData() ended up using.

    const normalizedEmployees = computed(() =>
      employees.value.map(e => ({
        employeeId: e.employeeId ?? e.employee_id,
        name: e.name,
        position: e.position,
        department: e.department ?? e.department_name ?? '',
      }))
    );

    // Map<employeeId, [{ date: 'YYYY-MM-DD', status }]> sorted oldest -> newest
    const attendanceByEmployee = computed(() => {
      const map = new Map();
      const addEntry = (employeeId, date, status) => {
        if (employeeId == null || !date) return;
        if (!map.has(employeeId)) map.set(employeeId, []);
        map.get(employeeId).push({ date, status });
      };

      attendanceRecords.value.forEach(item => {
        if (Array.isArray(item.attendance)) {
          // Fallback shape: { employeeId, attendance: [{ date, status }] }
          item.attendance.forEach(a => addEntry(item.employeeId, a.date, a.status));
        } else {
          // API shape: { employee_id, record_date, status }
          addEntry(item.employeeId ?? item.employee_id, item.date ?? item.record_date, item.status);
        }
      });

      map.forEach(list => list.sort((a, b) => a.date.localeCompare(b.date)));
      return map;
    });

    // Map<employeeId, true> for anyone with at least one Pending leave request
    const pendingLeaveByEmployee = computed(() => {
      const map = new Map();
      leaveRequests.value.forEach(item => {
        if (item.status === 'Pending') {
          map.set(item.employeeId ?? item.employee_id, true);
        }
      });
      return map;
    });

    // --- Employee Overview tab ---------------------------------------------

    const filteredDashboardEmployees = computed(() => {
      const term = dashboardFilter.value.trim().toLowerCase();
      if (!term) return normalizedEmployees.value;
      return normalizedEmployees.value.filter(emp =>
        (emp.name || '').toLowerCase().includes(term) ||
        (emp.position || '').toLowerCase().includes(term) ||
        (emp.department || '').toLowerCase().includes(term)
      );
    });

    function latestAttendance(employeeId) {
      const records = attendanceByEmployee.value.get(employeeId);
      if (!records || records.length === 0) return null;
      return records[records.length - 1]; // list is sorted ascending by date
    }

    function getTodayStatus(employeeId) {
      const latest = latestAttendance(employeeId);
      return latest ? latest.status : 'No Data';
    }

    function getTodayStatusClass(employeeId) {
      const status = getTodayStatus(employeeId);
      if (status === 'Present') return 'badge-present';
      if (status === 'Absent') return 'badge-absent';
      if (status === 'Late' || status === 'Half-Day') return 'badge-pending';
      return 'badge-secondary';
    }

    function hasPendingLeave(employeeId) {
      return pendingLeaveByEmployee.value.get(employeeId) === true;
    }

    const presentToday = computed(() =>
      normalizedEmployees.value.filter(emp => getTodayStatus(emp.employeeId) === 'Present').length
    );

    const absentToday = computed(() =>
      normalizedEmployees.value.filter(emp => getTodayStatus(emp.employeeId) === 'Absent').length
    );

    // --- Weekly Attendance tab ----------------------------------------------

    const filteredAttendanceEmployees = computed(() => {
      const term = attendanceFilter.value.trim().toLowerCase();
      if (!term) return normalizedEmployees.value;
      return normalizedEmployees.value.filter(emp =>
        (emp.name || '').toLowerCase().includes(term) ||
        (emp.department || '').toLowerCase().includes(term)
      );
    });

    // weekDays are positional labels (Mon..Fri) mapped onto each employee's
    // most recent 5 attendance records, oldest to newest.
    function weekRecordFor(employeeId, day) {
      const records = attendanceByEmployee.value.get(employeeId) || [];
      const lastFive = records.slice(-weekDays.length);
      const index = weekDays.indexOf(day);
      return lastFive[index] || null;
    }

    function getDayStatusLetter(employeeId, day) {
      const record = weekRecordFor(employeeId, day);
      return record ? record.status.charAt(0) : '-';
    }

    function getDayStatusClass(employeeId, day) {
      const record = weekRecordFor(employeeId, day);
      if (!record) return '';
      if (record.status === 'Present') return 'day-present';
      if (record.status === 'Absent') return 'day-absent';
      return '';
    }

    function getWeeklySummary(employeeId) {
      const records = attendanceByEmployee.value.get(employeeId) || [];
      const lastFive = records.slice(-weekDays.length);
      const presentCount = lastFive.filter(r => r.status === 'Present').length;
      return `${presentCount}/${lastFive.length || weekDays.length}`;
    }

    function getWeeklySummaryClass(employeeId) {
      const records = attendanceByEmployee.value.get(employeeId) || [];
      const lastFive = records.slice(-weekDays.length);
      const total = lastFive.length || weekDays.length;
      const presentCount = lastFive.filter(r => r.status === 'Present').length;
      if (presentCount === total) return 'badge-present';
      if (presentCount === 0) return 'badge-absent';
      return 'badge-pending';
    }

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
      weekDays,
      filteredDashboardEmployees,
      filteredAttendanceEmployees,
      presentToday,
      absentToday,
      getTodayStatus,
      getTodayStatusClass,
      hasPendingLeave,
      getDayStatusLetter,
      getDayStatusClass,
      getWeeklySummary,
      getWeeklySummaryClass,
    };
  }
});

app.mount('#app');