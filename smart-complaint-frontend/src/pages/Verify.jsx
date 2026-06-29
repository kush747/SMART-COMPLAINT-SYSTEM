import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.verify(email, otp.trim());
      navigate("/login?verified=true");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setResent(false);
    try {
      await authService.resendOtp(email);
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="mt-2 text-sm text-slate-500">We sent a 6 digit OTP to <span className="font-medium text-slate-700">{email}</span></p>
        {error && <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {resent && <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">OTP resent successfully!</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 focus-ring tracking-widest text-center text-lg"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button disabled={loading} className="w-full rounded bg-blue-400 px-5 py-2 font-semibold text-black hover:bg-blue-500 disabled:opacity-60">
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
        <button onClick={resend} className="mt-4 text-sm text-blue-500 hover:underline">
          Didn't receive OTP? Resend
        </button>
      </div>
    </main>
  );
}