import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.events.js";
import { cloud } from "../../../utils/multer/cloudinary.multer.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { sucessResponse } from "../../../utils/response/sucess.response.js";
import {
  generateEncryption,
  generatedecryption,
} from "../../../utils/security/encryption.security.js";
import {
  compareHash,
  generateHash,
} from "../../../utils/security/hash.security.js";

export const profile = asyncHandler(async (req, res, next) => {
  req.user.mobileNumber = generatedecryption({
    caipherText: req.user.mobileNumber,
  });
  return sucessResponse({ res, message: "Profile", data: { user: req.user } });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { mobileNumber, DOB, firstName, lastName, Gender } = req.body;

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      mobileNumber: mobileNumber
        ? generateEncryption({ plainText: mobileNumber })
        : req.user.mobileNumber,
      DOB,
      firstName,
      lastName,
      Gender,
    },
    { new: true }
  );
  return sucessResponse({
    res,
    message: "updated your profile is done",
  });
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId == req.user._id.toString()) {
    const user = req.user;
    return sucessResponse({ res, data: user });
  }
  const user = await userModel
    .findOne({ _id: userId, isDeleted: false })
    .select(`userName firstName lastName  mobileNumber profilePic coverPic`);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  console.log(user);
  return sucessResponse({
    res,
    data: {
      userName: user.userName,
      mobileNumber: generatedecryption({ caipherText: user.mobileNumber }),
      profilePic: user.profilePic,
      coverPic: user.coverPic,
    },
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confrimationPassword } = req.body;
  const user = await userModel.findById(req.user._id);

  if (!compareHash({ plainText: oldPassword, hashValue: user.password })) {
    return next(new Error("old password is not correct"));
  }
  await userModel.findOneAndUpdate(
    { _id: user._id },
    {
      password: generateHash({ plainText: newPassword }),
      changeCredentialTime: Date.now(),
    }
  );
  return sucessResponse({ res, message: "password is updated" });
});

export const uploadProfileImage = asyncHandler(async (req, res, next) => {
  const {secure_url,public_id}=await cloud.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/user/${req.user._id}/profile`})
const user=  await userModel.findByIdAndUpdate(req.user._id, {
    profilePic: { secure_url ,public_id},
  });
  if (user.profilePic?.public_id) {
    await cloud.uploader.destroy(user.profilePic.public_id)
  }
  return sucessResponse({
    res,
    message: "upload profile image is done",
    data: {  user },
  });
});
export const uploadProfileCoverImage = asyncHandler(async (req, res, next) => {

  let images=[...req.user.coverPic]
  for (const file of req.files) {
    const {secure_url,public_id}=await cloud.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/user/${req.user._id}/profile/cover`})
images.push({secure_url,public_id})
  }
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { coverPic: images },{new:true}
  );
  return sucessResponse({
    res,
    message: "upload profile cover image is done",
    data: { user },
  });
});
export const deleteProfileImage = asyncHandler(async (req, res, next) => {
 await cloud.uploader.destroy(req.user.profilePic?.public_id)
 const user= await userModel.findByIdAndUpdate(req.user._id, {
    $unset: { profilePic: "" }
  });
  return sucessResponse({
    res,
    message: "delete profile image is done",
    data: { user },
  });
});
export const deleteCoverImage = asyncHandler(async (req, res, next) => {
  const {public_id}=req.query
  await cloud.uploader.destroy(public_id)
const user=  await userModel.findOneAndUpdate(req.user._id, { $pull: { coverPic: {public_id} } },{new:true});
  return sucessResponse({
    res,
    message:"Cover image deleted successfully",
    data: { user },
  });
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { isDeleted: true, changeCredentialTime: Date.now(),deletedAt:Date.now() },
    { new: true }
  );
  return sucessResponse({ res, message: "Account is freezed" });
});

export const unfreezeAccount = asyncHandler(async (req, res, next) => {
 const {email} =req.body
  const user = await userModel.findOneAndUpdate(
    {
      email
    },
    { isDeleted: false }
  );
  if (!user) {
    return next(new Error("email is not registered before"));
  }
  return sucessResponse({ res, message: "Account is Active Now" });
});
