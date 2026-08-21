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
        attendanceId: row.attendanceId != null ? row.attendanceId : (row.attendance_id != null ? row.attendance_id : null),
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

    const usingFallbackData = ref(false);
    const updatingIds = ref(new Set());
    const toast = ref(null);
    let toastTimer = null;

    function showToast(message, type = 'error') {
      toast.value = { message, type };
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.value = null;
      }, 4000);
    }

    // Loads each data source independently so a failure in one (e.g.
    // /attendance or /timeoff erroring) can't wipe out data that already
    // loaded successfully from another (e.g. /employees). Previously all
    // three were awaited inside one try block, so ANY single failure fell
    // through to loadFallbackData() and overwrote the real employee list
    // with the static demo list from data.js — which never contains
    // employees you've actually added.
    async function loadData() {
      let anyFailure = false;

      try {
        const empData = await api.get("/employees");
        employees.value = (empData || []).map(toEmployeeViewModel);
      } catch (error) {
        console.error("Error loading employees:", error);
        employees.value = employeeData.employeeInformation.map(toEmployeeViewModel);
        anyFailure = true;
      }

      try {
        const attData = await api.get("/attendance");
        attendanceRecords.value = (attData.data || []).map(toAttendanceViewModel);
      } catch (error) {
        console.error("Error loading attendance:", error);
        attendanceRecords.value = fallbackAttendanceRecords();
        anyFailure = true;
      }

      try {
        const leaveData = await api.get("/timeoff");
        leaveRequests.value = (leaveData.data || []).map(toLeaveViewModel);
      } catch (error) {
        console.error("Error loading leave requests:", error);
        leaveRequests.value = fallbackLeaveRequests();
        anyFailure = true;
      }

      usingFallbackData.value = anyFailure;
    }

    function fallbackAttendanceRecords() {
      const records = [];
      attendanceData.attendanceAndLeave.forEach(item => {
        (item.attendance || []).forEach(a => {
          records.push({ employeeId: item.employeeId, date: a.date, status: a.status });
        });
      });
      return records;
    }

    function fallbackLeaveRequests() {
      const leaves = [];
      attendanceData.attendanceAndLeave.forEach(item => {
        (item.leaveRequests || []).forEach(lr => {
          leaves.push({ employeeId: item.employeeId, status: lr.status });
        });
      });
      return leaves;
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

    // Each weekly-grid column needs both a weekday label ("Mon") and the
    // actual calendar date ("17 Aug") so the table is unambiguous no
    // matter when it's viewed.
    const weekColumns = computed(() =>
      recentDates.value.map(d => {
        const dateObj = new Date(d + 'T00:00:00');
        return {
          iso: d,
          weekday: dateObj.toLocaleDateString('en-ZA', { weekday: 'short' }),
          dateLabel: dateObj.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
        };
      }),
    );

    // Human-readable label for whichever date the "Today" column/stats
    // are actually based on (the most recent date with attendance data).
    const latestDateLabel = computed(() => {
      if (!latestDate.value) return '';
      return new Date(latestDate.value + 'T00:00:00').toLocaleDateString('en-ZA', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    });

    // The real, actual current date (independent of the data), so the
    // page always shows what "today" truly is.
    const realTodayLabel = computed(() =>
      new Date().toLocaleDateString('en-ZA', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
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

    // ---- Click-to-set Present / Absent for "today" (latest known date) ----
    function isUpdatingStatus(employeeId) {
      return updatingIds.value.has(employeeId);
    }

    async function setTodayStatus(employeeId, status) {
      if (isUpdatingStatus(employeeId)) return;

      // Fall back to the real current date if we have no attendance
      // records loaded yet at all.
      const targetDate = latestDate.value || new Date().toISOString().slice(0, 10);
      const existing = recordFor(employeeId, targetDate);

      if (existing && existing.status === status) {
        return; // already set to this status, nothing to do
      }

      updatingIds.value.add(employeeId);

      // Keep a snapshot so we can roll back if the request fails.
      const previousRecords = attendanceRecords.value.slice();

      // Optimistic UI update.
      if (existing) {
        existing.status = status;
      } else {
        attendanceRecords.value.push({
          attendanceId: null,
          employeeId,
          date: targetDate,
          status,
        });
        // Make sure "today" shows up as a column even if it's a brand
        // new date with no prior records.
        if (!recentDates.value.includes(targetDate)) {
          // recentDates is derived, so nothing else to do here; it will
          // recompute automatically once attendanceRecords changes.
        }
      }

      // Demo/offline mode: no backend to sync with, so the optimistic
      // update above is the final state.
      if (usingFallbackData.value) {
        updatingIds.value.delete(employeeId);
        return;
      }

      try {
        if (existing && existing.attendanceId) {
          const res = await api.patch(`/attendance/${existing.attendanceId}`, { status });
          const updated = res && res.data ? toAttendanceViewModel(res.data) : null;
          if (updated) {
            existing.status = updated.status;
            existing.attendanceId = updated.attendanceId;
          }
        } else if (!existing) {
          const res = await api.post('/attendance', {
            employee_id: employeeId,
            record_date: targetDate,
            status,
          });
          const created = res && res.data ? toAttendanceViewModel(res.data) : null;
          const record = attendanceRecords.value.find(
            r => r.employeeId === employeeId && r.date === targetDate,
          );
          if (created && record) {
            record.attendanceId = created.attendanceId;
            record.status = created.status;
          }
        }
      } catch (error) {
        console.error('Error updating attendance status:', error);
        attendanceRecords.value = previousRecords;
        showToast(error.message || 'Could not update attendance status. Please try again.');
      } finally {
        updatingIds.value.delete(employeeId);
      }
    }

    function hasPendingLeave(employeeId) {
      return leaveRequests.value.some(
        lr => lr.employeeId === employeeId && lr.status === 'Pending',
      );
    }

    // ---- Weekly attendance grid ----
    function getDayStatusLetter(employeeId, iso) {
      if (!iso) return '—';
      const record = recordFor(employeeId, iso);
      if (!record) return '—';
      if (record.status === 'Present') return 'P';
      if (record.status === 'Absent') return 'A';
      if (record.status === 'Late') return 'L';
      if (record.status === 'Half-Day') return 'H';
      return '—';
    }

    function getDayStatusClass(employeeId, iso) {
      const letter = getDayStatusLetter(employeeId, iso);
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
      // The attendance page is a static page you might leave open in a
      // tab while adding/editing employees elsewhere. Vue only fetches
      // once on mount, so without this, a newly added employee wouldn't
      // show up here until you manually reload the tab. Re-fetch
      // whenever the tab regains focus so the employee list (and
      // attendance/leave data) stays current.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          loadData();
        }
      });
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
      weekColumns,
      latestDateLabel,
      realTodayLabel,
      presentToday,
      absentToday,
      getTodayStatus,
      getTodayStatusClass,
      setTodayStatus,
      isUpdatingStatus,
      toast,
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