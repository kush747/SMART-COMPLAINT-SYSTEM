import AppLayout from "../layouts/AppLayout";
import DashboardCards from "../components/DashboardCards";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAsync } from "../hooks/useAsync";
import { dashboardService } from "../services/dashboardService";

export default function UserDashboard() {
  const { data, loading, error } = useAsync(() => dashboardService.user(), []);
  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold">User Dashboard</h1>
      {loading ? <LoadingSpinner /> : error ? <p className="text-rose-700">{error}</p> : (
        <DashboardCards cards={[
          { label: "Total complaints", value: data.totalComplaints },
          { label: "Pending complaints", value: data.pendingComplaints },
          { label: "Resolved complaints", value: data.resolvedComplaints },
          { label: "Rejected complaints", value: data.rejectedComplaints }
        ]} />
      )}
    </AppLayout>
  );
}
