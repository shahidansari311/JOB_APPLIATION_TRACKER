import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controller/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  createApplicationRules,
  updateApplicationRules,
  updateStatusRules,
  idParamRules,
  validate,
} from "../validators/job.validator.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router
  .route("/")
  .post(createApplicationRules, validate, createApplication)
  .get(getApplications);

router
  .route("/:id")
  .get(idParamRules, validate, getApplicationById)
  .put(updateApplicationRules, validate, updateApplication)
  .delete(idParamRules, validate, deleteApplication);

router
  .route("/:id/status")
  .patch(updateStatusRules, validate, updateApplicationStatus);

export default router;
