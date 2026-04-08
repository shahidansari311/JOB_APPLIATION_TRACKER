import express from "express";
import { parseJD, getResumeSuggestions, parseAndCreateApplication } from "../controller/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All AI routes require authentication
router.use(protect);

router.post("/parse-jd", parseJD);
router.post("/resume-suggestions", getResumeSuggestions);
router.post("/parse-and-create", parseAndCreateApplication);

export default router;
