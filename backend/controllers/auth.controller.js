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

module.exports = {
  login,
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
