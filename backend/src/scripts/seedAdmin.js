import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";

async function run() {
  await connectDB();

  const categories = [
    "Construction",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Landscaping",
    "Roofing",
  ];

  for (const name of categories) {
    const existing = await Category.findOne({ name });
    if (!existing) {
      await Category.create({ name });
      console.log("Category created:", name);
    } else {
      console.log("Category already exists:", name);
    }
  }

  console.log("All categories seeded!");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
