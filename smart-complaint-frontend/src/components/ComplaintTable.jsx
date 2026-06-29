import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { humanize } from "../utils/constants";

export default function ComplaintTable({ complaints = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Supports</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td className="px-4 py-3 font-medium"><Link to={`/complaints/${complaint.id}`} className="text-civic-700">{complaint.title}</Link></td>
              <td className="px-4 py-3">{humanize(complaint.category)}</td>
              <td className="px-4 py-3">{complaint.location}</td>
              <td className="px-4 py-3"><StatusBadge status={complaint.status} /></td>
              <td className="px-4 py-3">{complaint.supportCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
