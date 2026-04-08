import express from "express";
import { register, login } from "../controller/auth.controller.js";
import { registerRules, loginRules, validate } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);

export default router;