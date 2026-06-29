import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import ComplaintCard from "../components/ComplaintCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { complaintService } from "../services/complaintService";
import { CATEGORIES, STATUSES, humanize } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

export default function ComplaintList() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: "", category: "", status: "", location: "", size: 20, sort: "createdAt,desc" });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const loader = user.role === "OFFICER" ? complaintService.assigned : user.role === "USER" ? complaintService.mine : complaintService.list;
    loader(filters)
      .then((page) => setComplaints(page.content || []))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [filters.q, filters.category, filters.status, filters.location]);

  const submit = (event) => {
    event.preventDefault();
    setFilters({ ...filters });
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Complaints</h1>
      </div>
      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-4">
        <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Search" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select className="rounded border border-slate-300 px-3 py-2 focus-ring" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c} value={c}>{humanize(c)}</option>)}</select>
        <select className="rounded border border-slate-300 px-3 py-2 focus-ring" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}</select>
      </form>
      {loading ? <LoadingSpinner /> : error ? <p className="text-rose-700">{error}</p> : <div className="grid gap-4">{complaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)}</div>}
    </AppLayout>
  );
}
