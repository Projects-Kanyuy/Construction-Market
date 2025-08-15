import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, index: true },
    description: { type: String },
    category: { type: String, index: true }, // e.g., Construction, Architecture, Suppliers
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    address: { type: String },
    country: { type: String, index: true },
    city: { type: String, index: true },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    images: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, index: true }],
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
