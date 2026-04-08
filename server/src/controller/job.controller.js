import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getApplicationsByStatus, getApplicationStats } from "../services/job.services.js";
import mongoose from "mongoose";

/**
 * @route   GET /api/jobs/board
 * @desc    Get applications grouped by status (Kanban board view)
 * @access  Private
 */
export const getBoard = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user);
  const grouped = await getApplicationsByStatus(userId);

  sendSuccess(res, grouped, "Board data fetched successfully");
});

/**
 * @route   GET /api/jobs/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
export const getStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user);
  const stats = await getApplicationStats(userId);

  sendSuccess(res, stats, "Stats fetched successfully");
});