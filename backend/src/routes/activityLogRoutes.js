import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createLog, listLogs } from "../controllers/activityLogController.js";

const router = Router();
router.post("/", createLog); // matches POST /api/activity_logs from the old frontend
router.get("/", protect, listLogs);
export default router;
