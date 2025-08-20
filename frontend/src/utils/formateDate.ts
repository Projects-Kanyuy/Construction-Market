import { format } from "date-fns";

export const formatDate = (date: string | Date | undefined | null) => {
  if (!date) return "—"; // placeholder for missing dates
  try {
    return format(new Date(date), "EEEE, MMMM d, yyyy"); // pretty format
  } catch (err) {
    console.error("Invalid date:", date);
    return "—";
  }
};
