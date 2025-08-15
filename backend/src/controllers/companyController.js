import { StatusCodes } from "http-status-codes";
import Company from "../models/Company.js";

export const listCompanies = async (req, res) => {
  const {
    search,
    country,
    city,
    category,
    featured,
    verified,
    isActive,
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = req.query;

  const query = {};
  if (typeof featured !== "undefined") query.featured = featured === "true";
  if (typeof verified !== "undefined") query.verified = verified === "true";
  if (typeof isActive !== "undefined") query.isActive = isActive === "true";
  if (country) query.country = country;
  if (city) query.city = city;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Company.find(query).sort(sort).skip(skip).limit(Number(limit)),
    Company.countDocuments(query),
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};

export const getCompany = async (req, res) => {
  const item = await Company.findById(req.params.id);
  if (!item)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Company not found" });
  res.json(item);
};

export const createCompany = async (req, res) => {
  const body = req.body;
  if (req.files?.logo) body.logoUrl = `/uploads/${req.files.logo[0].filename}`;
  if (req.files?.banner)
    body.bannerUrl = `/uploads/${req.files.banner[0].filename}`;
  if (req.files?.images)
    body.images = req.files.images.map((f) => `/uploads/${f.filename}`);
  const item = await Company.create(body);
  res.status(StatusCodes.CREATED).json(item);
};

export const updateCompany = async (req, res) => {
  const body = req.body;
  if (req.files?.logo) body.logoUrl = `/uploads/${req.files.logo[0].filename}`;
  if (req.files?.banner)
    body.bannerUrl = `/uploads/${req.files.banner[0].filename}`;
  if (req.files?.images)
    body.images = req.files.images.map((f) => `/uploads/${f.filename}`);
  const item = await Company.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  if (!item)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Company not found" });
  res.json(item);
};

export const deleteCompany = async (req, res) => {
  const item = await Company.findByIdAndDelete(req.params.id);
  if (!item)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Company not found" });
  res.json({ message: "Deleted" });
};
