import multer from "multer";


export const fileValidations={
    image:["image/jpeg","image/png","image/gif"],

}
export const uploadCloudFile=(customPath="general",fileValidation=[])=>{
   
    const storage=multer.diskStorage({
       
    })

    function filterFile(req,file,cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null,true)
        }else{
            cb("in-valid file format",false)
        }
    }
    return multer({dest:"temPath",storage})
}