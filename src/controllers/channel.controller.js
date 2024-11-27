import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from ('express-async-handler');
import Video from ('../models/videoModel');
import Subscription from ('../models/subscriptionModel');
import Like from ('../models/likeModel');
import Channel from ('../models/channelModel');

// Get channel statistics: total videos, views, likes, subscribers
const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Find the channel by ID
    const channel = await Channel.findById(channelId);
    if (!channel) {
        res.status(404);
        throw new ApiError('Channel not found');
    }

    // Total number of videos for the channel
    const totalVideos = await Video.countDocuments({ channelId });

    // Total views across all videos for the channel
    const totalViews = await Video.aggregate([
        { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Total number of subscribers
    const totalSubscribers = await Subscription.countDocuments({ channelId });

    // Total likes across all videos in the channel
    const totalLikes = await Video.aggregate([
        { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse
                (
                    success, true,
                    data, {
                    totalVideos,
                    totalViews: totalViews[0]?.totalViews || 0,
                    totalSubscribers,
                    totalLikes: totalLikes[0]?.totalLikes || 0,
                },
                ));
});

module.exports = { getChannelStats };