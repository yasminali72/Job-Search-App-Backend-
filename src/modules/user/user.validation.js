import { generalFields } from "../../middleware/validation.middleware.js";
import joi from "joi";

export const updateProfile = joi
  .object()
  .keys({
    mobileNumber: generalFields.mobileNumber,
    DOB: generalFields.birthYear,
    firstName: generalFields.firstName,
    lastName: generalFields.lastName,
    Gender: generalFields.gender,
  })
  .required();

export const  updatePassword=joi.object().keys({
    oldPassword:generalFields.password.required(),
    newPassword:generalFields.password.required(),
    confrimationPassword:generalFields.confrimationPassword.valid(joi.ref("newPassword")).required()
}).required()

export const shareProfile=joi.object().keys({
    userId:generalFields.id.required()
}).required()
export const unfreezeAccount=joi.object().keys({
  email:generalFields.email.required()
}).required()