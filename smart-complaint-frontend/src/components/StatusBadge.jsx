import { humanize, statusStyles } from "../utils/constants";

export default function StatusBadge({ status }) {
  return <span className={`rounded px-2 py-1 text-xs font-semibold ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}>{humanize(status)}</span>;
}
