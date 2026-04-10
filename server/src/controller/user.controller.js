import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getUserProfile, updateUserProfile, changeUserPassword } from "../services/auth.services.js";

/**
 * @route   GET /api/users/me
 * @desc    Get current logged-in user's profile
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user);
  sendSuccess(res, user, "User profile fetched");
});

/**
 * @route   PUT /api/users/me
 * @desc    Update current user's profile (name, email)
 * @access  Private
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await updateUserProfile(req.user, { name, email });
  sendSuccess(res, user, "Profile updated successfully");
});

/**
 * @route   PUT /api/users/me/password
 * @desc    Change current user's password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await changeUserPassword(req.user, { currentPassword, newPassword });
  sendSuccess(res, null, "Password updated successfully");
});
