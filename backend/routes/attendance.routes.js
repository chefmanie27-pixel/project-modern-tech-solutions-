

import { Router } from "express";
const router = Router();

// Bring in the functions that actually handle each request
import { getSummary, getAll, getByEmployee, create, update } from "../controllers/attendance.controller";


import authMiddleware from "../middleware/authMiddleware"; // checks: are you logged in?
import roleMiddleware from "../middleware/roleMiddleware"; // checks: are you allowed to do this?

// Every single attendance route needs the user to be logged in first.
// Putting it here once means we don't have to repeat it on every route below.
router.use(authMiddleware);


// GET /api/v1/attendance/summary
router.get("/summary", getSummary);


// GET /api/v1/attendance
router.get("/", getAll);


// GET /api/v1/attendance/123
router.get("/:employeeId", getByEmployee);

// POST /api/v1/attendance
router.post("/", create);


// PATCH /api/v1/attendance/45
router.patch("/:id", roleMiddleware(["admin", "hr"]), update);

export default router;