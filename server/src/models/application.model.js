import mongoose from "mongoose";
import { APPLICATION_STATUS, APPLICATION_STATUS_VALUES } from "../constants/status.js";

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUS_VALUES,
        message: "Status must be one of: " + APPLICATION_STATUS_VALUES.join(", "),
      },
      default: APPLICATION_STATUS.APPLIED,
    },
    jobDescriptionLink: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    salaryRange: {
      type: String,
      trim: true,
      default: "",
    },
    // AI-parsed fields from job description
    requiredSkills: {
      type: [String],
      default: [],
    },
    niceToHaveSkills: {
      type: [String],
      default: [],
    },
    seniority: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    resumeSuggestions: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for fast queries: get all applications for a user
applicationSchema.index({ user: 1, status: 1 });

export default mongoose.model("Application", applicationSchema);
