import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import jwt from 'jsonwebtoken';

const getUserIdFromToken = (token) => {
    try {
        if (!token) return null;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded._id;
    } catch (err) {
        return null;
    }
};

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        // origin: "http://localhost:5173",
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
        credentials: true
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('board:request', async () => {
        const { Task } = await import('./models/task.model.js');
        const tasks = await Task.find().populate('assignedTo', '_id username email');
        socket.emit('board:update', tasks);
    });
    
    socket.on('actions:request', async () => {
        const { ActionLog } = await import('./models/actionLog.model.js');
        const actions = await ActionLog.find().sort({ createdAt: -1 }).limit(20).populate('user', '_id username email').populate('task', '_id title');
        socket.emit('actions:update', actions);
    });
    
    socket.on('create-task', async (data, cb) => {
        try {
            const { Task } = await import('./models/task.model.js');
            const { ActionLog } = await import('./models/actionLog.model.js');
            const { title, description, priority, token } = data;
            const userId = getUserIdFromToken(token);
            if (!userId) {
                if (cb) cb({ error: "Unauthorized: Invalid or missing token" });
                return;
            }
            if (!title || title.trim() === "") {
                if (cb) cb({ error: "Task title is required" });
                return;
            }
            const exists = await Task.findOne({ title, board: "main" });
            if (exists) {
                if (cb) cb({ error: "Task title must be unique per board" });
                return;
            }
            const task = await Task.create({
                title,
                description,
                priority,
                status: "Todo",
                board: "main"
            });
            await ActionLog.create({ user: userId, action: "create", task: task._id, details: { title } });
            const tasks = await Task.find().populate('assignedTo', '_id username email');
            io.emit('board:update', tasks);
            
            const actions = await ActionLog.find().sort({ createdAt: -1 }).limit(20).populate('user', '_id username email').populate('task', '_id title');
            io.emit('actions:update', actions);
            if (cb) cb({ success: true, task });
        } catch (err) {
            if (cb) cb({ error: err.message });
        }
    });
    
    socket.on('delete-task', async (data, cb) => {
        try {
            const { Task } = await import('./models/task.model.js');
            const { ActionLog } = await import('./models/actionLog.model.js');
            const { taskId, token } = data;
            const userId = getUserIdFromToken(token);
            if (!userId) {
                if (cb) cb({ error: "Unauthorized: Invalid or missing token" });
                return;
            }
            const task = await Task.findByIdAndDelete(taskId);
            if (!task) {
                if (cb) cb({ error: "Task not found" });
                return;
            }
            await ActionLog.create({ user: userId, action: "delete", task: taskId, details: { title: task.title } });
            const tasks = await Task.find().populate('assignedTo', '_id username email');
            io.emit('board:update', tasks);
            
            const actions = await ActionLog.find().sort({ createdAt: -1 }).limit(20).populate('user', '_id username email').populate('task', '_id title');
            io.emit('actions:update', actions);
            if (cb) cb({ success: true });
        } catch (err) {
            if (cb) cb({ error: err.message });
        }
    });

    
    socket.on('smart-assign', async (data, cb) => {
        try {
            const { Task } = await import('./models/task.model.js');
            const { User } = await import('./models/user.model.js');
            const { ActionLog } = await import('./models/actionLog.model.js');
            const { taskId, token } = data;
            const userId = getUserIdFromToken(token);
            if (!userId) {
                if (cb) cb({ error: "Unauthorized: Invalid or missing token" });
                return;
            }
            const users = await User.find();
            const tasks = await Task.find({ status: { $ne: "Done" } });
            const userTaskCounts = users.map(user => ({
                user,
                count: tasks.filter(t => t.assignedTo && t.assignedTo.toString() === user._id.toString()).length
            }));
            userTaskCounts.sort((a, b) => a.count - b.count);
            const leastBusy = userTaskCounts[0]?.user;
            if (!leastBusy) {
                if (cb) cb({ error: "No users found for assignment" });
                return;
            }
            const task = await Task.findById(taskId);
            if (!task) {
                if (cb) cb({ error: "Task not found" });
                return;
            }
            task.assignedTo = leastBusy._id;
            await task.save();
            await ActionLog.create({ user: userId, action: "smart-assign", task: taskId, details: { assignedTo: leastBusy.username } });
            const updatedTasks = await Task.find().populate('assignedTo', '_id username email');
            io.emit('board:update', updatedTasks);
            
            const actions = await ActionLog.find().sort({ createdAt: -1 }).limit(20).populate('user', '_id username email').populate('task', '_id title');
            io.emit('actions:update', actions);
            if (cb) cb({ success: true, task });
        } catch (err) {
            if (cb) cb({ error: err.message });
        }
    });

    socket.on('move-task', async (data, cb) => {
        try {
            const { Task } = await import('./models/task.model.js');
            const { ActionLog } = await import('./models/actionLog.model.js');
            const { taskId, status, token } = data;
            const userId = getUserIdFromToken(token);
            if (!userId) {
                if (cb) cb({ error: "Unauthorized: Invalid or missing token" });
                return;
            }
            const task = await Task.findById(taskId);
            if (!task) {
                if (cb) cb({ error: "Task not found" });
                return;
            }
            const prevStatus = task.status;
            task.status = status;
            await task.save();
            await ActionLog.create({ user: userId, action: "move", task: taskId, details: { from: prevStatus, to: status } });
            const tasks = await Task.find().populate('assignedTo', '_id username email');
            io.emit('board:update', tasks);

            const actions = await ActionLog.find().sort({ createdAt: -1 }).limit(20).populate('user', '_id username email').populate('task', '_id title');
            io.emit('actions:update', actions);
            if (cb) cb({ success: true, task });
        } catch (err) {
            if (cb) cb({ error: err.message });
        }
    });

    socket.on('update-task', async (data, cb) => {
        try {
            const { Task } = await import('./models/task.model.js');
            const { ActionLog } = await import('./models/actionLog.model.js');
            const { taskId, title, description, status, priority, assignedTo, clientUpdatedAt, token } = data;
            const userId = getUserIdFromToken(token);
            if (!userId) {
                if (cb) cb({ error: "Unauthorized: Invalid or missing token" });
                return;
            }
            const task = await Task.findById(taskId);
            if (!task) {
                if (cb) cb({ error: "Task not found" });
                return;
            }
            if (clientUpdatedAt && new Date(task.updatedAt) > new Date(clientUpdatedAt)) {
                if (cb) cb({ conflict: { serverTask: task, clientTask: data } });
                return;
            }
            if (title && title !== task.title) {
                const exists = await Task.findOne({ title, board: task.board });
                if (exists) {
                    if (cb) cb({ error: "Task title must be unique per board" });
                    return;
                }
                if (["Todo", "In Progress", "Done"].includes(title)) {
                    if (cb) cb({ error: "Task title must not match column names" });
                    return;
                }
                task.title = title;
            }
            if (description !== undefined) task.description = description;
            if (status) task.status = status;
            if (priority !== undefined) task.priority = priority;
            if (assignedTo !== undefined) task.assignedTo = assignedTo;
            
            await task.save();
            await ActionLog.create({ user: userId, action: "update", task: task._id, details: { title: task.title } });
            
            const tasks = await Task.find().populate('assignedTo', '_id username email');
            io.emit('board:update', tasks);
            
            const actions = await ActionLog.find().sort({ createdAt: -1 }).limit(20).populate('user', '_id username email').populate('task', '_id title');
            io.emit('actions:update', actions);
            if (cb) cb({ success: true, task });
        } catch (err) {
            if (cb) cb({ error: err.message });
        }
    });
    
    socket.on('resolve-conflict', async (data, cb) => {
        try {
            const { Task } = await import('./models/task.model.js');
            const { ActionLog } = await import('./models/actionLog.model.js');
            const { taskId, resolution, clientTask, serverTask, token } = data;
            const userId = getUserIdFromToken(token);
            if (!userId) {
                if (cb) cb({ error: "Unauthorized: Invalid or missing token" });
                return;
            }
            let task = await Task.findById(taskId);
            if (!task) {
                if (cb) cb({ error: "Task not found" });
                return;
            }
            if (resolution === "overwrite") {
                Object.assign(task, clientTask);
                await task.save();
                await ActionLog.create({ user: userId, action: "conflict-overwrite", task: task._id, details: { resolution } });
            } else if (resolution === "merge") {
                for (const key of Object.keys(clientTask)) {
                    if (clientTask[key] !== serverTask[key]) {
                        task[key] = clientTask[key];
                    }
                }
                await task.save();
                await ActionLog.create({ user: userId, action: "conflict-merge", task: task._id, details: { resolution } });
            } else {
                if (cb) cb({ error: "Invalid conflict resolution option" });
                return;
            }
            const tasks = await Task.find().populate('assignedTo', '_id username email');
            io.emit('board:update', tasks);
            const actions = await ActionLog.find().sort({ createdAt: -1 }).limit(20).populate('user', '_id username email').populate('task', '_id title');
            io.emit('actions:update', actions);
            if (cb) cb({ success: true, task });
        } catch (err) {
            if (cb) cb({ error: err.message });
        }
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});


connectDB().then(() => {
    console.log("✅ Database connected. Starting server...");
    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
}).catch((err) => {
    console.log("MONGO DB Connection failed in src/index.js ", err);
}); 