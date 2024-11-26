import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Fetch comments for the videoId, paginate results
    const comments = await Comment.find({ videoId })
        .skip((pageNumber - 1) * limitNumber) // Skip previous pages
        .limit(limitNumber) // Limit results per page
        .sort({ createdAt: -1 }); // Sort by newest comments first

    // Get total number of comments for the video
    const totalComments = await Comment.countDocuments({ videoId });

    res.status(200).json({
        success: true,
        data: comments,
        pagination: {
            total: totalComments,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalComments / limitNumber)
        }
    });
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming user information is available from authentication middleware

    // Ensure the comment text is provided
    if (!text) {
        res.status(400);
        throw new Error('Comment text is required');
    }

    // Check if the video exists (optional, depends on your structure)
    const video = await video.findById(videoId);
    if (!video) {
        res.status(404);
        throw new Error('Video not found');
    }

    // Create a new comment
    const comment = await Comment.create({
        videoId,
        userId,
        text,
        createdAt: Date.now(),
    });

    res.status(201).json({
        success: true,
        data: comment,
    });
})
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming user is authenticated and available in req.user

    // Ensure new comment text is provided
    if (!text) {
        res.status(400);
        throw new Error('Updated comment text is required');
    }

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('User not authorized to update this comment');
    }

    // Update the comment text
    comment.text = text;

    // Save the updated comment
    const updatedComment = await comment.save();

    res.status(200).json({
        success: true,
        data: updatedComment,
    });
})
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and available in req.user

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('User not authorized to delete this comment');
    }

    // Remove the comment from the database
    await comment.remove();

    res.status(200).json({
        success: true,
        message: 'Comment successfully deleted',
    });
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}