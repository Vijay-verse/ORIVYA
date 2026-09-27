"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Ticket, 
  DollarSign, 
  Bus, 
  Train, 
  Hotel, 
  Car, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { useTravelStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { bookings, trips } = useTravelStore();
  const { role, switchDemoRole } = useAuth();

  const totalRevenue = 842500;
  const totalBookingsCount = 1284 + bookings.length;
  const activeTripsCount = 327 + trips.length;
  const activeUsersCount = 8492;

  const servicesBreakdown = [
    { name: "Bus Booking", share: "42%", count: 539, color: "bg-indigo-600", icon: Bus },
    { name: "Train Reservation", share: "25%", count: 321, color: "bg-violet-600", icon: Train },
    { name: "Hotel & Resorts", share: "22%", count: 282, color: "bg-amber-600", icon: Hotel },
    { name: "Local & Outstation Cabs", share: "11%", count: 142, color: "bg-emerald-600", icon: Car },
  ];

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Authorization Required</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              This operations hub is restricted to authorized ORIVYA administrators. Your current session is set to <strong>{role}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => switchDemoRole("admin")}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              SWITCH TO ADMIN ROLE (DEMO)
            </button>
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* ADMIN TOP NAV */}
      <div className="bg-[#0B0F19] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  ORIVYA SaaS Portal
                </span>
                <h1 className="text-xl font-extrabold text-white">Operations & Analytics Hub</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Platform GMV</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(totalRevenue)}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold pt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+18.4% from last month</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
              <Ticket className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{totalBookingsCount.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold pt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>99.2% confirmation rate</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Unified Trips</span>
              <Briefcase className="h-4 w-4 text-violet-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{activeTripsCount}</p>
            <span className="text-xs text-slate-400 block pt-1">Across 18 corridors</span>
          </div>

          <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Travellers</span>
              <Users className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{activeUsersCount.toLocaleString()}</p>
            <span className="text-xs text-emerald-600 font-semibold block pt-1">
              +142 joined today
            </span>
          </div>
        </div>

        {/* SERVICE BREAKDOWN & TOP CORRIDORS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Service Distribution */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Service Mix Breakdown</h3>
              <span className="text-xs text-slate-400">Volume distribution</span>
            </div>

            <div className="space-y-4">
              {servicesBreakdown.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                        <span>{s.name}</span>
                      </div>
                      <span>
                        {s.share} ({s.count} bookings)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: s.share }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Corridors */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Top Revenue Corridors</h3>
              <span className="text-xs text-slate-400">Inter-city routes</span>
            </div>

            <div className="space-y-3">
              {[
                { route: "Pune ⇄ Goa", mode: "Bus + Resort + Cabs", gmv: "₹3,42,000", volume: "310 Trips" },
                { route: "Pune ⇄ Hyderabad", mode: "Train + Bus", gmv: "₹2,10,400", volume: "245 Trips" },
                { route: "Pune ⇄ Mumbai", mode: "Deccan Queen + Cabs", gmv: "₹1,84,200", volume: "420 Trips" },
                { route: "Bangalore ⇄ Goa", mode: "Luxury Sleeper", gmv: "₹1,05,900", volume: "109 Trips" },
              ].map((c) => (
                <div
                  key={c.route}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 text-sm">{c.route}</span>
                    <p className="text-[11px] text-slate-400">{c.mode}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm">{c.gmv}</span>
                    <span className="text-[11px] text-indigo-600 font-semibold block">{c.volume}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT SIMULATED BOOKINGS STREAM */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Live Booking Transactions</h3>
            <span className="text-xs text-slate-400">Database synchronization</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Passenger</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {b.referenceNumber}
                    </td>
                    <td className="py-3 px-4 uppercase font-bold text-slate-700">{b.bookingType}</td>
                    <td className="py-3 px-4">{b.passengers[0]?.fullName || "Traveller"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{b.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(b.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
