<<<<<<< HEAD
// routes/auth.routes.js
const express = require("express");
const router = express.Router();

const { login, me, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

// router.post("/register", ...); // Wendy: admin-only user creation
=======
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
>>>>>>> origin/backend/wendy

module.exports = router;
