import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import Application from "../models/application.model.js";

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @access  Private
 */
export const createApplication = asyncHandler(async (req, res) => {
  const applicationData = {
    ...req.body,
    user: req.user,
  };

  const application = await Application.create(applicationData);

  sendSuccess(res, application, "Application created successfully", 201);
});

/**
 * @route   GET /api/applications
 * @desc    Get all applications for the logged-in user
 * @access  Private
 */
export const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user }).sort({
    updatedAt: -1,
  });

  sendSuccess(res, applications, "Applications fetched successfully");
});

/**
 * @route   GET /api/applications/:id
 * @desc    Get a single application by ID
 * @access  Private
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  sendSuccess(res, application, "Application fetched successfully");
});

/**
 * @route   PUT /api/applications/:id
 * @desc    Update an application (full update)
 * @access  Private
 */
export const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  // Update allowed fields
  const allowedFields = [
    "company",
    "role",
    "status",
    "jobDescriptionLink",
    "notes",
    "dateApplied",
    "salaryRange",
    "requiredSkills",
    "niceToHaveSkills",
    "seniority",
    "location",
    "resumeSuggestions",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      application[field] = req.body[field];
    }
  });

  await application.save();

  sendSuccess(res, application, "Application updated successfully");
});

/**
 * @route   PATCH /api/applications/:id/status
 * @desc    Update only the status (for Kanban drag-and-drop)
 * @access  Private
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  application.status = req.body.status;
  await application.save();

  sendSuccess(res, application, "Status updated successfully");
});

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete an application
 * @access  Private
 */
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    user: req.user,
  });

  if (!application) {
    return sendError(res, "Application not found", 404);
  }

  sendSuccess(res, null, "Application deleted successfully");
});
