import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye , EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form);
      navigate(user.role === "ADMIN" ? "/admin" : user.role === "OFFICER" ? "/officer" : "/dashboard");
    } catch (err) {
       const message = err.response?.data?.message || "Login failed";

      if (message.toLowerCase().includes("locked") || message.toLowerCase().includes("disabled")) {
        setError("Your email is not verified yet. Please check your email for the OTP.");
      } else {
        setError(message);
      }
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-300 px-4">
      
     {/* <img 
  src="/src/assets/login.jpg" 
  alt="Logo" 
  className="mx-auto mb-4 h-16 w-16 object-contain" 
/> */}
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-ink">Smart Complaint Login</h1>
        <p className="mt-2 text-sm text-slate-500">Access citizen, officer, and admin workspaces.</p>
        
        {error &&
         <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}
         </p>}


        <label className="mt-6 block text-sm font-medium">Email<input className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus-ring" 
        type="email"
        placeholder="Enter your email"
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
       
       
        <label 
        className="mt-4 block text-sm font-medium">Password
          
         <div className="relative mt-1">
           <input 
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus-ring" 
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          
          
           value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
           <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-slate-500" /> : <Eye className="h-5 w-5 text-slate-500" />}
          </button>
         </div>
           </label>


        <button disabled={loading} className="mt-6 w-full rounded-4xl
         bg-blue-500 px-4 py-2 font-semibold text-black hover:bg-blue-600 disabled:opacity-60">Login</button>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link className="font-semibold text-civic-700" to="/forgot-password">
            Forgot your password? 
            <span class="underline ml-1 text-blue-500">Reset it here</span>
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-slate-700" >OR</p>
        <p className="mt-4 text-center text-sm text-slate-500">New citizen? <Link className="font-semibold text-civic-700" to="/register">Create account</Link></p>
      </form>
    </main>
  );
}
