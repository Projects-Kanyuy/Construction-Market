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

const router = Router();

// Public routes
router.get("/", listCompanies);
router.get("/:id", getCompany);

// Protected admin routes
// Accepts logo, banner, and multiple images
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createCompany
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateCompany
);

router.delete("/:id", protect, adminOnly, deleteCompany);

router.post("/:id/increment-view", incrementCompanyViewCount);
export default router;
