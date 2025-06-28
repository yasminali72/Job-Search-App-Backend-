import companyModel from "../../../DB/model/Company.model.js";
import jobModel from "../../../DB/model/Job.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";

// add job by owner or hr
export const addJob=asyncHandler(async(req,res,next)=>{
    const {_id}=req.user
    const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}=req.body
const company=await companyModel.findOne({$or:[{_id},{HRs:{$in:[_id]}}]})
if (!company) {
    return next(new Error("You are not authorized to add jobs for this company", { cause: 403 }));
  }   
if (company.isDeleted) {
        return next (new Error ("the company is deleted",{cause:403}))
    }

    const job =await jobModel.create({
        jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,companyId:company._id,addedBy:_id
    })

return sucessResponse({res,message:"job is created",data:{job}})
})
// update by owner
export const updateJob=asyncHandler(async(req,res,next)=>{
    const {_id}=req.user
    const {jobId}=req.params
    const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,closed}=req.body
const company=await companyModel.findById(_id)
if (!company) {
    return next(new Error("You are not authorized to update jobs for this company", { cause: 403 }));
}    
if (company.isDeleted) {
        return next (new Error ("the company is deleted"))
    }
let job=await jobModel.findById(jobId)
    if (!job) {
    return    next(new Error("job is not found",{cause:404}))
    }

     job =await jobModel.findByIdAndUpdate(jobId,{
        jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,companyId:company._id,addedBy:company._id,closed
    },{new:true})

return sucessResponse({res,message:"job is updated",data:{job}})
})

// delete job by hr related to company or owner 

export const deleteJob=asyncHandler(async(req,res,next)=>{
    const {_id}=req.user
    console.log(_id);
const{jobId}=req.params
    const job=await jobModel.findById(jobId)
    if (!job) {
        return next(new Error("job not found",{cause:404}))
    }

    const company=await companyModel.findById(job.companyId,{isDeleted:false})
   if (!company) {
    return next(new Error("copmany not found",{cause:404}))
   }
//    deleted by owner

   if (_id.toString()==company._id.toString()) {
    
   await jobModel.findByIdAndDelete(job._id)

   return sucessResponse({res,message:"job is deleted"})
   }

//    delete by hr
   if (!company.HRs.includes(_id)) {
    return next(new Error("You are not authorized to delete jobs for this company", { cause: 403 }));
   }

  

   await jobModel.findByIdAndDelete(job._id)

return sucessResponse({res,message:"job is deleted"})
})

// get all jobs

export const allJobs=asyncHandler(async(req,res,next)=>{
    const jobs=await jobModel.find()
   return sucessResponse({res,message:"all jobs",data:{jobs}})
})

