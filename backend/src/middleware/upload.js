// src/middleware/upload.js
import dotenv from "dotenv";
dotenv.config(); // <-- add this at the very top

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "companies";
    if (file.fieldname === "logo") folder += "/logos";
    if (file.fieldname === "banner") folder += "/banners";
    if (file.fieldname === "images") folder += "/images";

    return {
      folder,
      format: "jpg",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

// Middleware to handle multiple fields for a company
export const companyUploader = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export default upload;

console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
