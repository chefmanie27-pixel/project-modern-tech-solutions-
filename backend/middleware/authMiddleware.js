<<<<<<< HEAD
// middleware/authMiddleware.js
// Verifies the JWT sent in the Authorization header and attaches the
// decoded user info to req.user. Used on every protected route.

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
=======
const jwt = require("jsonwebtoken");
const env = require("../config/env");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token required",
    });
>>>>>>> origin/backend/wendy
  }

  const token = authHeader.split(" ")[1];

  try {
<<<<<<< HEAD
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // e.g. { userId, role, employeeId }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
=======
    const decoded = jwt.verify(token, env.jwt.secret);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = authenticateToken;
>>>>>>> origin/backend/wendy
