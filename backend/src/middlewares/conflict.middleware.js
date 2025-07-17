import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";

export const checkTaskConflict = async (req, res, next) => {
    const { taskId } = req.params;
    const { clientUpdatedAt } = req.body;
    if (!taskId || !clientUpdatedAt) return next();
    const task = await Task.findById(taskId);
    if (!task) return next();
    if (new Date(task.updatedAt) > new Date(clientUpdatedAt)) {
        return next(new ApiError(409, "Task has been updated by another user. Please resolve the conflict.", { serverTask: task }));
    }
    next();
}; 