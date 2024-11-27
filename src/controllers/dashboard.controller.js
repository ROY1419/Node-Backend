import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js"


const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Find the channel by ID (optional, you can remove this check if not needed)
    const channel = await channel.findById(channelId);
    if (!channel) {
        res.status(404);
        throw new ('Channel not found');
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

    res.status(200).json({
        success: true,
        data: {
            totalVideos,
            totalViews: totalViews[0]?.totalViews || 0,
            totalSubscribers,
            totalLikes,
        },
    });

})

const getChannelVideos = asyncHandler(async (rreq, res) => {

})

export {
    getChannelStats,
    getChannelVideos
}