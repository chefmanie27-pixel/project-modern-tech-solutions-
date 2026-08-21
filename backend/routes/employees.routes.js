// routes/employees.routes.js
import express from "express";
const router = express.Router();

import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employees.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

// All employee routes require a logged-in user
router.use(authMiddleware);

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
