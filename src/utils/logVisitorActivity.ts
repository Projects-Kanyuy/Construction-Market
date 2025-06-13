import axios from "axios";
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
    const ipRes = await axios.get("https://api.ipify.org?format=json");
    const ip = ipRes.data.ip;


    const response = await logActivity({
      action: "Visitor logged",
      details: `Visitor with IP ${ip} visited the site.`,
      userId: null,
    });
    console.log('THIS IS THE RESPONSE: ', response);

    localStorage.setItem(STORAGE_KEY, now.toString());
  } catch (error) {
    console.warn("Failed to log visitor activity", error);
  }
};
