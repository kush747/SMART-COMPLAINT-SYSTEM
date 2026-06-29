import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye , EyeOff } from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "USER", phone: "", address: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
       await register(form);
      navigate(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };


  return (
    <main className="grid min-h-screen place-items-center bg-slate-300 px-4 py-8">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Create Account</h1>
        {error && <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />


  
         <div className="relative">
  <input
    className="w-full rounded border border-slate-300 px-3 py-2 pr-10 focus-ring"
    placeholder="Password"
    type={showPassword ? "text" : "password"}
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    required
    minLength={8}
  />
  <button
    type="button"
    className="absolute inset-y-0 right-0 flex items-center pr-3"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff className="h-5 w-5 text-slate-500" /> : <Eye className="h-5 w-5 text-slate-500" />}
  </button>
</div>



          <select className="rounded border border-slate-300 px-3 py-2 focus-ring" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>USER</option><option>OFFICER</option></select>
          <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="rounded border border-slate-300 px-3 py-2 focus-ring" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <button disabled={loading} className="mt-6 rounded bg-blue-400 px-5 py-2 font-semibold text-black hover:bg-blue-500 disabled:opacity-60">Register</button>
        <Link to="/login" className="ml-4 text-sm font-semibold text-blue-500">Back to login</Link>
      </form>
    </main>
  );
}
