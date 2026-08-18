const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const { testDatabaseConnection } = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const timeoffRoutes = require("./routes/timeoff.routes");
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Modern Tech Solutions API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/timeoff", timeoffRoutes);

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

const startServer = async () => {
  await testDatabaseConnection();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
