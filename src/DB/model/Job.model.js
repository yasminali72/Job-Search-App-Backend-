import mongoose, { Schema, Types, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job Title is required"],
      trim: true,
    },
    jobLocation: {
      type: String,
      required: [true, "Job Location is required"],
      enum: ["onsite", "hybrid", "remotely"],
    },
    workingTime: {
      type: String,
      required: [true, "working Time is required"],
      enum: ["part-time", "full-time"],
    },
    seniorityLevel: {
      type: String,
      required: [true, "seniority Level is required"],
      enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    },
    jobDescription: {
      type: String,
      required: [true, "job Description is Required"],
      trim: true,
    },
    technicalSkills: {
      type: [String],
      required: [true, "Technical Skills is required"],
    },
    softSkills: {
      type: [String],
      required: [true, "Soft Skills is required"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" ||"Company",
      required: [true, "Job must be added by an HR or owner "],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Job must be associated with a company"],
    },
  },
  { timestamps: true }
);

const jobModel = mongoose.models.Job || model("Job", jobSchema);
export default jobModel;
