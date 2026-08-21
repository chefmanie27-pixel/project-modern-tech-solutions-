import express from "express";
const router = express.Router();

import * as timeoffController from "../controllers/timeoff.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

router.use(authMiddleware);

router.get("/", timeoffController.getAll);
router.get("/:id", timeoffController.getById);

router.post("/", timeoffController.create);
router.put("/:id", timeoffController.update);
router.delete("/:id", timeoffController.remove);

router.patch(
  "/:id/status",
  requireRole("admin", "hr", "manager"),
  timeoffController.updateStatus,
);

export default router;
