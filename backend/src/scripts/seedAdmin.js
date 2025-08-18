import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

async function run() {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || "admin@cipromart.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const name = process.env.SEED_ADMIN_NAME || "Admin";

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, password });
    console.log("Admin created:", email, "(please change password)");
  } else {
    console.log("Admin already exists:", email);
  }
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
