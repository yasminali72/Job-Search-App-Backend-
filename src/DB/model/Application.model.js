import mongoose, { Schema, model } from "mongoose";

const applicationSchema=new Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:[true,"job id is required"]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user id is required"]
    },
    userCV:{
        secure_url:{type: String,
            required:[true,"cv secure url is required"]
        },
      public_id:{type: String,
        required:[true,"cv public id is required"]
    } ,
     
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'viewed' , 'in consideration', 'rejected'],
        default:"pending"
    }
})

const applicationModel=mongoose.models.Application || model("Application",applicationSchema)
export default applicationModel