import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
 const  {content}=req.body
 const  owner=req.user._id;


 if(!content || content.trim()===""){
     throw new ApiError(400,"cannot post empty tweet");
   }

   const tweet= await  Tweet.create({content,owner})



   return res
   .status(201)
   .json(new ApiResponse(201,tweet,"tweet created succesfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
 const {page = 1, limit = 10} = req.query;
    const ownerId=req.user._id;

  

    const aggregate= Tweet.aggregate([{
        $match: {
        owner: new mongoose.Types.ObjectId(ownerId),
      }},
      {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"ownerDetailes",

        }

      },
      {
        $unwind:"$ownerDetailes"
      },
      {
        $project:{
            content:1,
            createdAt:1,
                "ownerDetailes.username":1,
                "ownerDetailes.avatar":1

        }
      }
      ,
      {
        $sort:{
            createdAt:-1
        }
      }
    ]);

     const options={
        page:parseInt(page),
        limit:parseInt(limit)
    };

    const tweets=await Tweet.aggregatePaginate(aggregate,options);


 return res
  .status(200)
  .json(new ApiResponse(200,tweets,"tweets fetched succesfully"))


})

const updateTweet = asyncHandler(async (req, res) => {
    const {content}=req.body;
    const {tweetId}=req.params;

     if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
      }

        if (!content || content.trim() === "") {
          throw new ApiError(400, "Content cannot be empty");
        }

        const UpdatedTweet= await Tweet.findOneAndUpdate({ owner:req.user._id,
        _id:tweetId},
    {$set:{content}},{
        new:true
    }

    )

    if (!UpdatedTweet) {
        throw new ApiError(400,"updated tweet not found");
      }


  return res.status(200).json(new ApiResponse(200,UpdatedTweet,"Tweet updated succesfully"))



})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
     const {content}=req.body;
    const {tweetId}=req.params;

   const deletedtweet= await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: req.user._id,
  });

    if (!deletedtweet) {
    throw new ApiError(404, "Comment not found or not authorized");
  }

  
  return res.status(200).json(new ApiResponse(200,UpdatedTweet,"Tweet deleted succesfully"))


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}