import express from "express";
import { getMe, updateMe, updatePassword } from "../controller/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/me/password", protect, updatePassword);

export default router;
