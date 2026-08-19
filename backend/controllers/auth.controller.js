<<<<<<< HEAD
// controllers/auth.controller.js
// Minimal login/me so the rest of the app is testable end-to-end.
// Wendy owns the full auth module per the plan (register, logout blacklist,
// timeoff) — this covers just enough to issue and verify a real JWT.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/v1/auth/login
=======
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");

>>>>>>> origin/backend/wendy
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
<<<<<<< HEAD
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
=======
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    await User.updateLastLogin(user.user_id);

    const token = jwt.sign(
      {
        userId: user.user_id,
        employeeId: user.employee_id,
        email: user.email,
        role: user.role,
      },
      env.jwt.secret,
      {
        expiresIn: env.jwt.expiresIn,
      },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.user_id,
        employeeId: user.employee_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

const VALID_ROLES = ["admin", "hr", "manager", "employee"];

async function register(req, res, next) {
  try {
    const { email, password, role, employeeId } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "email, password, and role are required",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed values: ${VALID_ROLES.join(", ")}`,
      });
    }

    const existing = await User.findByEmail(email);

    if (existing) {
      return res.status(409).json({
        message: "A user with that email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      employeeId: employeeId || null,
      email,
      passwordHash,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        userId: user.user_id,
        employeeId: user.employee_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

// JWTs are stateless, so logout is primarily a client-side action (discard
// the token). This endpoint exists for API symmetry and as the natural
// place to add a server-side token blacklist later if that becomes needed.
async function logout(req, res) {
  res.json({
    message: "Logged out successfully",
  });
}

module.exports = {
  login,
  register,
  logout,
  getMe,
};

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    res.json({
      user: {
        userId: user.user_id,
        employeeId: user.employee_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
>>>>>>> origin/backend/wendy
