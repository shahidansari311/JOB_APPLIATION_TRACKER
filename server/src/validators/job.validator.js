import { body, param, validationResult } from "express-validator";
import { sendError } from "../utils/apiResponse.js";
import { APPLICATION_STATUS_VALUES } from "../constants/status.js";

/**
 * Middleware to check validation results.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation failed", 400, errors.array());
  }
  next();
};

/**
 * Validation rules for creating an application.
 */
export const createApplicationRules = [
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required"),
  body("status")
    .optional()
    .isIn(APPLICATION_STATUS_VALUES)
    .withMessage(`Status must be one of: ${APPLICATION_STATUS_VALUES.join(", ")}`),
  body("jobDescriptionLink")
    .optional()
    .isURL()
    .withMessage("Job description link must be a valid URL"),
  body("dateApplied")
    .optional()
    .isISO8601()
    .withMessage("Date applied must be a valid date"),
  body("salaryRange")
    .optional()
    .trim(),
  body("notes")
    .optional()
    .trim(),
];

/**
 * Validation rules for updating an application.
 */
export const updateApplicationRules = [
  param("id")
    .isMongoId()
    .withMessage("Invalid application ID"),
  body("company")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty"),
  body("role")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Role cannot be empty"),
  body("status")
    .optional()
    .isIn(APPLICATION_STATUS_VALUES)
    .withMessage(`Status must be one of: ${APPLICATION_STATUS_VALUES.join(", ")}`),
  body("jobDescriptionLink")
    .optional()
    .trim()
    .custom((value) => {
      if (value === "" || value === undefined || value === null) return true;
      try { new URL(value); return true; } catch { return false; }
    })
    .withMessage("Job description link must be a valid URL"),
  body("dateApplied")
    .optional()
    .custom((value) => {
      if (!value) return true;
      return !isNaN(new Date(value).getTime());
    })
    .withMessage("Date applied must be a valid date"),
  body("salaryRange")
    .optional()
    .trim(),
  body("notes")
    .optional()
    .trim(),
];

/**
 * Validation for status-only update (Kanban drag).
 */
export const updateStatusRules = [
  param("id")
    .isMongoId()
    .withMessage("Invalid application ID"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(APPLICATION_STATUS_VALUES)
    .withMessage(`Status must be one of: ${APPLICATION_STATUS_VALUES.join(", ")}`),
];

/**
 * Validation for delete/get by ID.
 */
export const idParamRules = [
  param("id")
    .isMongoId()
    .withMessage("Invalid application ID"),
];
