"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Wallet, 
  ShieldCheck, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Briefcase, 
  Ticket, 
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { UserRole } from "@/types";

export default function ProfilePage() {
  const { user, role, logout, switchDemoRole, updateProfile } = useAuth();
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center space-y-4">
          <User className="h-12 w-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">You are not signed in</h2>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            <span>Sign In to ORIVYA</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: editName, phone: editPhone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}
        <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <User className="h-3.5 w-3.5" />
              <span>Personal Account</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Traveller Profile & Settings
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage your personal information, role privileges, and ORIVYA wallet balance.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors w-fit"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* PROFILE CARD */}
          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 text-center">
            <div className="relative inline-block mx-auto">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-500/20 shadow-md mx-auto"
              />
              <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-600 text-white border-2 border-white">
                {role}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{user.email}</p>
            </div>

            {/* Wallet Balance Pill */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 text-left space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>ORIVYA Cash Wallet</span>
                <Wallet className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-indigo-900">
                {formatCurrency(user.walletBalance)}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                Instant refund credits applied here
              </span>
            </div>

            {/* DEMO ROLE SWITCHER */}
            <div className="pt-4 border-t border-slate-100 text-left space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Evaluation: Switch Active Role
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(["traveller", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => switchDemoRole(r)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      role === r
                        ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EDIT FORM & PREFERENCES */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Account Information
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
              >
                Save Changes
              </button>
            </form>

            {/* Quick Links */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <Link
                href="/trips"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">My Trips</span>
                  <span className="text-[11px] text-slate-400">View master itineraries</span>
                </div>
                <ArrowRight className="h-4 w-4 text-indigo-600" />
              </Link>

              <Link
                href="/bookings"
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">My Bookings</span>
                  <span className="text-[11px] text-slate-400">Digital passes & QR</span>
                </div>
                <ArrowRight className="h-4 w-4 text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
