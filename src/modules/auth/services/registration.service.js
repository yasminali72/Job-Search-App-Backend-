import userModel, { providerTypes, roleTypes } from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.events.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";
import { generateEncryption, generatedecryption } from "../../../utils/security/encryption.security.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import jwt from "jsonwebtoken"
import { generateToken } from "../../../utils/security/token.security.js";
import * as dbServices from "../../../DB/db.services.js"
// sign up
export const signup=asyncHandler(async(req,res,next)=>{
const {firstName,lastName,email,mobileNumber,gender,password,birthYear}=req.body

if (await userModel.findOne({email})) {
   return next(new Error("email exists"))
}

const user=await dbServices.create({model:userModel,data:{email,firstName,lastName,mobileNumber:generateEncryption({plainText:mobileNumber}),password:generateHash({plainText:password}),gender,DOB:birthYear}})
emailEvent.emit("sendOTP",{email,type:"confirmEmail",subject:"confirm email",user})
return res.status(201).json({message:"signup",data:{user}})
})
// sign up with google
export const signupWithGoogle = asyncHandler(async (req, res, next) => {
   const { token } = req.body;
 
   if (token) {
     const payload = jwt.decode(token);
     console.log(payload);
     if (!payload?.email_verified) {
       return next(new Error("in-valid account"));
     }
     let user = await userModel.findOne({ email: payload.email });
     if (!user) {
      user= await userModel.create({
         firstName: payload.given_name,
         lastName: payload.family_name,
         email: payload.email,
         profilePic: payload.image,
         provider: providerTypes.google,
        
       });
       const access_token = generateToken({
         payload: { id: user._id },
         signature:
           user.role === roleTypes.Admin
             ? process.env.ADMIN_ACCESS_TOKEN
             : process.env.USER_ACCESS_TOKEN,
       });
       const refresh_token = generateToken({
         payload: { id: user._id },
         signature:
           user.role === roleTypes.Admin
             ? process.env.ADMIN_REFRESH_TOKEN
             : process.env.USER_REFRESH_TOKEN,
         expiresIn: 31536000,
       });
       return sucessResponse({
         res,
         message: "signup is done"
        ,data:{access_token,refresh_token}
       });
    
     }
 
   
   return next(new Error("account is registered before"))
      
   }
   return next(new Error("token is required"));
 });
// confirm email
export const confirmEmail = asyncHandler(async(req, res, next) => {
  
   const {code,email}=req.body
   const user=await userModel.findOne({email})
   const now = new Date();
   const expiresIn = user?.OTP[0]?.expiresIn || new Date(0); // في أول مرة يكون 0
   const timeDifference = (now - expiresIn) / (1000 * 60); // تحويل الفرق إلى دقائق
   if (!user) {
     return next(new Error("in-valid account",{cause:404}))
 
   }
   if (user.isConfirmed) {
     return next(new Error("account is already verified",{cause:409}))
   }
if (user.OTP[0].type==="confirmEmail") {
    
   if (!compareHash({plainText:code,hashValue:user.OTP[0].code})) {
      return next(new Error("in-valid code",{cause:400}))
    }
   if (timeDifference<=10) {
   user.isConfirmed=true
   user.OTP[0].tryOfResendCode=5
   user.OTP[0].code=""
  await user.save()
    return sucessResponse({res,message:"account is verify"})
   }
}
 return next(new Error("code is expired "))
 }) 
 
// resend code
 export const resendCode=asyncHandler(async(req,res,next)=>{
   const {email}=req.body
   const {type}=req.query
   const user=await userModel.findOne({email})

   const now = new Date();
   
   if (user) {
      console.log(user);
  if (type=="confirmEmail") {
   const expiresIn = user?.OTP[0]?.expiresIn || new Date(0); 
   const timeDifference = (now - expiresIn) / (1000 * 60); 
   if (!user.isConfirmed) {
      if (timeDifference>2) {
        if (user.OTP[0].tryOfResendCode>0) {
          emailEvent.emit("resendCode",{email,tryOfResendCode:user.OTP[0].tryOfResendCode,user,type,subject:"confirm Email"})
          
      return sucessResponse({res,message:"code is sent"})
        }

        if (user.OTP[0].tryOfResendCode==0&&timeDifference>=5) {
         emailEvent.emit("resendCode",{email,tryOfResendCode:6,user,type,subject:"confirm Email"})
          
         return sucessResponse({res,message:"code is sent"})
        }
        return next(new Error(`Please wait ${Math.ceil(5 - timeDifference)} minute(s) before retrying`, { cause: 429 }));

       }
      
       return next(new Error(`Please wait ${Math.ceil(2 - timeDifference)} minute(s) before retrying`, { cause: 429 }));
      
        
    }
    return next(new Error("account is already verified",{cause:400}))
  }

  if (type=="forgetPassword") {
   const expiresIn = user?.OTP[1]?.expiresIn || new Date(0); 
   const timeDifference = (now - expiresIn) / (1000 * 60); 
   if(user.isConfirmed){
      if (user.isForgetPassword) {
         if (timeDifference>2) {
            if (user.OTP[1]?.tryOfResendCode>0) {
              emailEvent.emit("resendCode",{email,tryOfResendCode:user.OTP[1]?.tryOfResendCode,user,type,subject:"forget Password"})
              
          return sucessResponse({res,message:"code is sent"})
            }
   
            if (user.OTP[1].tryOfResendCode==0&&timeDifference>=5) {
               emailEvent.emit("resendCode",{email,tryOfResendCode:6,user,type,subject:"confirm Email"})
                
               return sucessResponse({res,message:"code is sent"})
              }
              return next(new Error(`Please wait ${Math.ceil(5 - timeDifference)} minute(s) before retrying`, { cause: 429 }));
                 }
          
           return next(new Error(`Please wait ${Math.ceil(2 - timeDifference)} minute(s) before retrying`, { cause: 429 }));
          
   
      }

      return next(new Error("send request of forgetPassword ,first"))
   }
   return next (new Error("your email is not confrimed , please confirm first "))
  }
   }

   return next(new Error("in-valid account",{cause:404}))
   })












