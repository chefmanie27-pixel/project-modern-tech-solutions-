import express from "express";
import { login, register, logout, getMe } from "../controllers/auth.controller.js";
import authenticateToken from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", login);
// Registration is admin-only in practice — only a logged-in admin can create
// new user accounts.
router.post("/register", authenticateToken, requireRole("admin"), register);
router.post("/logout", authenticateToken, logout);
router.get("/me", authenticateToken, getMe);

export default router;
