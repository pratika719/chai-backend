import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId=req.user._id;
    
         if(!mongoose.Types.ObjectId.isValid(videoId)){
            throw new ApiError(400,"INvalid video id")
        }

        const existinglike= await Like.findOne({video:mongoose.Types.ObjectId(videoId),likedBy:mongoose.Types.ObjectId(userId)})

        if(!existinglike){
           const like= await Like.create({video:mongoose.Types.ObjectId(videoId),likedBy:mongoose.Types.ObjectId(userId)})
           return res.status(200).json(new ApiResponse(200,like,"Like created"))
        }

        else{
            await Like.findOneAndDelete({video:mongoose.Types.ObjectId(videoId),likedBy:mongoose.Types.ObjectId(userId)})
        return res.status(200).json(new ApiResponse(200,like,"Like removed"))
        }



})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
  

    

    
    const userId=req.user._id;
    
         if(!mongoose.Types.ObjectId.isValid(commentId)){
            throw new ApiError(400,"INvalid video id")
        }

        const existinglike= await Like.findOne({comment:mongoose.Types.ObjectId(commentId),likedBy:mongoose.Types.ObjectId(userId)})

        if(!existinglike){
           const like= await Like.create({comment:mongoose.Types.ObjectId(commentId),likedBy:mongoose.Types.ObjectId(userId)})
           return res.status(200).json(new ApiResponse(200,like,"Like created"))
        }

        else{
            await Like.findOneAndDelete({comment:mongoose.Types.ObjectId(commentId),likedBy:mongoose.Types.ObjectId(userId)})
        return res.status(200).json(new ApiResponse(200,null,"Like removed"))
        }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    //TODO: toggle like on video
    const userId=req.user._id;
    
         if(!mongoose.Types.ObjectId.isValid(tweetId)){
            throw new ApiError(400,"INvalid video id")
        }

        const existinglike= await Like.findOne({tweet:mongoose.Types.ObjectId(tweetId),likedBy:mongoose.Types.ObjectId(userId)})

        if(!existinglike){
           const like= await Like.create({tweet:mongoose.Types.ObjectId(tweetId),likedBy:mongoose.Types.ObjectId(userId)})
           return res.status(200).json(new ApiResponse(200,like,"Like created"))
        }

        else{
            await Like.findOneAndDelete({tweet:mongoose.Types.ObjectId(tweetId),likedBy:mongoose.Types.ObjectId(userId)})
        return res.status(200).json(new ApiResponse(200,like,"Like removed"))
        }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId=req.user._id;
       const {page = 1, limit = 10} = req.query;

        const aggregate=Like.aggregate([
               {
                   $match:{likedBy:new mongoose.Types.ObjectId(userId)}
               },
               {
                   $lookup:{
                       from:"videos",
                       localField:"video",
                       foreignField:"_id",
                       as:"videoDetailes",
       
       
                   }
               },
               {
                   $unwind:
                       "$videoDetails"},
                   
       
               
               {
                   $project:{
                    
                       likedAt:1,
                       "videoDetailes.title":1,
                       "videoDetailes.duration":1,
                       "videoDetailes.views":1,
                       "videoDetailes.owner":1
       
                   }
               },
               {
                   $sort:{likedAt:-1}
               }
           ]);
const options={
        page:parseInt(page),
        limit:parseInt(limit)
    };

    const likedvideo =await Like.aggregatePaginate(aggregate,options);

     return res
      .status(200)
      .json(new ApiResponse(200,likedvideo,"liked videos fetched succesfully"))
    }


    //TODO: get all liked videos
)

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}