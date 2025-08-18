import Category from "../models/Category.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST a new category (optional)
export const createCategory = async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description || "",
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
