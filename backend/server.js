// server.js
// App entry point. Wires up middleware, routes, and error handling.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { testConnection } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route files — add each teammate's router here as they build it
const employeesRoutes = require("./routes/employees.routes");
const payrollRoutes = require("./routes/payroll.routes");          // Azhar
const dashboardRoutes = require("./routes/dashboard.routes");      // James
const performanceRoutes = require("./routes/performance.routes");  // James
const authRoutes = require("./routes/auth.routes");                // minimal login/me — Wendy still owns expanding this
// const timeoffRoutes = require("./routes/timeoff.routes");        // Wendy
// const attendanceRoutes = require("./routes/attendance.routes");  // Avela

const app = express();
const PORT = process.env.PORT || 3000;

// --- Core middleware ---
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

// --- Health check ---
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- Routes ---
app.use("/api/v1/employees", employeesRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/performance", performanceRoutes);
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/timeoff", timeoffRoutes);
// app.use("/api/v1/attendance", attendanceRoutes);

// --- 404 fallback ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Error handler (always last) ---
app.use(errorHandler);

// --- Start server ---
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();