// File: src/utils/logVisitorActivity.ts
import { logActivity } from "../api/api";

const STORAGE_KEY = "last_visitor_log";

export const logVisitorActivity = async () => {
  const cachedTimestamp = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  if (cachedTimestamp && now - parseInt(cachedTimestamp) < twentyFourHours) {
    return;
  }

  try {
    // Optional: get IP (can keep using ipify)
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipRes.json();

    const payload = {
      type: "visit", // matches backend field 'type'
      path: window.location.pathname,
      referrer: document.referrer,
      meta: { ip },
    };

    const response = await logActivity(payload);
    console.log("Visitor log response:", response.data);

    localStorage.setItem(STORAGE_KEY, now.toString());
  } catch (error) {
    console.warn("Failed to log visitor activity", error);
  }
};
