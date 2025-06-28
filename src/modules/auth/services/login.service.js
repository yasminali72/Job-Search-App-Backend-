import { Error } from "mongoose"
import userModel, { providerTypes, roleTypes } from "../../../DB/model/User.model.js"
import { emailEvent } from "../../../utils/events/email.events.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import { sucessResponse } from "../../../utils/response/sucess.response.js"
import { compareHash, generateHash } from "../../../utils/security/hash.security.js"
import { decodedToken, generateToken, tokenTypes, verifyToken } from "../../../utils/security/token.security.js"
import jwt from "jsonwebtoken"
export const login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    const user=await userModel.findOne({email,provider:providerTypes.system})
    if (!user) {
        return next(new Error("in-valid data",{cause:404}))
    }
    if (user.isDeleted) {
      return next(new Error("Account is freezed"))
    }
    if (!user.isConfirmed) {
        return next(new Error("please confirm your email first",{cause:409}))
    }
    if (!compareHash({plainText:password,hashValue:user.password})) {
        return next(new Error("your password is not correct ",{cause:404}))
    
    }
    const access_token=generateToken({payload:{id:user._id},
        signature:user.role===roleTypes.Admin?process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN
        })

        const refresh_token=generateToken({payload:{id:user._id},
            signature:user.role===roleTypes.Admin?process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,expiresIn:604800
            })
    return sucessResponse({res,message:"Login",data:{access_token,refresh_token,role:user.role}})
    })

    export const loginWithGoogle = asyncHandler(async (req, res, next) => {
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
         
          }
      
          if (user.provider!==providerTypes.google) {
              return next(new Error("in-valid provider"));
          }
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
              expiresIn: 604800,
            });
            return sucessResponse({
              res,
              message: "Login",
              data: { access_token, refresh_token },
            });
        }
        return next(new Error("token is required"));
      });

    export const refreshToken=asyncHandler(async(req,res,next)=>{
        const {authorization}=req.headers
      const user=await decodedToken({authorization,tokenType:tokenTypes.refresh,next})
        const access_token=generateToken({payload:{id:user._id},
            signature:user.role===roleTypes.Admin?process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN
            })
            const refresh_token=generateToken({payload:{id:user._id},
                signature:user.role===roleTypes.Admin?process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,expiresIn:604800
                })
            return sucessResponse({res,data:{access_token,refresh_token}})
    
    })

    // forget password
export const forgetPassword=asyncHandler(async(req,res,next)=>{
    const {email}=req.body
    const user=await userModel.findOne({email,isDeleted:false})

if (user) {
    if (!user.isConfirmed) {
        return next(new Error("in-valid email"))
       }
       if (!user.isForgetPassword) {
        emailEvent.emit("sendOTP",{email,type:"forgetPassword",subject:"forget password",user})
       await userModel.findOneAndUpdate({email},{isForgetPassword:true})
       return sucessResponse({res,message:"code is sent"})
       
       }
       return next(new Error("code is send please check your email or click on resend code"))
}
return next(new Error("in-valid account"))
 })

//  verify code
 export const verifyCode=asyncHandler(async(req,res,next)=>{
const {email,code}=req.body
const user=await userModel.findOne({email})
if (user) {
if (!user.isverifyCode) {
 if (user.OTP[1]?.type=="forgetPassword") {
    if (compareHash({plainText:code,hashValue:user.OTP[1].code})) {
      await userModel.findOneAndUpdate({email},{isverifyCode:true})
      user.OTP[1].tryOfResendCode=5
      user.OTP[1].code=''
     await user.save()
       return sucessResponse({res,message:"code is verify"})
    }
    return next(new Error("code is expired"))
  }
  return next(new Error("code is expired"))
}
return next(new Error("code is verified"))

}
return next(new Error("in-valid account"))
 })
// reset password
 export const resetPassword=asyncHandler(async(req,res,next)=>{
const{email,newPassword,conformationPassword}=req.body;
const user=await userModel.findOne({email})
if (user) {
if (user.isverifyCode) {
 const hash=generateHash({plainText:newPassword})
 await userModel.findOneAndUpdate({email},{password:hash,changeCredentialTime:Date.now(),$unset:{isverifyCode:false,isForgetPassword:false}})
 return sucessResponse({res,message:"updated password is done"})
}
return next(new Error("verify code first"))
}
return next(new Error("invalid email"))
 })
