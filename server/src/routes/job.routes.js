import express from "express";
import { getBoard, getStats } from "../controller/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/board", getBoard);
router.get("/stats", getStats);

export default router;