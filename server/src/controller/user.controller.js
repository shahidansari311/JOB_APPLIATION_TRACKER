import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getUserProfile } from "../services/auth.services.js";

/**
 * @route   GET /api/users/me
 * @desc    Get current logged-in user's profile
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user);

  sendSuccess(res, user, "User profile fetched");
});
