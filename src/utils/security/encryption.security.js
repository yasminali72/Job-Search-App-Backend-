
import CryptoJS from "crypto-js";

export const generateEncryption=({plainText="",signature=process.env.ENCRYPTION_SIGNATURE}={})=>{

    const encrypt=CryptoJS.AES.encrypt(plainText,signature).toString()
    return encrypt
}

export const generatedecryption=({caipherText='',signature=process.env.ENCRYPTION_SIGNATURE}={})=>{

    const decoded=CryptoJS.AES.decrypt(caipherText,signature).toString(CryptoJS.enc.Utf8)
    return decoded
}