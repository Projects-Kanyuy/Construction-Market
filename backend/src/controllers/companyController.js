// src/controllers/companyController.js
import { StatusCodes } from "http-status-codes";
import Company from "../models/Company.js";

// List all companies (with filtering + pagination + location-based filtering)
export const listCompanies = async (req, res) => {
  try {
    const {
      category,
      city,
      country,
      search,
      page = 1,
      limit = 10,
      latitude,
      longitude,
      radius = 50000 // Default radius in meters (50km)
    } = req.query;

    const filter = { isActive: true }; // Only show active companies
    if (category) filter.category = category;
    if (city) filter.city = { $regex: city, $options: "i" };
    if (country) filter.country = { $regex: country, $options: "i" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Location-based filtering using geospatial queries
    if (latitude && longitude) {
      filter.geoLocation = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const total = await Company.countDocuments(filter);

    const items = await Company.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-__v'); // Exclude version field

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasLocationFilter: !!(latitude && longitude),
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};

// Get single company by ID
export const getCompany = async (req, res) => {
  try {
    const item = await Company.findById(req.params.id).select('-__v');
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

// Get single company by slug (for shareable profile links)
export const getCompanyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const item = await Company.findOne({ slug, isActive: true }).select('-__v');

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Company not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Error fetching company by slug:", error);
    res.status(500).json({ message: "Failed to fetch company" });
  }
};

// Increment company view count (for analytics)
export const incrementCompanyViewCount = async (req, res) => {
  try {
    const { identifier } = req.params; // Can be ID or slug

    // Try to find by slug first, then by ID
    let company;
    if (identifier.length === 24) { // MongoDB ObjectId length
      company = await Company.findById(identifier);
    } else {
      company = await Company.findOne({ slug: identifier });
    }

    if (!company) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Company not found" });
    }

    // Increment view count
    await Company.findByIdAndUpdate(company._id, {
      $inc: { viewCount: 1 }
    });

    res.json({ message: "View count incremented", viewCount: company.viewCount + 1 });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ message: "Failed to increment view count" });
  }
};

// Create company
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

    // Handle coordinates for geolocation
    if (req.body.latitude && req.body.longitude) {
      body.coordinates = {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude)
      };
    }

    // Ensure unique slug
    let baseSlug = body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await Company.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    body.slug = uniqueSlug;

    const item = await Company.create(body);
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating company:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Company with this name already exists" });
    } else {
      res.status(500).json({ message: "Failed to create company" });
    }
  }
};

// Update company
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

    // Handle coordinates for geolocation
    if (req.body.latitude && req.body.longitude) {
      body.coordinates = {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude)
      };
    }

    // Handle slug update if name changed
    if (body.name) {
      const currentCompany = await Company.findById(req.params.id);
      if (currentCompany && currentCompany.name !== body.name) {
        let baseSlug = body.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        let uniqueSlug = baseSlug;
        let counter = 1;

        while (await Company.findOne({ slug: uniqueSlug, _id: { $ne: req.params.id } })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        body.slug = uniqueSlug;
      }
    }

    const item = await Company.findByIdAndUpdate(req.params.id, body, {
      new: true,
    }).select('-__v');

    if (!item)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Company not found" });

    res.json(item);
  } catch (error) {
    console.error("Error updating company:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Company with this name already exists" });
    } else {
      res.status(500).json({ message: "Failed to update company" });
    }
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
