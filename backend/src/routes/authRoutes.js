import { Router } from "express";
import { login, getAllUsers } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// --- Login route ---
router.post("/login", login);

// --- Admin-only GET /api/users ---
router.get("/", protect, adminOnly, getAllUsers);

export default router;
