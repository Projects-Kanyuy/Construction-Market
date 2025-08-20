import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g., visit, click, contact
    path: { type: String },
    referrer: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    meta: { type: Object }, // arbitrary JSON
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
