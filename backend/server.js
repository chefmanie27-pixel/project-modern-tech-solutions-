// server.js
// App entry point. Wires up middleware, routes, and error handling.

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const env = require("./config/env");
const { testDatabaseConnection } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route files
const employeesRoutes = require("./routes/employees.routes");
const payrollRoutes = require("./routes/payroll.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const performanceRoutes = require("./routes/performance.routes");
const authRoutes = require("./routes/auth.routes");
const timeoffRoutes = require("./routes/timeoff.routes");
const attendanceRoutes = require("./routes/attendance.routes");

const app = express();
const PORT = env.port;

// --- Core middleware ---
app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

// --- Health check ---
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use("/api/v1/employees", employeesRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/performance", performanceRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/timeoff", timeoffRoutes);
app.use("/api/v1/attendance", attendanceRoutes);

// --- 404 fallback ---
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.originalUrl 
  });
});

// --- Error handler (always last) ---
app.use(errorHandler);

// --- Start server ---
async function start() {
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.warn("⚠️ Server starting without database connection - some features may not work");
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Environment: ${env.nodeEnv}`);
    console.log(`🔌 Database: ${env.db.database} @ ${env.db.host}:${env.db.port}`);
  });
}

start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
  });
});