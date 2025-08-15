import ActivityLog from "../models/ActivityLog.js";
import { StatusCodes } from "http-status-codes";

export const createLog = async (req, res) => {
  const { type, path, referrer, meta } = req.body;
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const log = await ActivityLog.create({
    type,
    path,
    referrer,
    meta,
    ip,
    userAgent,
  });
  res.status(StatusCodes.CREATED).json(log);
};

export const listLogs = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    ActivityLog.find({}).sort("-createdAt").skip(skip).limit(Number(limit)),
    ActivityLog.countDocuments({}),
  ]);
  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};
