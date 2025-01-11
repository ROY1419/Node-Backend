import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Channel } from "../models/channel.model.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

// Create a tweet with channel statistics
const createTweet = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError("Invalid channelId.", 400)
    }
    // Find the channel by ID (optional, you can remove this check if not needed)
    const channel = await Channel.findById(channelId);
    if (!channel) {
        throw new ApiError('Channel not found');
    }
    // Aggregate statistics for the channel
    cont [totalViews,totalVideos,totalLikes,totalSubscribers] = Promise.all
    ([
        // Total number of videos
        Video.countDocuments({ channelId }),
        // Total views across all videos in the channel
        Video.aggregate([
            { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]),
        // Total number of subscriber
        Subscription.countDocuments({ channelId }),
        // Total likes across all videos in the channel
        Like.countDocuments({ channelId }),
    ])
    const tweetData ={
        channelId,
        totalVideos,
        totalViews: totalViews[0]?.totalViews || 0,
        totalSubscribers,
        totalLikes
    }
    const tweet = await Tweet.create(tweetData)
    return res
        .status(200).json(new ApiResponse(200),
        "Tweet created successfully.", tweet);
})
// Get user-specific tweets
const getUserTweet = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId.")
    }
    const tweets = await Tweet.find({userId}).populate("channelId", " name" )
    return res
        .status(200).json(new ApiResponse(200),{ 
            success: true,
            message: "User tweets retrieved successfully.",
        }, tweets);
})
// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId.")
    }
    const tweets = await Tweet.findByIdAndDelete({tweetId})
    if(!tweets){
        throw new ApiError(400, "Tweet not found.")
    }
    return res
        .status(200).json(new ApiResponse(200),{ 
            success: true,
            message: "User tweets retrieved successfully.",
        });
})
// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const {totalViews, totalVideos, totalLikes, totalSubscribers} = req.body;
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId.")
    }
    const tweets = await Tweet.findByIdAndUpdate({tweetId}, req.body)
    if(!tweets){
        throw new ApiError(400, "Tweet not found.")
    }
    // Update only fields provided in the request
    if(totalViews !== undefined) tweets.totalViews = totalViews;
    if(totalVideos !== undefined) tweets.totalVideos = totalVideos;
    if(totalSubscribers !== undefined) tweets.totalSubscribers = totalSubscribers;
    if(totalLikes !== undefined) tweets.totalLikes = totalLikes;
    await tweets.save()

    return res
        .status(200).json(new ApiResponse(200),{ 
            success: true,
            message: "Tweet updated successfully.",
        }, tweets);
})

export {
    createTweet,
    getUserTweet,
    deleteTweet,
    updateTweet
}