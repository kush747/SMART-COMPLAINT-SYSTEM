import AppLayout from "../layouts/AppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const dashboard = user?.role === "ADMIN" ? "/admin" : user?.role === "OFFICER" ? "/officer" : "/dashboard";
  return (
    <AppLayout>
      <section className="rounded-lg bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase text-civic-700">Smart city operations</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-ink">Report, track, prioritize, and resolve civic issues with accountable city workflows.</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/complaints" className="rounded bg-civic-700 px-4 py-2 font-semibold text-white">View Complaints</Link>
          {user?.role === "USER" && <Link to="/complaints/new" className="rounded border border-civic-700 px-4 py-2 font-semibold text-civic-700">Create Complaint</Link>}
          <Link to={dashboard} className="rounded border border-slate-300 px-4 py-2 font-semibold text-slate-700">Dashboard</Link>
        </div>
      </section>
    </AppLayout>
  );
}
