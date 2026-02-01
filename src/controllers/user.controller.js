import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import  {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponce.js";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const generateaccessandrefreshtokens= async (userId)=>{
    try{
        const user =  await User.findById(userId);
        const accesstoken= user.generateAccessToken();
        const refreshtoken= user.generateRefreshToken();
        user.refreshTokens.push(refreshtoken);
        await user.save(validateBeforeSave=false);
        return {accesstoken,refreshtoken};
    }
    catch(error){
        throw new ApiError(500,"token generation failed");
    }
}
const registerUser = asyncHandler(async (req, res, next) => {

    // Logic for registering a user goes here
    //get data from req.body
    const { fullname, email, username, password } = req.body;

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUser) {
        throw new ApiError(409, "User with given email or username already exists");
    }
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path
   // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path
}

    if (!avatarLocalPath) {
        
        throw new ApiError(400, "Avatar is required");

    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");

    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken ");

    if (!createdUser) {
        throw new ApiError(500, "someting went wrong while registering user");

    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )




});


const loginUser= asyncHandler(async (req,res)=>{
    //take data from req
    //check if user exist
    //validation  pass username
    //generate access token
    //gen refers token
    //send cookies

    const {email,username,password}=req.body;
    if (!username || !email){
        throw new ApiError(400,"username or password mot there");

    }

   const user = await User.findOne({
     $or:[{username},{email}]
    })
  
    if (!user){
        throw new ApiError(404,"user does not exist");

    }

    const isPasswordValid= await user.isPasswordCorrect(password);
    if (!isPasswordValid){
        throw new ApiError(401,"invalid password");
    }
    
    

     const {accesstoken,refreshtoken}= await generateaccessandrefreshtokens(user._id);

     const loggedInUser= await User.findById(user._id).select("-password -refreshTokens");

     const options={
        httpOnly:true,
        secure:true,


     }


     
     User.findById(user._id).select("-password -refreshTokens");

    return res.status(200).cookie("refreshToken",refreshtoken,options).cookie("accessToken",accesstoken,options).json(
        new ApiResponse(200,loggedInUser,"user logged in successfully")

    )





})

const logoutUser= asyncHandler(async (req,res,next)=>{  
    User.findByIdAndUpdate(req.user._id ,{
        $set: {refreshTokens:undefined}
    },
{new:true}) 


})

options={
        httpOnly:true,
        secure:true,


     }

     return res
     .status(200)
     .cookie("accessToken",options)
     .cookie("refreshToken",options)
     .json(
        new ApiResponse(
            200,
            {
                
            }
        )
     )

export { registerUser,loginUser,logoutUser}