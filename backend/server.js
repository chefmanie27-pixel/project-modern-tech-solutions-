// server.js
// App entry point. Wires up middleware, routes, and error handling.

import express from "express";
import cors from "cors";
import helmet from "helmet";

import env from "./config/env.js";
import { testDatabaseConnection } from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

// Route files
import employeesRoutes from "./routes/employees.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import performanceRoutes from "./routes/performance.routes.js";
import authRoutes from "./routes/auth.routes.js";
import timeoffRoutes from "./routes/timeoff.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

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
