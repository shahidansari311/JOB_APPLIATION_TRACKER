import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { parseJobDescription, generateResumeSuggestions } from "../services/ai.services.js";
import Application from "../models/application.model.js";

/**
 * @route   POST /api/ai/parse-jd
 * @desc    Parse a job description and return structured data
 * @access  Private
 */
export const parseJD = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim().length === 0) {
    return sendError(res, "Job description text is required", 400);
  }

  const parsedData = await parseJobDescription(jobDescription);

  sendSuccess(res, parsedData, "Job description parsed successfully");
});

/**
 * @route   POST /api/ai/resume-suggestions
 * @desc    Generate resume bullet points from job details
 * @access  Private
 */
export const getResumeSuggestions = asyncHandler(async (req, res) => {
  const { role, company, requiredSkills, niceToHaveSkills, seniority } = req.body;

  if (!role) {
    return sendError(res, "Role is required to generate suggestions", 400);
  }

  const suggestions = await generateResumeSuggestions({
    role,
    company,
    requiredSkills,
    niceToHaveSkills,
    seniority,
  });

  sendSuccess(res, { suggestions }, "Resume suggestions generated successfully");
});

/**
 * @route   POST /api/ai/parse-and-create
 * @desc    Parse a JD, create an application with the parsed data, and generate resume suggestions
 * @access  Private
 */
export const parseAndCreateApplication = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim().length === 0) {
    return sendError(res, "Job description text is required", 400);
  }

  // Step 1: Parse the job description
  const parsedData = await parseJobDescription(jobDescription);

  // Step 2: Generate resume suggestions
  let resumeSuggestions = [];
  try {
    resumeSuggestions = await generateResumeSuggestions(parsedData);
  } catch (err) {
    // Don't fail the whole request if suggestions fail
    console.error("Resume suggestions failed, continuing without:", err.message);
  }

  // Step 3: Create the application
  const application = await Application.create({
    company: parsedData.company,
    role: parsedData.role,
    requiredSkills: parsedData.requiredSkills,
    niceToHaveSkills: parsedData.niceToHaveSkills,
    seniority: parsedData.seniority,
    location: parsedData.location,
    salaryRange: parsedData.salaryRange,
    resumeSuggestions,
    user: req.user,
  });

  sendSuccess(res, application, "Application created from job description", 201);
});
