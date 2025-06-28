npm i mongoose npm i dotenv npm i moment npm i joi npm i bcryptjs npm i crypto-js npm i nodemailer npm i nanoid npm i jsonwebtoken npm install google-auth-library --save npm i cors npm i multer npm i cloudinary ************regex password /^(?=.\d)(?=.[a-z])(?=.*[a-zA-Z]).{8,}$/ phone /^+?(1|20|44|49|91|971|966|33|34|39|86|81|55|27)\d{9}$/ **************DB collections 1 user 2 company 3 job 4 application

*************auth api 1 signup

check user email if it exist before or not
send OTP ( hash it) ⇒ ⚠(verify email in 10 min)
hash (bcrypt) password and encrypt mobileNumber
confirm OTP
check OTP expire date
check OTP type
check otp value
Sign In (only system provider)
Sign In using email and password
Return refresh (7d) token and access token (1h)
signup with google
Login with google
Send OTP for Forget password
Reset password =>forget,code,reset
check OTP (expire date, type and value)
reset password
Refresh token
**********user api

Update user account
Get login user account data
Get profile data for another user (share profile)
Update password
Upload Profile Pic
Upload Cover Pic
Delete Profile Pic 8.Delete Cover Pic
Soft delete account (freeze) company api register send email to createdby to verify register verify code login by company email update data by company owner soft delete by (owner or admin(createdby)) add hr get company (by login of company) get all companies get spcific company (by id) and all jobs get company by name and jobs *****job api note : owner email of company addjob (by owner or hr) update job (by owner) delete job (by hr to releted of company or owner ) get all jobs
