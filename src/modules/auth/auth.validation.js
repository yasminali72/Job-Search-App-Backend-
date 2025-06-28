import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const signup=joi.object().keys({
    firstName:generalFields.firstName.required(),
    lastName:generalFields.lastName.required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    conformationPassword:generalFields.confrimationPassword.required(),
    gender:generalFields.gender.required(),
    DOB:generalFields.birthYear.required(),
    mobileNumber:generalFields.mobileNumber.required()
}).required()

export const confirmEmail=joi.object().keys({
    email:generalFields.email.required(),
    code:generalFields.code.required()
}).required()
export const resendCode=joi.object().keys({
    email:generalFields.email.required(),
    type:joi.string().valid("confirmEmail","forgetPassword").required()
}).required()

export const login=joi.object().keys({
    email:generalFields.email.required(),
    password:generalFields.password.required()
})


export const forgetPasword=joi.object().keys({
    email:generalFields.email.required()
}).required()

export const verifyCode=joi.object().keys({
    email:generalFields.email.required(),
    code:generalFields.code.required()
}).required()

export const resetPassword=joi.object().keys({
    email:generalFields.email.required(),
    newPassword:generalFields.password.required(),
    conformationPassword:generalFields.confrimationPassword.valid(joi.ref("newPassword")).required()
}).required()
