const express = require("express");
const router = express.Router();

const timeoffController = require("../controllers/timeoff.controller");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

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

module.exports = router;
