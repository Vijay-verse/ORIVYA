"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const res = await register(email, password, fullName, phone);
    if (res.success) {
      router.push("/trips");
    } else {
      setErrorMsg(res.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 mx-auto">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Your ORIVYA Account
          </h2>
          <p className="text-xs text-slate-500">
            One trip. Every booking. One place.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
              placeholder="e.g. priya@example.com"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? "Creating account..." : "CREATE ACCOUNT"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
