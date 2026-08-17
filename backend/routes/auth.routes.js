// routes/auth.routes.js
const express = require("express");
const router = express.Router();

const { login, me, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

// router.post("/register", ...); // Wendy: admin-only user creation

module.exports = router;
