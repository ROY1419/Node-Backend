import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Subscription } from "../models/subscription.model";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const { userId } = req.body
    if (!isValidObjectId(channelId) || !isValidObjectId(userId)) {
        throw new ApiError("Invalid channelId or userId.", 400)
    }
    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError("User not found", 404)
    }
    // Check if the channel exists
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError("Channel not found.", 400)
    }
    // Check if the user is already subscribed to the channel
    const subscribe = await Subscription.create({ userId, channelId })
    if (subscribe) {
        // If the subscription exists, remove it (unsubscribe)
        await subscribe.remove()
        return res
            .status(200)
            .json(new ApiResponse(200, {
                success: true,
                data: subscribe
            }))
    }
    // If the subscription does not exist, create one (subscribe)
    await subscribe.create({ userId, channelId })
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            data: subscribe
        }))
})
const getUserChannelSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError("Invalid channelId.", 400)
    }
    const subscribe = await Subscription.find({ channelId }).populate("userId", "name email")
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            message: "Channel subscriptions retrieved successfully.",
            subscribe
        }))

})
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!isValidObjectId(userId)) {
        throw new ApiError("Invalid userId.", 400)
    }
    const subscribe = await Subscription.find({ userId: userId }).populate("channelId", "name email")
    return res
        .status(200)
        .json(new ApiResponse(200, {
            success: true,
            message: "Channel subscriptions retrieved successfully.",
            subscribe
        }));
});

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscription
}