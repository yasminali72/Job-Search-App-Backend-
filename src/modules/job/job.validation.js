import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const addJob = joi
  .object()
  .keys({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "hybrid", "remotely").required(),
    workingTime: joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()).required(),
    softSkills: joi.array().items(joi.string()).required(),
  })
  .required();

 export const updateJob=joi.object().keys({
    jobId:generalFields.id.required(),
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("onsite", "hybrid", "remotely"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    closed:joi.boolean()

  }).required()

  export const deleteJob=joi.object().keys({
    jobId:generalFields.id.required()
  }).required()


