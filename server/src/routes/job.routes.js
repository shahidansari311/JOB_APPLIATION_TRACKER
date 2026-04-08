import express from "express";
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob
} from "../controllers/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createJob)
  .get(protect, getJobs);

router.route("/:id")
  .put(protect, updateJob)
  .delete(protect, deleteJob);

export default router;