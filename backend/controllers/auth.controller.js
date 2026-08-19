// controllers/auth.controller.js
// Minimal login/me so the rest of the app is testable end-to-end.
// Wendy owns the full auth module per the plan (register, logout blacklist,
// timeoff) — this covers just enough to issue and verify a real JWT.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/v1/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.getByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role, employeeId: user.employee_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    await User.touchLastLogin(user.user_id);

    res.json({
      token,
      user: { id: user.user_id, email: user.email, role: user.role, employeeId: user.employee_id },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/auth/me
async function me(req, res, next) {
  try {
    // req.user is set by authMiddleware from the verified JWT payload
    const user = await User.getById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/logout
// JWTs are stateless, so this is a no-op on the server for now — the
// client just discards its token. Flagged as a known gap in the plan.
async function logout(req, res) {
  res.json({ message: "Logged out" });
}

module.exports = { login, me, logout };
