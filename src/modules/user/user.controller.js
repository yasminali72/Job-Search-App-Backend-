import { Router } from "express"
import * as userServices from "./services/user.services.js"
import * as validators from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js"
import { authentication } from "../../middleware/auth.middleware.js"
import { fileValidations, uploadCloudFile } from "../../utils/multer/cloud.multer.js"
const router=Router()

router.get("/profile",authentication(),userServices.profile)

router.patch("/update-profile",validation(validators.updateProfile),authentication(),userServices.updateProfile)
router.get("/profile/:userId",validation(validators.shareProfile),authentication(),userServices.getUserProfile)
router.patch("/update-password",validation(validators.updatePassword),authentication(),userServices.updatePassword)

router.patch("/profile/upload-image",authentication(),uploadCloudFile(fileValidations.image).single("image"),userServices.uploadProfileImage)

router.patch("/profile/upload-image/cover",authentication(),uploadCloudFile(fileValidations.image).array("image"),userServices.uploadProfileCoverImage)

router.delete("/profile/delete-image",authentication(),uploadCloudFile(fileValidations.image).single("image"),userServices.deleteProfileImage)
router.delete("/profile/delete-image/cover",authentication(),uploadCloudFile(fileValidations.image).single("image"),userServices.deleteCoverImage)

router.delete("/profile",authentication(),userServices.deleteAccount)
router.patch("/unfreezeProfile",validation(validators.unfreezeAccount),userServices.unfreezeAccount)

export default router