import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ActionLog } from "../models/actionLog.model.js";

const getRecentActions = asyncHandler(async (req, res) => {
    const actions = await ActionLog.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("user", "_id username email")
        .populate("task", "_id title");
    res.status(200).json(new ApiResponse(200, actions, "Recent actions fetched"));
});

export { getRecentActions }; 