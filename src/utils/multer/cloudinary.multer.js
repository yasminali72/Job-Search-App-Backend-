import path from "node:path"
import * as dotenv from "dotenv"
dotenv.config(
    {path:path.resolve('./src/config/.env.dev')}
)
import cloudinary from "cloudinary"

cloudinary.v2.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
    secure:true
})

export const cloud=cloudinary.v2