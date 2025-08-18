import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import xss from "xss";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security
app.use(helmet());
app.use((req, _res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: false,
  })
);

// Logging
app.use(morgan("dev"));

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limit (basic)
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", apiLimiter);

// Static uploads
const uploadsDir = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express.static(path.join(__dirname, "..", uploadsDir)));

// Routes
app.use("/api/users", authRoutes);

app.use("/api/companies", companyRoutes);
app.use("/api/activity_logs", activityLogRoutes);
app.use("/api/health", healthRoutes);

// Health root
app.get("/", (_req, res) => res.json({ ok: true, service: "cipromart-api" }));

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
