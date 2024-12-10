import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    try {
        // Parse query filters
        const filter = {};
        if (query) {
            filter.title = { $regex: query, $options: 'i' }; // Case-insensitive search for titles
        }
        if (userId) {
            filter.userId = userId; // Filter by user ID if provided
        }

        // Parse sorting
        const sort = {};
        sort[sortBy] = sortType === 'desc' ? -1 : 1;

        // Pagination
        const skip = (page - 1) * limit;

        // Fetch videos from the database
        const videos = await Video.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Count total documents for pagination info
        const total = await Video.countDocuments(filter);

        // Return response
        res.status(200).json({
            success: true,
            data: videos,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch videos',
            error: error.message,
        });
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    try {
        // Validate request body
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Title and description are required',
            });
        }

        // Check if a video file is provided
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided',
            });
        }

        // Upload video to Cloudinary
        const videoUploadResponse = await uploadOnCloudinary.uploader.upload(req.file.path, {
            resource_type: 'video', // Specify resource type
            folder: 'videos', // Optional: Folder to organize uploads
        });

        // Create video in the database
        const newVideo = await Video.create({
            title,
            description,
            videoUrl: videoUploadResponse.secure_url,
            publicId: videoUploadResponse.public_id,
            userId: req.user.id, // Assuming user authentication is in place
        });

        // Respond with the created video
        res.status(201).json({
            success: true,
            message: 'Video published successfully',
            data: newVideo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to publish video',
            error: error.message,
        });
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    try {
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
            });
        }

        res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch video',
            error: error.message,
        });
    }

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description, thumbnail } = req.body;

    try {
        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { title, description, thumbnail },
            { new: true, runValidators: true }
        );


        if (!updatedVideo) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Video updated successfully',
            data: updatedVideo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update video',
            error: error.message,
        });
    }


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    try {
        const deletedVideo = await Video.findByIdAndDelete(videoId);

        if (!deletedVideo) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
            });
        }

        // If you're using Cloudinary and need to delete the video there:
        await cloudinary.uploader.destroy(deletedVideo.publicId, { resource_type: 'video' });

        res.status(200).json({
            success: true,
            message: 'Video deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete video',
            error: error.message,
        });
    }

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    try {
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
            });
        }

        // Toggle the publish status
        video.isPublished = !video.isPublished;
        await video.save();

        res.status(200).json({
            success: true,
            message: `Video publish status updated to ${video.isPublished}`,
            data: video,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle publish status',
            error: error.message,
        });
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}