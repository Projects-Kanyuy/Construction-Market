import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../src/config/db.js";
import Company from "../src/models/Company.js";
import { parseCSV } from "../src/utils/csvImport.js";

// Usage: npm run import:companies -- ./data/companies.csv
const filePath = process.argv[2];
if (!filePath) {
  console.error(
    "Provide CSV path: npm run import:companies -- ./data/companies.csv"
  );
  process.exit(1);
}

async function run() {
  await connectDB();
  const rows = await parseCSV(filePath);
  const mapped = rows.map((r) => ({
    name: r.name || r.company || "",
    slug: r.slug || undefined,
    description: r.description || "",
    category: r.category || "",
    phone: r.phone || "",
    email: r.email || "",
    website: r.website || "",
    address: r.address || "",
    country: r.country || "",
    city: r.city || "",
    logoUrl: r.logoUrl || "",
    bannerUrl: r.bannerUrl || "",
    images: r.images ? r.images.split("|").map((s) => s.trim()) : [],
    featured: ["1", "true", "yes"].includes(String(r.featured).toLowerCase()),
    verified: ["1", "true", "yes"].includes(String(r.verified).toLowerCase()),
    isActive: !["0", "false", "no"].includes(String(r.isActive).toLowerCase()),
    tags: r.tags ? r.tags.split(",").map((s) => s.trim()) : [],
  }));

  const result = await Company.insertMany(mapped, { ordered: false });
  console.log(`Imported ${result.length} companies`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
