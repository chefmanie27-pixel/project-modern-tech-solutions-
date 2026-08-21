// controllers/performance.controller.js
import * as PerformanceReview from "../models/PerformanceReview.js";

async function listReviews(req, res, next) {
  try {
    const reviews = await PerformanceReview.getAll();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

async function getReviewsForEmployee(req, res, next) {
  try {
    const reviews = await PerformanceReview.getByEmployee(req.params.employeeId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const { employee_id, reviewer_id, period, review_date, technical_skill, collaboration, communication, strengths, areas_to_grow } = req.body;

    if (!employee_id || !period || !review_date) {
      return res.status(400).json({ message: "employee_id, period, and review_date are required" });
    }

    const review = await PerformanceReview.create({
      employee_id, reviewer_id, period, review_date,
      technical_skill, collaboration, communication, strengths, areas_to_grow,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

export { listReviews, getReviewsForEmployee, createReview };
