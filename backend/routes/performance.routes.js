// routes/performance.routes.js
const express = require("express");
const router = express.Router();

const {
  listReviews,
  getReviewsForEmployee,
  createReview,
} = require("../controllers/performance.controller");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", listReviews);
router.get("/:employeeId", getReviewsForEmployee);
router.post("/", createReview);

module.exports = router;