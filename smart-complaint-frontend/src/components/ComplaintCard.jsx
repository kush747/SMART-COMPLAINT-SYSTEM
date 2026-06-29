import { Link } from "react-router-dom";
import { MapPin, ThumbsUp } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { humanize } from "../utils/constants";

export default function ComplaintCard({ complaint }) {
  return (
    <Link to={`/complaints/${complaint.id}`} className="block">
      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-civic-300 hover:shadow-md transition cursor-pointer">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-ink hover:text-civic-700">
              {complaint.title}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{complaint.description}</p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{humanize(complaint.category)}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={15} />{complaint.location}</span>
          <span className="inline-flex items-center gap-1"><ThumbsUp size={15} />{complaint.supportCount}</span>
        </div>
      </article>
    </Link>
  );
}