import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  return (
    <AppLayout>
      <section className="max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Profile</h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Item label="Name" value={user.fullName} />
          <Item label="Email" value={user.email} />
          <Item label="Role" value={user.role} />
          <Item label="Phone" value={user.phone || "Not provided"} />
          <Item label="Address" value={user.address || "Not provided"} />
          <Item label="Status" value={user.enabled ? "Active" : "Disabled"} />
          <Item label="Created At" value={new Date(user.createdAt).toLocaleString()} />
          <Item label="Updated At" value={new Date(user.updatedAt).toLocaleString()} />
          
        </dl>
      </section>
    </AppLayout>
  );
}

function Item({ label, value }) {
  return <div><dt className="text-sm text-slate-500">{label}</dt><dd className="font-medium">{value}</dd></div>;
}
