import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API ru nning on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("FATAL: failed to start server", err);
  process.exit(1);
});
