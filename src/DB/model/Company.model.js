import mongoose, { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      unique: [true, "name is exist"],
      min: 5,
      max: 50,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, "industry is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "address is required"],
      trim: true,
    },
    numberOfEmployees: {
      type: String,

      required: [true, "number Of Employees is required"],
      enum: [
        "1-10",
        "11-20",
        "21-50",
        "51-100",
        "101-500",
        "501-1000",
        "1001+",
      ]
    },
    companyEmail: {
      type: String,
      required: [true, "companyEmail is requird"],
      unique: [true, "companyEmail is exist"],
    },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Company must to linked a user"],
    },
    Logo: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: { secure_url: String, public_id: String },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    isDeleted :{
      type:Boolean,
      default:false
    },
    password:{type:String,
    required:true},
    OTPforApproved:String
  },
  { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}}
);
companySchema.virtual("jobs",{ref:"Job",localField:"_id",foreignField:"companyId"})
const companyModel = mongoose.models.Company || model("Company", companySchema);
export default companyModel;
