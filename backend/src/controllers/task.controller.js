import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { ActionLog } from "../models/actionLog.model.js";


const emitBoardUpdate = async (io) => {
    const tasks = await Task.find().populate("assignedTo", "_id username email");
    io.emit("board:update", tasks);
};

const logAction = async (userId, action, taskId, details = {}) => {
    await ActionLog.create({ user: userId, action, task: taskId, details });
};

const createTask = asyncHandler(async (req, res) => {
    const { title, description, priority } = req.body;
    if (!title || title.trim() === "") {
        throw new ApiError(400, "Task title is required");
    }
    const exists = await Task.findOne({ title, board: "main" });
    if (exists) {
        throw new ApiError(409, "Task title must be unique per board");
    }
    const task = await Task.create({
        title,
        description,
        priority,
        status: "Todo",
        board: "main"
    });
    await logAction(req.user._id, "create", task._id, { title });
    await emitBoardUpdate(req.app.get("io"));
    res.status(201).json(new ApiResponse(201, task, "Task created"));
});

const getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find().populate("assignedTo", "_id username email");
    res.status(200).json(new ApiResponse(200, tasks, "All tasks fetched"));
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedTo, clientUpdatedAt } = req.body;
    const task = await Task.findById(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    if (clientUpdatedAt && new Date(task.updatedAt) > new Date(clientUpdatedAt)) {
        throw new ApiError(409, "Task has been updated by another user.", { serverTask: task });
    }
    if (title && title !== task.title) {
        const exists = await Task.findOne({ title, board: task.board });
        if (exists) throw new ApiError(409, "Task title must be unique per board");
        if (["Todo", "In Progress", "Done"].includes(title)) throw new ApiError(400, "Task title must not match column names");
        task.title = title;
    }
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    await task.save();
    await logAction(req.user._id, "update", task._id, { title: task.title });
    await emitBoardUpdate(req.app.get("io"));
    res.status(200).json(new ApiResponse(200, task, "Task updated"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    await logAction(req.user._id, "delete", taskId, { title: task.title });
    await emitBoardUpdate(req.app.get("io"));
    res.status(200).json(new ApiResponse(200, null, "Task deleted"));
});

const moveTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status, priority } = req.body;
    const task = await Task.findById(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    if (status) task.status = status;
    if (priority !== undefined) task.priority = priority;
    await task.save();
    await logAction(req.user._id, "move", task._id, { status, priority });
    await emitBoardUpdate(req.app.get("io"));
    res.status(200).json(new ApiResponse(200, task, "Task moved"));
});

const smartAssign = asyncHandler(async (req, res) => {
    const users = await User.find();
    const tasks = await Task.find({ status: { $ne: "Done" } });
    const userTaskCounts = users.map(user => ({
        user,
        count: tasks.filter(t => t.assignedTo && t.assignedTo.toString() === user._id.toString()).length
    }));
    userTaskCounts.sort((a, b) => a.count - b.count);
    const leastBusy = userTaskCounts[0]?.user;
    if (!leastBusy) throw new ApiError(404, "No users found for assignment");
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    task.assignedTo = leastBusy._id;
    await task.save();
    await logAction(req.user._id, "smart-assign", task._id, { assignedTo: leastBusy.username });
    await emitBoardUpdate(req.app.get("io"));
    res.status(200).json(new ApiResponse(200, task, `Task assigned to ${leastBusy.username}`));
});

const resolveConflict = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { resolution, clientTask, serverTask } = req.body;
    let task = await Task.findById(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    if (resolution === "overwrite") {
        Object.assign(task, clientTask);
        await task.save();
        await logAction(req.user._id, "conflict-overwrite", task._id, { resolution });
    } else if (resolution === "merge") {
        for (const key of Object.keys(clientTask)) {
            if (clientTask[key] !== serverTask[key]) {
                task[key] = clientTask[key];
            }
        }
        await task.save();
        await logAction(req.user._id, "conflict-merge", task._id, { resolution });
    } else {
        throw new ApiError(400, "Invalid conflict resolution option");
    }
    await emitBoardUpdate(req.app.get("io"));
    res.status(200).json(new ApiResponse(200, task, "Conflict resolved"));
});

export {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    moveTask,
    smartAssign,
    resolveConflict
}; 