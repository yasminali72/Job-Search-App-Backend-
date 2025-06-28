import { customAlphabet } from "nanoid";
import { EventEmitter } from "node:events";
import { generateHash } from "../security/hash.security.js";
import { sendEmail } from "../email/send.email.js";
import { verifyAccountTemplate } from "../templates/verifyAccount.template.js";
import companyModel from "../../DB/model/Company.model.js";

export const emailEvent=new EventEmitter()
emailEvent.on("sendOTP",async(data)=>{
const{email,type,subject,user}=data
const otp=customAlphabet("0123456789",4)()
const hahOTP=generateHash({plainText:otp})
const html=verifyAccountTemplate({code:otp})
user.OTP.push({type:type,code:hahOTP,tryOfResendCode:5,expiresIn:Date.now()})
await user.save()
console.log(user.OTP);
await sendEmail({to:email,subject ,html})
})

let i;
emailEvent.on("resendCode",async(data)=>{
    const{email,tryOfResendCode,user,type,subject}=data
    const otp=customAlphabet("0123456789",4)()
    const hahOTP=generateHash({plainText:otp})
    const html=verifyAccountTemplate({code:otp})


   switch (type) {
    case 'confirmEmail':
        i=0
        break;
   case 'forgetPassword':
    i=1
    break;
    default:
        break;
   }
   user.OTP[i].code=hahOTP
   user.OTP[i].tryOfResendCode=tryOfResendCode-1
   user.OTP[i].expiresIn=Date.now()
   await user.save()   

    await sendEmail({to:email,subject ,html})
    })

    emailEvent.on("OTPforApprovedByAdmin",async({email,id})=>{
        const otp=customAlphabet("0123456789",4)()
const hahOTP=generateHash({plainText:otp})
const html=verifyAccountTemplate({code:otp})
await companyModel.findByIdAndUpdate(id,{OTPforApproved:hahOTP})
await sendEmail({to:email,subject:"Approve Company",html})
    })