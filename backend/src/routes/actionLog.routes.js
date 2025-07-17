import { Router } from "express";
import { getRecentActions } from "../controllers/actionLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.get("/", getRecentActions);

export default router; 