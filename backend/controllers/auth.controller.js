const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
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
