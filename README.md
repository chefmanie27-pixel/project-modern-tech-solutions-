# project-modern-tech-solutions-

# ModernTech Solutions – HR Management System

A front-end web application (proof of concept) built for **ModernTech Solutions**, a healthcare software company, to replace their fragmented spreadsheet-and-email HR processes with a single, user-friendly HR portal.

This project was built as the Module 1 Core Project for Life Choices Academy's Software Development course. It is a **client-side only** application — all data is dummy/demo data stored and manipulated in the browser (no back-end or database).

## Features

- **Login / Access Portal** — simple authentication gate before entering the system
- **Dashboard** — KPI overview (active employees, monthly payroll, pending requests, average attendance) plus charts for attendance, department headcount, and payroll trends
- **Employee Management** — add, view, and manage employee records (personal info, salary details, employment history)
- **Payroll** — automated payroll calculations (gross pay, deductions, net pay) with digital payslip generation
- **Time Off** — submit and manage leave requests
- **Attendance** — track and view employee attendance
- **Performance Reviews** — view review history and submit new performance reviews

## Team & Contributions

| Team Member | Contributions |
|---|---|
| **Azhar** | Employees page, Payroll page, project merging/integration lead — merged and linked all separate branch files, consolidated all CSS into a single stylesheet (`combined-styles.css`) |
| **James** | Dashboard page, Performance Reviews page and figma design |
| **Wendy** | Login page, Time Off page |
| **Avela** | Attendance page |

## Tech Stack

- HTML5, CSS3 (Bootstrap)
- JavaScript (Vue JS)
- Font Awesome (icons)
- Google Fonts (Poppins)
- Chart.js / equivalent charting library (dashboard graphs)
- Dummy/local JSON data — no backend required

## Project Structure

```
project-modern-tech-solutions/
├── index.html                 # Login / Access Portal (start here)
├── login.js                   # Login logic + auth
├── auth-guard.js              # Protects pages from unauthenticated access
├── nav.js                     # Shared navigation dropdown logic
├── combined-styles.css        # All page styles, merged into one file
├── dashboard.html / .js       # Dashboard page
├── employees.html             # Employee Management page
├── payroll.html                # Payroll page
├── time-off-page.html         # Time Off page
├── performance-reviews.html / .js   # Performance Reviews page
├── Modern Tech/
│   ├── attendance.html        # Attendance page
│   ├── app.js
│   └── data.js
├── data/
│   └── employee_info.json     # Dummy employee data
└── README.md
```

## How to Use the Site

### 1. Getting started

1. Download or clone the repository.
2. Open the project folder.
3. Open **`index.html`** in your web browser (double-click it, or right-click → *Open with* → your browser). No installation or server is required, though running it via a simple local server (e.g., the VS Code "Live Server" extension) is recommended for the best experience.

### 2. Signing in

1. On the welcome screen, click **Access Portal**.
2. Enter the demo credentials:
   - **Email:** `admin@moderntech.com`
   - **Password:** `admin123`
3. Click **Sign In**. You'll be redirected to the Dashboard.

> Login uses hardcoded demo credentials and `localStorage` to simulate an authenticated session. Every page other than the login page is protected — if you aren't logged in, you'll automatically be redirected back to `index.html`.

### 3. Navigating the system

Once logged in, use the top navigation bar to move between pages:

- **Dashboard** – snapshot of key HR metrics and charts
- **Employees** – view the employee list and use the *Add New Employee* form to add a new record
- **Payroll** – select an employee to view/generate their payslip (gross pay, deductions, net pay)
- **Time Off** – submit a new leave request and view existing requests
- **Attendance** – view attendance records per employee
- **Performance Reviews** – select an employee to view their review history or submit a new review

### 4. Things to keep in mind

- All data is **dummy data** stored in JavaScript files (`data.js`, `employee_info.json`) or generated in-browser — nothing is saved to a real database, so refreshing the page may reset any unsaved changes depending on the page.
- The interface is **responsive** — try resizing your browser window, or open it on a tablet/phone, to see the layout adapt.
- To log out and test the login flow again, clear your browser's local storage for the site (or open the site in a private/incognito window).

## Notes

- This is a **proof-of-concept front-end only** build — no real back-end, database, or payment/payroll processing is connected.
- Best viewed in an up-to-date version of Chrome, Firefox, Edge, or Safari.