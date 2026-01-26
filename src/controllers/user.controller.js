import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {User} from "../models/user.model.js";
import {uploadOnCoudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponce.js";

const registeterUser=asyncHandler(async(req,res,next)=>{

// Logic for registering a user goes here
 //get data from req.body
    const { fullname, email, username,password } = req.body;

if([fullname,email,username,password].some((field)=>field?.trim()==="")) {
throw new ApiError(400,"All fields are required");
}

const existedUser = await User.findOne({ $or: [{ email }, { username }] });
if (existedUser) {
    throw new ApiError(409, "User with given email or username already exists");
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required");

}

const avatar = await uploadOnCoudinary(avatarLocalPath)
const coverImage = await uploadOnCoudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"Avatar file is required");

}

const user= await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()

});

 const createdUser =  await User.findById(user._id).select("-password -refreshToken ");

 if(!createdUser){
    throw new ApiError(500,"someting went wrong while registering user");

 }

 return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
 )




});

export {registeterUser};