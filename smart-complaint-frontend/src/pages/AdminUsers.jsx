import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { userService } from "../services/userService";
import { ROLES } from "../utils/constants";

const empty = { fullName: "", email: "", password: "", role: "OFFICER", phone: "", address: "", enabled: true };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => userService.list({ size: 100, sort: "createdAt,desc" }).then((page) => setUsers(page.content || [])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const create = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await userService.create(form);
      setForm(empty);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create user");
    }
  };

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <form onSubmit={create} className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-3">
        {error && <p className="md:col-span-3 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        <select className="rounded border border-slate-300 px-3 py-2 focus-ring" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES.map((role) => <option key={role}>{role}</option>)}</select>
        <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button className="rounded bg-civic-700 px-4 py-2 font-semibold text-white md:col-span-3">Create User</button>
      </form>
      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((item) => <tr key={item.id}><td className="px-4 py-3">{item.fullName}</td><td className="px-4 py-3">{item.email}</td><td className="px-4 py-3">{item.role}</td><td className="px-4 py-3">{item.enabled ? "Active" : "Disabled"}</td><td className="px-4 py-3"><button onClick={() => userService.remove(item.id).then(load)} className="text-rose-700">Delete</button></td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
