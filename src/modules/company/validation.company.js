import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signUpCompany = joi
  .object()
  .keys({
    companyEmail: generalFields.email.required(),
    companyName: joi.string().min(5).max(70).trim().required(),
    industry: joi.string().trim().required(),
    description: joi.string().trim().required(),
    address: joi.string().trim().required(),
    numberOfEmployees: joi
      .string()
      .valid("1-10", "11-20", "21-50", "51-100", "101-500", "501-1000", "1001+")
      .required(),
    createdBy: generalFields.email.required(),
    password:generalFields.password.required()
  })
  .required();

  export const approvedCompany=joi.object().keys({
    adminEmail:generalFields.email.required(),
    companyEmail:generalFields.email.required(),
    code:generalFields.code.required()
  }).required()

  export const loginCompany=joi.object().keys({
    companyEmail:generalFields.email.required(),
  password:generalFields.password.required()
  }).required()

  export const updateCompany= joi
  .object()
  .keys({
    companyEmail: generalFields.email,
    companyName: joi.string().min(5).max(70).trim(),
    industry: joi.string().trim(),
    description: joi.string().trim(),
    address: joi.string().trim(),
    numberOfEmployees: joi
      .string()
      .valid("1-10", "11-20", "21-50", "51-100", "101-500", "501-1000", "1001+")
      ,
    createdBy: generalFields.email,
    password:generalFields.password
  })
  .required();

  export const addHr=joi.object().keys({
    emailHr:generalFields.email.required()
  }).required()
  export const getJobsForSpecificCompany=joi.object().keys({
    companyId:generalFields.id.required()
  }).required()
  export const getCompanyByName=joi.object().keys({
    companyName:joi.string().required()
  }).required()