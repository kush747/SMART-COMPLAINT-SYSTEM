import AppLayout from "../layouts/AppLayout";
import DashboardCards from "../components/DashboardCards";
import ComplaintTable from "../components/ComplaintTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { dashboardService } from "../services/dashboardService";
import { useAsync } from "../hooks/useAsync";

export default function OfficerDashboard() {
  const { data, loading, error } = useAsync(() => dashboardService.officer(), []);
  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold">Officer Dashboard</h1>
      {loading ? <LoadingSpinner /> : error ? <p className="text-rose-700">{error}</p> : (
        <div className="space-y-6">
          <DashboardCards cards={[
            { label: "Assigned complaints", value: data.assignedComplaints },
            { label: "Pending workload", value: data.pendingComplaints },
            { label: "Resolved complaints", value: data.resolvedComplaints }
          ]} />
          <section>
            <h2 className="mb-3 text-lg font-semibold">Recent Assigned Complaints</h2>
            <ComplaintTable complaints={data.recentComplaints} />
          </section>
        </div>
      )}
    </AppLayout>
  );
}
