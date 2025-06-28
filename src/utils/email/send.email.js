import nodemailer from "nodemailer";

export const sendEmail=async( {to=[],cc=[],html="",bcc=[],text="",subject="job search app",attachments=[]}={})=>{
   

const transporter = nodemailer.createTransport({
 service:"gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

  
  const info = await transporter.sendMail({
    from: `"Job Search App" <${process.env.EMAIL}>`, // sender address
    to,cc,html,bcc,text,subject,attachments
  });

 

  console.log("Message sent: %s", info.messageId);
}