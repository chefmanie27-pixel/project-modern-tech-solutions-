// server.js
// App entry point. Wires up middleware, routes, and error handling.

require("dotenv").config();
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";

import { testConnection } from "./config/db";
import errorHandler from "./middleware/errorHandler";

// Route files — add each teammate's router here as they build it
import employeesRoutes from "./routes/employees.routes";
import payrollRoutes from "./routes/payroll.routes";        // Azhar
import authRoutes from "./routes/auth.routes";             // minimal login/me — Wendy still owns expanding this
// const timeoffRoutes = require("./routes/timeoff.routes");      // Wendy
// const attendanceRoutes = require("./routes/attendance.routes");// Avela
// const dashboardRoutes = require("./routes/dashboard.routes");  // James
// const performanceRoutes = require("./routes/performance.routes"); // James

const app = express();
const PORT = process.env.PORT || 3000;

// --- Core middleware ---
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(json());

// --- Health check ---
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- Routes ---
app.use("/api/v1/employees", employeesRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/timeoff", timeoffRoutes);
// app.use("/api/v1/attendance", attendanceRoutes);
// app.use("/api/v1/dashboard", dashboardRoutes);
// app.use("/api/v1/performance", performanceRoutes);
// app.use("/api/v1/payroll", payrollRoutes);

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