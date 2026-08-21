// routes/performance.routes.js
import express from "express";
const router = express.Router();

import {
  listReviews,
  getReviewsForEmployee,
  createReview,
} from "../controllers/performance.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.get("/", listReviews);
router.get("/:employeeId", getReviewsForEmployee);
router.post("/", createReview);

export default router;
