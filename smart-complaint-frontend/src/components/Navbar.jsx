import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="rounded p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu size={22} /></button>
          <Link to="/" className="font-bold text-civic-900">Smart City Complaints</Link>
        </div>
        <div className="flex items-center gap-10 text-sm font-medium lg:flex">
          <div ><Link to="/services" className="text-slate-600 text-lg hover:text-civic-700">Services</Link></div>
        <div ><Link to="/about" className="text-slate-600 text-lg hover:text-civic-700">About Us</Link></div>
        <div ><Link to="/contact" className="text-slate-600 text-lg hover:text-civic-700">Contact</Link></div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="hidden items-center gap-2 text-sm text-slate-600 hover:text-civic-700 sm:flex"><UserCircle size={18} />{user.fullName}</Link>
            <button onClick={signOut} className="rounded p-2 text-slate-600 hover:bg-slate-100" aria-label="Logout"><LogOut size={20} /></button>
          </div>
        )}
      </div>
    </header>
  );
}
