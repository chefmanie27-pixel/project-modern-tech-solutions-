# project-modern-tech-solutions-

# ModernTech Solutions – HR Management System

A full-stack HR portal built for **ModernTech Solutions**, a healthcare software company, to replace their fragmented spreadsheet-and-email HR processes with a single, user-friendly HR system.

Originally built as the Module 1 Core Project for Life Choices Academy's Software Development course as a client-side-only proof of concept, the project has since grown a real Node.js/Express + MySQL backend. The frontend is deployed on **Netlify** and the backend API is deployed on **Railway**.

**Frontend site:** https://chefmanie27-pixel.github.io/project-modern-tech-frontend/

**Live app:** [https://roaring-fenglisu-d675db.netlify.app/)](https://roaring-fenglisu-d675db.netlify.app/)

**Live API:** `https://project-modern-tech-solutions-production.up.railway.app/api/v1`

**Github Frontend:** https://github.com/chefmanie27-pixel/project-modern-tech-frontend.git

**Github Backend:** https://github.com/chefmanie27-pixel/project-modern-tech-solutions-.git

## Features

- **Login / Access Portal** — real authentication (JWT + bcrypt-hashed passwords), no more hardcoded localStorage flag
- **Dashboard** — KPI overview (active employees, monthly payroll, pending requests, average attendance) plus charts for attendance, department headcount, and payroll trends, served from live API aggregation endpoints
- **Employee Management** — add, view, update, and remove employee records (personal info, salary details, employment history), backed by MySQL
- **Payroll** — payroll runs with gross/deductions/net calculations, payslip generation, and a (currently simulated) disbursement endpoint ready for a real payment provider
- **Time Off** — submit, review, approve/deny, and cancel leave requests, with role-restricted status changes
- **Attendance** — log and view attendance records per employee, plus a summary endpoint the dashboard reuses
- **Performance Reviews** — view review history and submit new performance reviews

## Team & Contributions

| Team Member | Contributions |
|---|---|
| **Azhar** | Employees & Payroll pages/API, backend integration lead — server setup, DB connection pooling, employee/payroll CRUD, payroll calc service, cross-page fetch integration |
| **James** | Dashboard page/API and aggregation endpoints, Performance Reviews page/API |
| **Wendy** | Login page, Auth API (JWT issuing, `authMiddleware`, `roleMiddleware`), Time Off page/API |
| **Avela** | Attendance page/API + summary aggregation |

## Tech Stack

**Frontend**
- HTML5, CSS3 (Bootstrap), single consolidated stylesheet (`css/combined-styles.css`)
- JavaScript (a Vue 3 subtree for Attendance; vanilla JS + a shared `api.js` fetch wrapper everywhere else)
- Font Awesome (icons), Google Fonts (Poppins), Chart.js (dashboard graphs)
- Deployed on **Netlify**

**Backend**
- Node.js + Express (ESM)
- MySQL (via `mysql2`), connection pooling
- JWT auth (`jsonwebtoken`) + `bcrypt` password hashing
- `helmet` for security headers, `cors` for cross-origin requests
- Deployed on **Railway**

## Project Structure

```
project-modern-tech-solutions/
├── frontend/
│   ├── index.html                     # Login / Access Portal (start here)
│   ├── dashboard.html
│   ├── employees.html
│   ├── payroll.html
│   ├── time-off-page.html
│   ├── performance-reviews.html
│   ├── css/
│   │   └── combined-styles.css        # All page styles, merged into one file
│   ├── js/
│   │   ├── config.js                  # Sets window.API_BASE (local vs. Railway) — load first
│   │   ├── api.js                     # Shared fetch wrapper (auth headers, 401 redirect, etc.)
│   │   ├── auth-guard.js              # Verifies the JWT against /auth/me on every protected page
│   │   ├── login.js
│   │   ├── nav.js                     # Shared navigation dropdown logic
│   │   ├── dashboard.js
│   │   └── performance-reviews.js
│   ├── vue-app/
│   │   ├── attendance.html            # Attendance page (Vue 3 subtree)
│   │   ├── app.js
│   │   └── data.js
│   └── data/
│       └── employee_info.json         # Legacy dummy data (kept for reference/local fallback)
│
├── backend/
│   ├── server.js                      # Express app entry point
│   ├── .env.example                   # Copy to .env and fill in real values
│   ├── package.json
│   ├── config/
│   │   ├── db.js                      # MySQL connection pool
│   │   └── env.js                     # Centralised env var loader/validator
│   ├── middleware/
│   │   ├── authMiddleware.js          # Verifies JWT, attaches req.user
│   │   ├── roleMiddleware.js          # Restricts routes by role
│   │   └── errorHandler.js            # Centralised error → JSON response
│   ├── routes/                        # auth, employees, payroll, timeoff, attendance, dashboard, performance
│   ├── controllers/                   # One controller per route file
│   ├── models/                        # Query modules per table
│   ├── services/
│   │   ├── payrollCalc.service.js     # Gross/deductions/net logic
│   │   ├── email.service.js           # Notification email wrapper
│   │   └── payrollApi.service.js      # External payroll/payment API wrapper (simulated for now)
│   ├── db/
│   │   ├── schema.sql                 # CREATE TABLE statements
│   │   └── seed.sql                   # Seed data (sample employees + placeholder admin login)
│   └── scripts/
│       ├── hash-password.js           # Generate a bcrypt hash for a password
│       ├── setup-data.js
│       └── seed-recent-data.js
│
└── README.md
```

## Live Deployment

- **Frontend (Netlify):** static hosting of everything in `frontend/`. Netlify serves `index.html` as the entry point.
- **Backend (Railway):** runs `backend/server.js` against a MySQL database, with environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `CLIENT_ORIGIN`, etc.) configured in the Railway project settings rather than a committed `.env` file.
- `frontend/js/config.js` automatically points the app at `http://localhost:3000/api/v1` when running locally, and at the deployed Railway URL when running on Netlify — no manual switching needed.
- CORS on the backend (`CLIENT_ORIGIN` in `.env` / Railway variables) must match the deployed Netlify origin, or the browser will block API calls.

## How to Use the Site

### 1. Using the live deployment

Just open the Netlify URL above — the frontend is already wired to the live Railway API. No setup required.

### 2. Running it locally

**Backend**

```bash
cd backend
npm install
cp .env.example .env      # fill in your local MySQL credentials + a JWT_SECRET
mysql -u root -p < db/schema.sql
mysql -u root -p moderntech < db/seed.sql
node scripts/hash-password.js "admin123"   # copy the hash into the admin row in db/seed.sql (or UPDATE it directly)
npm run dev                # starts the API at http://localhost:3000
```

Health check: `GET http://localhost:3000/api/v1/health` → `{ "status": "ok" }`

**Frontend**

Serve the `frontend/` folder with any static server (e.g. VS Code "Live Server") rather than opening `index.html` directly, so `window.location.hostname` resolves to `localhost` and `config.js` points at your local API.

### 3. Signing in

1. On the welcome screen, click **Access Portal**.
2. Enter the demo credentials:
   - **Email:** `admin@moderntech.com`
   - **Password:** `admin123`
3. Click **Sign In**. You'll be redirected to the Dashboard.

> Login now issues a real JWT from `POST /api/v1/auth/login`, stored in `localStorage` under `moderntech_token`. Every protected page's `auth-guard.js` verifies that token against `GET /api/v1/auth/me` on load and redirects to `index.html` if it's missing or invalid.

### 4. Navigating the system

Once logged in, use the top navigation bar to move between pages:

- **Dashboard** — snapshot of key HR metrics and charts, pulled from `/api/v1/dashboard/*`
- **Employees** — view the employee list and use the *Add New Employee* form to add a new record via `/api/v1/employees`
- **Payroll** — select an employee to view/generate their payslip via `/api/v1/payroll/*`
- **Time Off** — submit a new leave request and view/approve/deny existing requests via `/api/v1/timeoff/*`
- **Attendance** — view attendance records per employee via `/api/v1/attendance/*`
- **Performance Reviews** — select an employee to view their review history or submit a new review via `/api/v1/performance/*`

### 5. Things to keep in mind

- Data is now persisted in a real MySQL database — no more resetting on page refresh.
- Payroll disbursement (`POST /api/v1/payroll/:id/disburse`) is currently **simulated**; it isn't wired to a real payment provider yet.
- The interface is **responsive** — try resizing your browser window, or open it on a tablet/phone, to see the layout adapt.
- To log out and test the login flow again, clear `moderntech_token` / `moderntech_user` from local storage (or open the site in a private/incognito window).

## API Overview

All endpoints are mounted under `/api/v1` and (except `/auth/login`) require a `Authorization: Bearer <token>` header.

| Area | Routes |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/register` (admin-only), `POST /auth/logout`, `GET /auth/me` |
| Employees | `GET /employees`, `GET /employees/:id`, `POST /employees`, `PUT /employees/:id`, `DELETE /employees/:id` |
| Payroll | `GET /payroll`, `GET /payroll/:employeeId`, `POST /payroll/run`, `POST /payroll/:id/disburse`, `GET /payroll/:id/payslip` |
| Time Off | `GET /timeoff`, `GET /timeoff/:id`, `POST /timeoff`, `PUT /timeoff/:id`, `DELETE /timeoff/:id`, `PATCH /timeoff/:id/status` |
| Attendance | `GET /attendance`, `GET /attendance/summary`, `GET /attendance/:employeeId`, `POST /attendance`, `PATCH /attendance/:id` |
| Dashboard | `GET /dashboard/kpis`, `GET /dashboard/attendance-chart`, `GET /dashboard/department-headcount`, `GET /dashboard/payroll-trend` |
| Performance Reviews | `GET /performance`, `GET /performance/:employeeId`, `POST /performance` |

Role-restricted routes (leave approval, payroll runs/disbursement/attendance corrections) require the requesting user's role to be `admin`, `hr`, or `manager` as noted per route.

### env
# Server
PORT=3000
NODE_ENV=development

# MySQL database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=moderntech

# Auth
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=8h

# Front-end origin (for CORS)
CLIENT_ORIGIN=http://127.0.0.1:5500


## Notes

- This started as a proof-of-concept front-end-only build and has since grown a production-style Express/MySQL backend, deployed on Railway with the frontend on Netlify.
- No real payment processing is connected yet — payroll disbursement is simulated pending a provider integration (see `services/payrollApi.service.js`).
- Best viewed in an up-to-date version of Chrome, Firefox, Edge, or Safari.

### Figma Link

- https://www.figma.com/design/XRBCO1Ay0vCAoLJJ9kVhI9/Untitled?node-id=0-1&t=2DelupChxbIR18RJ-1
