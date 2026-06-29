import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import DashboardCards from "../components/DashboardCards";
import ComplaintTable from "../components/ComplaintTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { dashboardService } from "../services/dashboardService";
import { complaintService } from "../services/complaintService";
import { humanize } from "../utils/constants";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.admin(), complaintService.list({ size: 8, sort: "createdAt,desc" })])
      .then(([dash, list]) => {
        setDashboard(dash);
        setComplaints(list.content || []);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      {loading ? <LoadingSpinner /> : error ? <p className="text-rose-700">{error}</p> : (
        <div className="space-y-6">
          <DashboardCards cards={[
            { label: "Total users", value: dashboard.totalUsers },
            { label: "Total officers", value: dashboard.totalOfficers },
            { label: "Total complaints", value: dashboard.totalComplaints }
          ]} />
          <div className="grid gap-6 lg:grid-cols-2">
            <Summary title="Complaints by Category" items={dashboard.complaintsByCategory} />
            <Summary title="Complaints by Status" items={dashboard.complaintsByStatus} />
          </div>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Recent Complaints</h2>
            <ComplaintTable complaints={complaints} />
          </section>
        </div>
      )}
    </AppLayout>
  );
}

function Summary({ title, items }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 space-y-2">
        {Object.entries(items || {}).map(([key, value]) => (
          <div className="flex justify-between text-sm" key={key}><span>{humanize(key)}</span><strong>{value}</strong></div>
        ))}
      </div>
    </section>
  );
}
