import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { complaintService } from "../services/complaintService";
import { CATEGORIES, humanize } from "../utils/constants";

const empty = { title: "", description: "", category: "ROAD", location: "", imageUrl: "" };

export default function ComplaintForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) complaintService.get(id).then(setForm).catch((err) => setError(err.response?.data?.message || err.message)).finally(() => setLoading(false));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const saved = id ? await complaintService.update(id, form) : await complaintService.create(form);
      navigate(`/complaints/${saved.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save complaint");
      console.error(err);
    }
  };

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold">{id ? "Edit Complaint" : "Create Complaint"}</h1>
      {loading ? <LoadingSpinner /> : (
        <form onSubmit={submit} className="max-w-3xl rounded-lg bg-white p-6 shadow-sm">
          {error && <p className="mb-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <div className="grid gap-4">
            <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="min-h-36 rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <select className="rounded border border-slate-300 px-3 py-2 focus-ring" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c} value={c}>{humanize(c)}</option>)}</select>
            <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Image URL" value={form.imageUrl || ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <button className="mt-6 rounded bg-blue-400 px-5 py-2 font-semibold text-black hover:bg-blue-500">Save Complaint</button>
        </form>
      )}
    </AppLayout>
  );
}
