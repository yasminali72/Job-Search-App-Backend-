import { Router } from "express"
import * as companyServices from "./services/company.service.js"
import { validation } from "../../middleware/validation.middleware.js"
import * as validators from "./validation.company.js"
import { authentication } from "../../middleware/auth.middleware.js"
 const router=Router()


 router.post("/signup",validation(validators.signUpCompany),companyServices.signUpCompany)
 router.patch("/approve",validation(validators.approvedCompany),companyServices.approvedCompany)
 router.post("/login",validation(validators.loginCompany),companyServices.login)
 router.get("/companyProfile",authentication(),companyServices.getCompany)
 router.patch("/update-company",validation(validators.updateCompany),authentication(),companyServices.updateCompany)
 router.delete("/company",authentication(),companyServices.deleteCompany)
router.patch("/addHr",validation(validators.addHr),authentication(),companyServices.addHr)
router.get("/Companies",companyServices.getAllCompanies)
router.get("/companyId/:companyId",validation(validators.getJobsForSpecificCompany),companyServices.allJobsForSpecificCommpany)
router.get("/companyName/:companyName",validation(validators.getCompanyByName),companyServices.getCompanyByName)



 export default router