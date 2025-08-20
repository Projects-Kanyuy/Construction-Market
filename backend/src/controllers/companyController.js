// src/controllers/companyController.js
import { StatusCodes } from "http-status-codes";
import Company from "../models/Company.js";

// List all companies (with filtering + pagination)
export const listCompanies = async (req, res) => {
  try {
    const { category, city, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (city) filter.city = { $regex: city, $options: "i" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Company.countDocuments(filter);

    const items = await Company.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};

// Get single company by ID
export const getCompany = async (req, res) => {
  try {
    const item = await Company.findById(req.params.id);
    if (!item)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Company not found" });

    res.json(item);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ message: "Failed to fetch company" });
  }
};

// Create company
// src/controllers/companyController.js
export const createCompany = async (req, res) => {
  try {
    const body = req.body;

    if (req.files?.logo) body.logoUrl = req.files.logo[0].path;
    if (req.files?.banner) body.bannerUrl = req.files.banner[0].path;
    if (req.files?.images) body.images = req.files.images.map((f) => f.path);

    // Map socials and location explicitly if not automatically handled
    body.location = req.body.location || "";
    body.facebook = req.body.facebook || "";
    body.twitter = req.body.twitter || "";
    body.instagram = req.body.instagram || "";
    body.linkedin = req.body.linkedin || "";

    const item = await Company.create(body);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Failed to create company" });
  }
};

// Update company
// src/controllers/companyController.js
export const updateCompany = async (req, res) => {
  try {
    const body = req.body;

    // Handle uploaded files
    if (req.files?.logo) body.logoUrl = req.files.logo[0].path;
    if (req.files?.banner) body.bannerUrl = req.files.banner[0].path;
    if (req.files?.images) body.images = req.files.images.map((f) => f.path);

    // Map socials and location explicitly
    body.location = req.body.location || "";
    body.facebook = req.body.facebook || "";
    body.twitter = req.body.twitter || "";
    body.instagram = req.body.instagram || "";
    body.linkedin = req.body.linkedin || "";

    const item = await Company.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });

    if (!item)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Company not found" });

    res.json(item);
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Failed to update company" });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const item = await Company.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Company not found" });

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Failed to delete company" });
  }
};
