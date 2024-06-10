import mongoose, {isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Subscription } from "../models/subscription.model";

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

})
const getUserChannelSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

})
const getSubscribedChannels  = asyncHandler(async (req, res) => {

})

export{
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscription
}