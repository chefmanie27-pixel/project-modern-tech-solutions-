


const { createApp, ref, computed, onMounted } = Vue;


const app = createApp({

    
    setup() {

        

        const activeTab = ref('');       
        const dashboardFilter = ref('');          
        const attendanceFilter = ref('');         
        const leaveFilterStatus = ref('all');     
        const leaveFilterSearch = ref('');        

        
        const employees = ref([]);                
        const attendanceRecords = ref([]);        
        const leaveRequests = ref([]);            

        
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

        
        function loadData() {
            
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

        const presentToday = computed(() => {
            const today = '2025-07-29';
            let count = 0;
            attendanceRecords.value.forEach(rec => {
                const todayRec = rec.attendance.find(a => a.date === today);
                if (todayRec && todayRec.status === 'Present') count++;
            });
            return count;
        });

        
        const absentToday = computed(() => {
            const today = '2025-07-29';
            let count = 0;
            attendanceRecords.value.forEach(rec => {
                const todayRec = rec.attendance.find(a => a.date === today);
                if (todayRec && todayRec.status === 'Absent') count++;
            });
            return count;
        });

        
        const pendingLeavesCount = computed(() => {
            return leaveRequests.value.filter(l => l.status === 'Pending').length;
        });

        
        const filteredDashboardEmployees = computed(() => {
            const filter = dashboardFilter.value.toLowerCase().trim();
            if (!filter) return employees.value;
            return employees.value.filter(emp =>
                emp.name.toLowerCase().includes(filter) ||
                emp.position.toLowerCase().includes(filter) ||
                emp.department.toLowerCase().includes(filter)
            );
        });

        const filteredAttendanceEmployees = computed(() => {
            const filter = attendanceFilter.value.toLowerCase().trim();
            if (!filter) return employees.value;
            return employees.value.filter(emp =>
                emp.name.toLowerCase().includes(filter) ||
                emp.department.toLowerCase().includes(filter)
            );
        });

        function getTodayStatus(employeeId) {
            const rec = attendanceRecords.value.find(r => r.employeeId === employeeId);
            if (!rec) return '—';
            const today = '2025-07-29';
            const todayRec = rec.attendance.find(a => a.date === today);
            return todayRec ? todayRec.status : '—';
        }

        
        function getTodayStatusClass(employeeId) {
            const status = getTodayStatus(employeeId);
            if (status === 'Present') return 'badge-present';
            if (status === 'Absent') return 'badge-absent';
            return 'badge-secondary';
        }

        
        function getDayStatus(employeeId, day) {
            
            const dateMap = {
                'Mon': '2025-07-25',
                'Tue': '2025-07-26',
                'Wed': '2025-07-27',
                'Thu': '2025-07-28',
                'Fri': '2025-07-29'
            };
            const date = dateMap[day];
            if (!date) return null;
            const rec = attendanceRecords.value.find(r => r.employeeId === employeeId);
            if (!rec) return null;
            const dayRec = rec.attendance.find(a => a.date === date);
            return dayRec ? dayRec.status : null;
        }

        
        function getDayStatusClass(employeeId, day) {
            const status = getDayStatus(employeeId, day);
            if (status === 'Present') return 'day-present';
            if (status === 'Absent') return 'day-absent';
            return 'bg-light text-muted';
        }

        
        function getDayStatusLetter(employeeId, day) {
            const status = getDayStatus(employeeId, day);
            if (status === 'Present') return 'P';
            if (status === 'Absent') return 'A';
            return '—';
        }

        
        function getWeeklySummary(employeeId) {
            const rec = attendanceRecords.value.find(r => r.employeeId === employeeId);
            if (!rec) return '—';
            const total = rec.attendance.length;
            const present = rec.attendance.filter(a => a.status === 'Present').length;
            const absent = total - present;
            return `${present}P / ${absent}A`;
        }

        
        function getWeeklySummaryClass(employeeId) {
            const rec = attendanceRecords.value.find(r => r.employeeId === employeeId);
            if (!rec) return 'badge-secondary';
            const present = rec.attendance.filter(a => a.status === 'Present').length;
            const total = rec.attendance.length;
            if (present === total) return 'badge-present';
            if (present === 0) return 'badge-absent';
            return 'badge-pending';
        }

        
        function getLeaveStatusClass(status) {
            if (status === 'Approved') return 'badge-approved';
            if (status === 'Denied') return 'badge-denied';
            return 'badge-pending';
        }

        
        function hasPendingLeave(employeeId) {
            return leaveRequests.value.some(l =>
                l.employeeId === employeeId && l.status === 'Pending'
            );
        }

        
        function approveLeave(uid) {
            const req = leaveRequests.value.find(l => l._uid === uid);
            if (!req || req.status !== 'Pending') return; 
            req.status = 'Approved';
            
            if (req._lrRef) {
                req._lrRef.status = 'Approved';
            }
        }

        
        function denyLeave(uid) {
            const req = leaveRequests.value.find(l => l._uid === uid);
            if (!req || req.status !== 'Pending') return;
            req.status = 'Denied';
            if (req._lrRef) {
                req._lrRef.status = 'Denied';
            }
        }

        
        function formatDate(dateStr) {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }

        
        onMounted(() => {
            loadData(); 
        });

        
        return {
            activeTab,
            
            attendanceFilter,
            
            
            employees,
            attendanceRecords,
            
            weekDays,
            presentToday,
            absentToday,
            pendingLeavesCount,
            filteredDashboardEmployees,
            filteredAttendanceEmployees,
            
            getTodayStatus,
            getTodayStatusClass,
            getDayStatusClass,
            getDayStatusLetter,
            getWeeklySummary,
            getWeeklySummaryClass,
            getLeaveStatusClass,
            hasPendingLeave,
            approveLeave,
            denyLeave,
            formatDate
        };
    }
});


app.mount('#app');