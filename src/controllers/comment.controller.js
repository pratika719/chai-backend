import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query;

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"INvalid video id")
    }

    const aggregate=Comment.aggregate([
        {
            $match:{video:new mongoose.Types.ObjectId(videoId)}
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetailes",


            }
        },
        {
            $unwind:
                "$ownerDetailes"},
            

        
        {
            $project:{
                content:1,
                createdAt:1,
                "ownerDetailes.username":1,
                "ownerDetailes.avatar":1

            }
        },
        {
            $sort:{createdAt:-1}
        }
    ]);

    const options={
        page:parseInt(page),
        limit:parseInt(limit)
    };

    const comments=await Comment.aggregatePaginate(aggregate,options);

  return res
  .status(200)
  .json(new ApiResponse(200,comments,"commentsfetched succesfully"))
}
)
;
const addComment = asyncHandler(async (req, res) => {
  const {content}=req.body;
   const {videoId} = req.params;

    if(!content || content.trim()===""){
     throw new ApiError(400,"cannot post empty comment");
   }

     if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"INvalid video id")
    }
   

   const comment =await Comment.create({content,video:new mongoose.Types.ObjectId(videoId),owner:req.user._id});

   return res
   .status(201)
   .json(new ApiResponse(201,comment,"comment added succesfully"))

  



})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId}= req.params;
    const {content}=req.body


      if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  // 2️⃣ Validate content
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty");
  }

    
    const updatedComment= await Comment.findOneAndUpdate({
        owner:req.user._id,
        _id:commentId
        
    },
    { $set: { content } },{
        new:true
    }
);
  if (!updatedComment) {
    throw new ApiError(400,"updated comment not found");
  }


  return res.status(200).json(new ApiResponse(200,updateComment,"comment updated succesfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
     const {commentId}= req.params;

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

 const deletedcomment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user._id,
  });

    if (!deletedcomment) {
    throw new ApiError(404, "Comment not found or not authorized");
  }

    
   return res
   .status(201)
   .json(new ApiResponse(201,deletecomment,"comment deleted succesfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }