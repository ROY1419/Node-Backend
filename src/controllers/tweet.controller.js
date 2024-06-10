import mongoose, {isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { Tweet } from "../models/tweet.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createTweet = asyncHandler(async ( req, res) => {

})
const getUserTweet = asyncHandler(async ( req, res) => {

})
const deleteTweet = asyncHandler(async ( req, res) => {

})
const updateTweet = asyncHandler(async ( req, res) => {

})

export{
    createTweet,
    getUserTweet,
    deleteTweet,
    updateTweet
}