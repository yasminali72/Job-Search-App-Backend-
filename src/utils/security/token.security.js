import jwt from "jsonwebtoken"
import userModel from "../../DB/model/User.model.js"
import companyModel from "../../DB/model/Company.model.js"

export const tokenTypes={access:"access",refresh:"refresh"}
export const decodedToken=async({authorization="",tokenType=tokenTypes.access,next={}})=>{

  
    const [bearer,token]=authorization?.split(" ")|| []
    if (!bearer  || !token) {
        return next (new Error("missing token",{cause:400}))
    }
let access_signature="";
let refresh_signature=""
    switch (bearer) {
        case "Admin":
            access_signature=process.env.ADMIN_ACCESS_TOKEN
            refresh_signature=process.env.ADMIN_REFRESH_TOKEN
            break;
    case"Bearer":
    access_signature=process.env.USER_ACCESS_TOKEN
    refresh_signature=process.env.USER_REFRESH_TOKEN
    break;
        default:
            break;
    }

    const decoded=verifyToken({token,signature:tokenType==tokenTypes.access?access_signature:refresh_signature})
    if (!decoded?.id) {
        return next (new Error("in-valid token payload",{cause:404}))
    }
    const user=await userModel.findOne({_id:decoded.id,isDeleted:false}) ||await companyModel.findOne({_id:decoded.id})
    if (!user) {
        return next (new Error("not registered account",{cause:404}))
    }
    if (user.changeCredentialTime?.getTime()>=decoded.iat*1000 ) {
        return next (new Error("in-valid login Cridentials",{cause:400}))
    
    }
return user
}
export const generateToken=({payload={},signature=process.env.USER_ACCESS_TOKEN,expiresIn=process.env.EXPIRESIN}={})=>{
    const token=jwt.sign(payload,signature,{expiresIn:parseInt(expiresIn)})
    return token
}

export const verifyToken=({token={},signature=process.env.USER_ACCESS_TOKEN}={})=>{
    const decoded=jwt.verify(token,signature )
    return decoded
}