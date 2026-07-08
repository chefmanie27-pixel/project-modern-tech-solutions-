


const employeeData = {
    employeeInformation: [
        {
            employeeId: 1,
            name: "Sibongile Nkosi",
            position: "Software Engineer",
            department: "Development",
            salary: 70000,
            employmentHistory: "Joined in 2015, promoted to Senior in 2018",
            contact: "sibongile.nkosi@moderntech.com"
        },
        {
            employeeId: 2,
            name: "Lungile Moyo",
            position: "HR Manager",
            department: "HR",
            salary: 80000,
            employmentHistory: "Joined in 2013, promoted to Manager in 2017",
            contact: "lungile.moyo@moderntech.com"
        },
        {
            employeeId: 3,
            name: "Thabo Molefe",
            position: "Quality Analyst",
            department: "QA",
            salary: 55000,
            employmentHistory: "Joined in 2018",
            contact: "thabo.molefe@moderntech.com"
        },
        {
            employeeId: 4,
            name: "Keshav Naidoo",
            position: "Sales Representative",
            department: "Sales",
            salary: 60000,
            employmentHistory: "Joined in 2020",
            contact: "keshav.naidoo@moderntech.com"
        },
        {
            employeeId: 5,
            name: "Zanele Khumalo",
            position: "Marketing Specialist",
            department: "Marketing",
            salary: 58000,
            employmentHistory: "Joined in 2019",
            contact: "zanele.khumalo@moderntech.com"
        },
        {
            employeeId: 6,
            name: "Sipho Zulu",
            position: "UI/UX Designer",
            department: "Design",
            salary: 65000,
            employmentHistory: "Joined in 2016",
            contact: "sipho.zulu@moderntech.com"
        },
        {
            employeeId: 7,
            name: "Naledi Moeketsi",
            position: "DevOps Engineer",
            department: "IT",
            salary: 72000,
            employmentHistory: "Joined in 2017",
            contact: "naledi.moeketsi@moderntech.com"
        },
        {
            employeeId: 8,
            name: "Farai Gumbo",
            position: "Content Strategist",
            department: "Marketing",
            salary: 56000,
            employmentHistory: "Joined in 2021",
            contact: "farai.gumbo@moderntech.com"
        },
        {
            employeeId: 9,
            name: "Karabo Dlamini",
            position: "Accountant",
            department: "Finance",
            salary: 62000,
            employmentHistory: "Joined in 2018",
            contact: "karabo.dlamini@moderntech.com"
        },
        {
            employeeId: 10,
            name: "Fatima Patel",
            position: "Customer Support Lead",
            department: "Support",
            salary: 58000,
            employmentHistory: "Joined in 2016",
            contact: "fatima.patel@moderntech.com"
        }
    ]
};


const attendanceData = {
    attendanceAndLeave: [
        {
            employeeId: 1,
            name: "Sibongile Nkosi",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Absent" },
                { date: "2025-07-27", status: "Present" },
                { date: "2025-07-28", status: "Present" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2025-07-22", reason: "Sick Leave", status: "Approved" },
                { date: "2024-12-01", reason: "Personal", status: "Pending" }
            ]
        },
        {
            employeeId: 2,
            name: "Lungile Moyo",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Absent" },
                { date: "2025-07-28", status: "Present" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2025-07-15", reason: "Family Responsibility", status: "Denied" },
                { date: "2024-12-02", reason: "Vacation", status: "Approved" }
            ]
        },
        {
            employeeId: 3,
            name: "Thabo Molefe",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Present" },
                { date: "2025-07-28", status: "Absent" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2025-07-10", reason: "Medical Appointment", status: "Approved" },
                { date: "2024-12-05", reason: "Personal", status: "Pending" }
            ]
        },
        {
            employeeId: 4,
            name: "Keshav Naidoo",
            attendance: [
                { date: "2025-07-25", status: "Absent" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Present" },
                { date: "2025-07-28", status: "Present" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2025-07-20", reason: "Bereavement", status: "Approved" }
            ]
        },
        {
            employeeId: 5,
            name: "Zanele Khumalo",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Absent" },
                { date: "2025-07-28", status: "Present" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2024-12-01", reason: "Childcare", status: "Pending" }
            ]
        },
        {
            employeeId: 6,
            name: "Sipho Zulu",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Absent" },
                { date: "2025-07-28", status: "Present" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2025-07-18", reason: "Sick Leave", status: "Approved" }
            ]
        },
        {
            employeeId: 7,
            name: "Naledi Moeketsi",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Present" },
                { date: "2025-07-28", status: "Absent" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2025-07-22", reason: "Vacation", status: "Pending" }
            ]
        },
        {
            employeeId: 8,
            name: "Farai Gumbo",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Absent" },
                { date: "2025-07-27", status: "Present" },
                { date: "2025-07-28", status: "Present" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2024-12-02", reason: "Medical Appointment", status: "Approved" }
            ]
        },
        {
            employeeId: 9,
            name: "Karabo Dlamini",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Present" },
                { date: "2025-07-28", status: "Absent" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2025-07-19", reason: "Childcare", status: "Denied" }
            ]
        },
        {
            employeeId: 10,
            name: "Fatima Patel",
            attendance: [
                { date: "2025-07-25", status: "Present" },
                { date: "2025-07-26", status: "Present" },
                { date: "2025-07-27", status: "Absent" },
                { date: "2025-07-28", status: "Present" },
                { date: "2025-07-29", status: "Present" }
            ],
            leaveRequests: [
                { date: "2024-12-03", reason: "Vacation", status: "Pending" }
            ]
        }
    ]
};