import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const healthCheck = asyncHandler(async (req, res) => {
    return res
        .send(200)
        .json(new ApiResponse(200), {
            success: true,
            message: "OK",
        })

})

export {
    healthCheck
}