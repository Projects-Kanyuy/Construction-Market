import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { upload, companyUploader } from "../utils/uploader.js";

const router = Router();

router.get("/", listCompanies);
router.get("/:id", getCompany);

// Protected admin routes
router.post("/", protect, companyUploader, createCompany);
router.put("/:id", protect, companyUploader, updateCompany);
router.delete("/:id", protect, deleteCompany);

export default router;
