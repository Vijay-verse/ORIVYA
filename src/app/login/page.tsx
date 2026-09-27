"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ShieldCheck, ArrowRight, UserCheck, ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isSupabaseLive } = useAuth();
  const [email, setEmail] = useState("vijay.traveler@example.com");
  const [password, setPassword] = useState("password123");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const res = await login(email, password, "traveller");
    if (res.success) {
      router.push("/trips");
    } else {
      setErrorMsg(res.error || "Login failed");
    }
  };

  const handleDemoLogin = async (role: "traveller" | "admin") => {
    setErrorMsg("");
    const demoEmail = role === "admin" ? "admin@orivya.com" : "vijay.traveler@example.com";
    const res = await login(demoEmail, "password123", role);
    if (res.success) {
      router.push(role === "admin" ? "/admin" : "/trips");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* BRAND LOGO */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 mx-auto">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to ORIVYA
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your unified itineraries, digital passes, and wallet.
          </p>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span
              className={`h-2 w-2 rounded-full ${
                isSupabaseLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            {isSupabaseLive ? "Connected to Supabase PostgreSQL" : "Local / Demo Session Mode"}
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              placeholder="e.g. vijay@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">Password</label>
              <a href="#" className="text-[11px] text-indigo-600 font-bold hover:underline">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? "Signing in..." : "SIGN IN TO ORIVYA"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* DEMO 1-CLICK ROLES */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block text-center">
            One-Click Instant Demo Evaluation
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("traveller")}
              className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold text-left transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5 mb-1 text-indigo-600" />
              <span>Demo Traveller</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="p-2.5 rounded-xl border border-violet-200 bg-violet-50/50 hover:bg-violet-100 text-violet-800 text-[11px] font-bold text-left transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5 mb-1 text-violet-600" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* REGISTER LINK */}
        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an ORIVYA account?{" "}
          <Link href="/register" className="font-bold text-indigo-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
