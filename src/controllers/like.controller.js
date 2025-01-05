import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model";
import { Comment } from "../models/comment.model";
import { Video } from "../models/video.model";
import { asyncHandler } from "../utils/asyncHandler";

const toggleVideoLike = asyncHandler(async(req, res) => {
    const { videoId } = req.params;
    const userId = req.user.id; // Assume `req.user` is populated via authentication middleware

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).json({ message: "Video not found" });
    }

    const isLiked = video.likes.includes(userId);
    if (isLiked) {
        video.likes.pull(userId); // Remove like
    } else {
        video.likes.push(userId); // Add like
    }
    await video.save();

    res.status(200).json({ message: isLiked ? "Like removed" : "Liked", video });
});
const toggleCommentLike = asyncHandler(async(req, res) => {
    const {commentId} = req.params
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    const isLiked = comment.likes.includes(userId);
    if (isLiked) {
        comment.likes.pull(userId); // Remove like
    } else {
        comment.likes.push(userId); // Add like
    }
    await comment.save();

    res.status(200).json({ message: isLiked ? "Like removed" : "Liked", comment });


})
const toggleTweetLike = asyncHandler(async(req, res) => {
    const {tweetId} = req.params
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        return res.status(400).json({ message: "Invalid tweet ID" });
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        return res.status(404).json({ message: "Tweet not found" });
    }

    const isLiked = tweet.likes.includes(userId);
    if (isLiked) {
        tweet.likes.pull(userId); // Remove like
    } else {
        tweet.likes.push(userId); // Add like
    }
    await tweet.save();

    res.status(200).json({ message: isLiked ? "Like removed" : "Liked", tweet });
})
const getLikedVideos = asyncHandler(async(req, res) => {
    const userId = req.user.id;

    const likedVideos = await Video.find({ likes: userId }).select("-__v");
    if (!likedVideos.length) {
        return res.status(404).json({ message: "No liked videos found" });
    }

    res.status(200).json({ likedVideos });
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}