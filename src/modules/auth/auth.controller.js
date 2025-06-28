
import { Router } from 'express'
import * as registrationService from './services/registration.service.js';
import * as validators from "./auth.validation.js"
import { validation } from '../../middleware/validation.middleware.js';
import * as loginService from './services/login.service.js';
const router = Router();


router.post("/signup",validation(validators.signup),registrationService.signup)
router.post("/login",validation(validators.login),loginService.login)
router.post("/loginWithGoogle", loginService.loginWithGoogle)
router.post("/signUpWithGoogle",registrationService.signupWithGoogle)


router.patch("/confirm-email",validation(validators.confirmEmail),registrationService.confirmEmail)
router.patch("/resend-code",validation(validators.resendCode),registrationService.resendCode)

router.patch("/forget-password",validation(validators.forgetPasword),loginService.forgetPassword)
router.patch("/verify-code",validation(validators.verifyCode),loginService.verifyCode)
router.patch("/reset-password",validation(validators.resetPassword),loginService.resetPassword)

router.get("/refresh-token", loginService.refreshToken)









export default router