import { Router } from "express"
import * as jobServices from "./services/job.service.js"
import * as validators from "./job.validation.js"
import { validation } from "../../middleware/validation.middleware.js"
import { authentication } from "../../middleware/auth.middleware.js"
const router=Router()

router.post("/add",validation(validators.addJob),authentication(),jobServices.addJob)
router.patch("/update-job/:jobId",validation(validators.updateJob),authentication(),jobServices.updateJob)
router.delete("/delete-job/:jobId",validation(validators.updateJob),authentication(),jobServices.deleteJob)

router.get("/allJobs",jobServices.allJobs)


export default router