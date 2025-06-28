import companyModel from "../../../DB/model/Company.model.js";
import jobModel from "../../../DB/model/Job.model.js";
import userModel, { roleTypes } from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.events.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import { generateToken } from "../../../utils/security/token.security.js";

// register
export const signUpCompany=asyncHandler(async(req,res,next)=>{

const {companyEmail,numberOfEmployees,address,industry,description,companyName,createdBy,password}=req.body
let company=await companyModel.findOne({companyEmail}) ||await companyModel.findOne({companyName})

if (company) {
    return next (new Error("this company is exists"))
}
const admin=await userModel.findOne({email:createdBy})
if (!admin) {
    return next(new Error("The admin of this company does not exist",{cause:404}))
}
company =await companyModel.create({
    companyEmail,numberOfEmployees,address,industry,description,companyName,CreatedBy:admin._id,password:generateHash({plainText:password})
})
await userModel.findByIdAndUpdate(admin._id,{role:roleTypes.Admin})
company=await companyModel.findById(company._id).populate("CreatedBy","email role")
emailEvent.emit("OTPforApprovedByAdmin",{
    email:createdBy,id:company._id
})
return sucessResponse({res,message:"company is created scussfully",data:company})

})

export const approvedCompany=asyncHandler(async(req,res,next)=>{
    const {code,adminEmail,companyEmail}=req.body
    const admin=await userModel.findOne({email:adminEmail,role:roleTypes.Admin})
    if (!admin) {
        return next(new Error("Not authorized as an admin"));
    }
    const company=await companyModel.findOne({companyEmail})
    if (!company) {
        return next(new Error("company is not existed"))
    }
    if (company.approvedByAdmin) {
        return next(new Error("company is approved"))
    }
    if (!compareHash({plainText:code,hashValue:company.OTPforApproved})) {
        return next(new Error("code is not corrected"))

    }
    await companyModel.findByIdAndUpdate(company._id,{approvedByAdmin:true,$unset:{OTPforApproved:""}})
    return sucessResponse({res,message:"Company approval completed successfully"})
})

export const login=asyncHandler(async(req,res,next)=>{
    const {password,companyEmail}=req.body
   const company=await companyModel.findOne({companyEmail})
   if (!company) {
    return next(new Error("company is not exist"))
   }
   if (company.isDeleted) {
    return next(new Error("account of company is deleted "))
   }
   if (!company?.approvedByAdmin) {
    return next (new Error("company is not approved"))
   }
   if (!compareHash({plainText:password,hashValue:company.password})) {
    return next(new Error("password not correct"))
   }

   const access_token=generateToken({payload:{id:company._id},
    signature:process.env.ADMIN_ACCESS_TOKEN 
    })

    const refresh_token=generateToken({payload:{id:company._id},
        signature:process.env.ADMIN_REFRESH_TOKEN ,expiresIn:604800
        })
   return sucessResponse({res,message:"login",data:{access_token,refresh_token}})
})
// get profile company
export const getCompany=asyncHandler(async(req,res,next)=>{
const company=req.user
    return sucessResponse({res,message:"company",data:{company}})
})
// get all companies
export const getAllCompanies=asyncHandler(async(req,res,next)=>{
    const companies=await companyModel.find()
    return sucessResponse({res,message:"All companies retrieved successfully",data:{companies}})
})
// update company
export const updateCompany=asyncHandler(async(req,res,next)=>{
    const {_id}=req.user
    const {numberOfEmployees,address,industry,description,companyName}=req.body
const company=await companyModel.findByIdAndUpdate(_id,{numberOfEmployees,address,industry,description,companyName},{new:true})

return sucessResponse({res,message:"updated",data:{company}})
})

// add hr to company by owner  or admin
export const addHr=asyncHandler(async(req,res,next)=>{

    const{_id}=req.user

    const {emailHr}=req.body

    let company=await companyModel.findById(_id) ||await companyModel.findOne({CreatedBy:_id})
    if (!company) {
        return next(new Error("Company not found"))
    }
    const userHr=await userModel.findOne({email:emailHr})
    if (!userHr) {
        return next(new Error("hr not found , first register as user",{cause:404}))
    }
    if (company.HRs.includes(userHr._id)) {
        return next(new Error("HR already added to this company", { cause: 400 }))
    }

   company= await companyModel.findByIdAndUpdate(_id,{$push:{HRs:userHr._id}},{new:true}).populate("HRs","email role")

    sucessResponse({res,message:"added hr successfully",data:{company}})
})

// soft delete
export const deleteCompany=asyncHandler(async(req,res,next)=>{
    const{_id}=req.user
    const company=await companyModel.findByIdAndUpdate(_id,{isDeleted:true,changeCredentialTime:Date.now()},{new:true}) || await companyModel.findOneAndUpdate({CreatedBy:_id},{isDeleted:true,changeCredentialTime:Date.now()},{new:true})
if (!company) {
    return next(new Error("company is not exist"))
}

return sucessResponse({res,message:"account of comany is deleted",data:{company}})

})

// get  specific commpany by company id and all jobs

export const allJobsForSpecificCommpany=asyncHandler(async(req,res,next)=>{
    const{companyId}=req.params
    const company=await companyModel.findOne({_id:companyId,isDeleted:false}).populate("jobs")
    console.log(company);
    if (!company) {
        return next(new Error("company not found",{cause:404}))
    }
    if (company.jobs.length==0) {
        return sucessResponse({res,message:"No jobs for this company",data:{company,lengthOfJobs:company.jobs.length}})
    }
   return sucessResponse({res,message:"all jobs",data:{company,lengthOfJobs:company.jobs.length}})
})
// get Company By Name and jobs
export const getCompanyByName=asyncHandler(async(req,res,next)=>{
const{companyName}=req.params
const company=await companyModel.findOne({companyName,isDeleted:false}).populate("jobs")
if (!company) {
    return next(new Error("compnay not found",{cause:404}))
}
if (company.jobs.length==0) {
    return sucessResponse({res,message:"No jobs for this company",data:{company,lengthOfJobs:company.jobs.length}})
}

return sucessResponse({res,message:"the company is relatived",data:{company,lengthOfJobs:company.jobs.length}})

})