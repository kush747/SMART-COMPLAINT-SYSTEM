export const CATEGORIES = ["ROAD", "WATER", "ELECTRICITY", "GARBAGE", "SEWER", "STREET_LIGHT", "OTHER"];
export const STATUSES = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"];
export const ROLES = ["USER", "OFFICER", "ADMIN"];

export const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  ASSIGNED: "bg-sky-100 text-sky-800",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800"
};

export const humanize = (value = "") => value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
