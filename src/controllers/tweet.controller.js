import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Channel } from "../models/channel.model.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

const createTweet = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Find the channel by ID (optional, you can remove this check if not needed)
    const channel = await Channel.findById(channelId);
    if (!channel) {
        throw new ApiError('Channel not found');
    }

    // Total number of videos
    const totalVideos = await Video.countDocuments({ channelId });

    // Total views across all videos in the channel
    const totalViews = await Video.aggregate([
        { $match: { channelId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    // Total number of subscribers
    const totalSubscribers = await Subscription.countDocuments({ channelId });

    // Total likes across all videos in the channel
    const totalLikes = await Like.countDocuments({ channelId });

    return res
        .status(200).json(new ApiResponse(200),{ 
            success: true,
            data: {
                totalVideos,
                totalViews: totalViews[0]?.totalViews || 0,
                totalSubscribers,
                totalLikes,
            },
        });

})
const getUserTweet = asyncHandler(async (req, res) => {

})
const deleteTweet = asyncHandler(async (req, res) => {

})
const updateTweet = asyncHandler(async (req, res) => {

})

export {
    createTweet,
    getUserTweet,
    deleteTweet,
    updateTweet
}