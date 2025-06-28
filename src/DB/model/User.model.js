import mongoose, { Schema, model } from "mongoose";
import moment from "moment";

export const roleTypes={Admin:"Admin",User:"User"}
export const providerTypes={google:"Google",system:"System"}
export const genderTypes={male:"Male",female:"Female"}
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is required"],
      
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "LastName is required"],
     
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email exist"],
    },
    password: {
      type: String,
      required: (data)=>{
        console.log(data);
        return data?.provider === providerTypes.google? false :true
      },
    },
    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default:providerTypes.system
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default:genderTypes.male,
    },
    DOB: {
      type: Date,
      // required: [true, "Date of Birth is required"],
      validate: {
        validator: function (value) {
          const now = moment().startOf("day");
          const dob = moment(value).startOf("day");
          const age = now.diff(dob, "years");

          return dob.isBefore(now) && age >= 18;
        },
        message:
          "Date of Birth must be in the past and user must be at least 18 years old.",
      },
    },
    mobileNumber: {
      type: String,
      // required: [true, "mobileNumber  is required"],
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default:roleTypes.User
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt:Date,
    isDeleted:{
      type:Boolean,
      default:false
    },
    bannedAt: Date,
    updatedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      default:null
    },
    changeCredentialTime:Date,
    profilePic: {
      secure_url: String,
      public_id:String
    },
    coverPic:[{
      secure_url:String,
      public_id:String
    }],
    OTP: [{
      code:String,
      type:{
type:String,
enum:["confirmEmail","forgetPassword"]
      },
      tryOfResendCode:Number,
      expiresIn:Date,
      
    }],
    isForgetPassword:{type:Boolean,
      default:false},
      isverifyCode:{type:Boolean,
        default:false}
  },
  { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}}
);

userSchema.virtual("userName").get(function () {
  if (!this.firstName || !this.lastName) return "";
  return `${this.firstName} ${this.lastName}`.toLowerCase();
});

const userModel = mongoose.models.User || model("User", userSchema);

export default userModel;
