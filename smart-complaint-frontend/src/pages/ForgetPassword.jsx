import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {authService} from "../services/authService";

function ForgetPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendOtp = async()=>{
    setLoading(true);
    setError("");
    try {
       await authService.forgotPassword(form.email);
      setSuccess("OTP sent to your email. Please check your inbox.");
      setStep(2); // Move to OTP step
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async()=>{
    setLoading(true);
    setError("");
    try {
      await authService.verifyResetOtp(form.email, form.otp.trim());
      setSuccess("OTP verified. You can now reset your password.");
      setStep(3); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  const resetPassword = async()=>{
    
    setError("");
    if(form.password !== form.confirmPassword){
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(form.email, form.otp.trim(), form.password, form.confirmPassword);
      setSuccess("Password reset successful. You can now log in with your new password.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="grid min-h-screen place-items-center bg-slate-200 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center">
          Forget Password
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          {step === 1 && "Enter your email to receive an OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Enter your new password"}
        </p>

        <p className="mt-2 text-center text-sm text-slate-500">
          Enter your email to receive an OTP and reset your password.
        </p>
         {error && <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {success && <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">{success}</p>}

        {/* Email */}

        {step === 1 && (
          <div className="mt-6">
            <label className="mb-1 block text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={sendOtp}
              disabled={loading || !form.email}
              className="mt-5 w-full rounded bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* OTP Section */}
         {step === 2 && (
          <div className="mt-6">
            <p className="text-sm text-slate-500">OTP sent to <span className="font-medium text-slate-700">{form.email}</span></p>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              className="mt-4 w-full rounded border border-slate-300 px-3 py-2 text-center text-lg tracking-[8px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || form.otp.length !== 6}
              className="mt-4 w-full rounded bg-green-500 px-5 py-2 font-semibold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="mt-3 w-full text-sm text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          </div>
        )}


        {/* New Password */}
        {step === 3 && error && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded border border-slate-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-slate-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={resetPassword}
              disabled={loading || !form.password || !form.confirmPassword}
              className="w-full rounded bg-blue-500 px-5 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
    onClick={() => { setStep(1); setError(""); }}
    className="mt-2 text-sm text-blue-600 hover:underline"
  >
    OTP expired? Start again
  </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default ForgetPassword;