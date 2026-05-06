"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  Lock, 
  Mail, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[1100px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-slate-200">
        {/* Left Side: Branding/Visual */}
        <div className="md:w-[45%] bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 mb-8">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Clinical <br />
              <span className="text-primary-500">Management</span> <br />
              System
            </h1>
            <p className="mt-6 text-slate-400 font-medium leading-relaxed max-w-[300px]">
              Access your patient records, consultations, and clinic operations in one secure environment.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Secure Access</p>
                <p className="text-sm font-bold">Encrypted Data Vault</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Enter your credentials to access the clinic dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="admin@clinic.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-bold text-slate-900"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in shake duration-300">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              Access Dashboard
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary-500" />
              v1.2.0 Stable
            </div>
            <p>© 2026 Vercel Clinic System</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
