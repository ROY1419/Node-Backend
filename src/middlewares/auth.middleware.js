import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"



export const verifyJWT = asyncHandler(async (req, _, next) => {
    try{ 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized request" )
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoden?._id).select("-password -refreshToken")

        if (!User) {
            throw new ApiError(401, "Invaild Access Token")
        }
        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invaild Access Token")
    }
})