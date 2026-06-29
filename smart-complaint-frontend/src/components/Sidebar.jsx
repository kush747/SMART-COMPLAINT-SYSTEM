import { NavLink } from "react-router-dom";
import { BarChart3, ClipboardList, FilePlus, Home, Shield, UserCircle, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-civic-100 text-civic-900" : "text-slate-600 hover:bg-slate-100"}`;

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const dashboard = user?.role === "ADMIN" ? "/admin" : user?.role === "OFFICER" ? "/officer" : "/dashboard";
  return (
    <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white p-4 transition lg:static lg:translate-x-0`}>
      <button onClick={onClose} className="mb-4 rounded px-3 py-2 text-sm text-slate-600 lg:hidden">Close</button>
      <nav className="space-y-1">
        <NavLink to="/" className={linkClass}><Home size={18} />Home</NavLink>
        <NavLink to={dashboard} className={linkClass}><BarChart3 size={18} />Dashboard</NavLink>
        <NavLink to="/complaints" className={linkClass}><ClipboardList size={18} />Complaints</NavLink>
        {user?.role === "USER" && <NavLink to="/complaints/new" className={linkClass}><FilePlus size={18} />Create Complaint</NavLink>}
        {user?.role === "ADMIN" && <NavLink to="/admin" className={linkClass}><Shield size={18} />Admin Center</NavLink>}
        {user?.role === "ADMIN" && <NavLink to="/admin/users" className={linkClass}><Users size={18} />Users</NavLink>}
        <NavLink to="/profile" className={linkClass}><UserCircle size={18} />Profile</NavLink>
      </nav>
    </aside>
  );
}
