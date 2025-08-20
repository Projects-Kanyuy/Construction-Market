import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Define initial categories
const categories = [
  { name: "Construction", description: "Construction companies" },
  { name: "Plumbing", description: "Plumbing services" },
  { name: "Electrical", description: "Electrical services" },
  { name: "Interior Design", description: "Interior design firms" },
  { name: "Landscaping", description: "Landscaping companies" },
];

// Insert categories
const seedCategories = async () => {
  try {
    await Category.deleteMany(); // optional: clear existing categories
    await Category.insertMany(categories);
    console.log("Categories seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCategories();
