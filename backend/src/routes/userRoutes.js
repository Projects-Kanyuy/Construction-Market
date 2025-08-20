import express from "express";
import { registerUser, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// All routes protected by admin
router.use(protect, adminOnly);

// Register new user
router.post("/register", registerUser);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;
