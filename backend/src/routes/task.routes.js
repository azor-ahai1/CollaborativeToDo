import { Router } from "express";
import {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    moveTask,
    smartAssign,
    resolveConflict
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkTaskConflict } from "../middlewares/conflict.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createTask);
router.get("/", getAllTasks);
router.put("/:taskId", checkTaskConflict, updateTask);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId/move", moveTask);
router.post("/:taskId/smart-assign", smartAssign);
router.post("/:taskId/conflict", resolveConflict);

export default router; 