import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


app.use((err, req, res, next) => {
    console.error('Global Error Middleware:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query,
        error: {
            message: err.message,
            stack: err.stack,
            name: err.name,
            code: err.code
        },
    });

    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import actionLogRouter from "./routes/actionLog.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/actions", actionLogRouter);

app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
    });
});

export { app }; 