const express = require("express");
const { login, register, logout, getMe } = require("../controllers/auth.controller");
const authenticateToken = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/login", login);
// Registration is admin-only in practice — only a logged-in admin can create
// new user accounts.
router.post("/register", authenticateToken, requireRole("admin"), register);
router.post("/logout", authenticateToken, logout);
router.get("/me", authenticateToken, getMe);

module.exports = router;
