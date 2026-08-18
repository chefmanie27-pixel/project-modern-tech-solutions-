const express = require("express");
const router = express.Router();

const timeoffController = require("../controllers/timeoff.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", timeoffController.getAll);
router.get("/:id", timeoffController.getById);

router.post("/", timeoffController.create);
router.put("/:id", timeoffController.update);
router.delete("/:id", timeoffController.remove);

router.patch("/:id/status", timeoffController.updateStatus);

module.exports = router;

router.use(authMiddleware);
