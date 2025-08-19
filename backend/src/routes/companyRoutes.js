import { Router } from "express";
import {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import upload from "../middleware/upload.js"; // Cloudinary upload middleware
import { protect, adminOnly } from "../middleware/auth.js";
import { companyUploader } from "../utils/uploader.js";

const router = Router();

// Public routes
router.get("/", listCompanies);
router.get("/:id", getCompany);

// Protected admin routes
// Accepts logo, banner, and multiple images
router.post("/", protect, adminOnly, companyUploader, createCompany);

router.put("/:id", protect, adminOnly, companyUploader, updateCompany);

router.delete("/:id", protect, adminOnly, deleteCompany);

// router.post("/:id/increment-view", incrementCompanyViewCount);
export default router;
