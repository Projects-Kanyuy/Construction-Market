import { Router } from "express";
import {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { upload, companyUploader } from "../utils/uploader.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", listCompanies);
router.get("/:id", getCompany);

// Protected admin routes
router.post("/", protect, adminOnly, companyUploader, createCompany);
router.put("/:id", protect, adminOnly, companyUploader, updateCompany);
router.delete("/:id", protect, adminOnly, deleteCompany);

export default router;
