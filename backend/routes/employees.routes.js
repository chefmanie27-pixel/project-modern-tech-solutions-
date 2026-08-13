// routes/employees.routes.js
const express = require("express");
const router = express.Router();

const {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.controller");

const authMiddleware = require("../middleware/authMiddleware");

// All employee routes require a logged-in user
router.use(authMiddleware);

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
