import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
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
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: comments,
            pagination: {
                total: totalComments,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalComments / limitNumber)
            }
        }))
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming user information is available from authentication middleware

    // Ensure the comment text is provided
    if (!text) {
        throw new ApiError('Comment text is required');
    }

    // Check if the video exists (optional, depends on your structure)
    const video = await video.findById(videoId);
    if (!video) {
        throw new ApiError('Video not found');
    }

    // Create a new comment
    const comment = await Comment.create({
        videoId,
        userId,
        text,
        createdAt: Date.now(),
    });
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: comment,
        }))
})
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // Assuming user is authenticated and available in req.user

    // Ensure new comment text is provided
    if (!text) {
        throw new Error('Updated comment text is required');
    }

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
        throw new Error('User not authorized to update this comment');
    }

    // Update the comment text
    comment.text = text;

    // Save the updated comment
    const updatedComment = await comment.save();
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: updatedComment,
        }))
})
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and available in req.user

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new Error('Comment not found');
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()){
        throw new Error('User not authorized to delete this comment');
    }

    // Remove the comment from the database
    await comment.remove();
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            message: 'Comment successfully deleted',
        }))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}