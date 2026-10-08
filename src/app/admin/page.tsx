"use client";

import React, { useState, useEffect } from "react";
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
  ArrowUpRight,
  Calendar,
  Filter,
  Search,
  Tag,
  Activity,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Database,
  ArrowLeft
} from "lucide-react";
import { useTravelStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthContext";
import { AdminService } from "@/services/adminService";
import { AuditService, AuditLogEntry } from "@/services/auditService";
import { AVAILABLE_COUPONS, Coupon } from "@/services/couponService";
import { MOCK_BUS_SCHEDULES } from "@/lib/data/mockBuses";
import { MOCK_TRAIN_SCHEDULES } from "@/lib/data/mockTrains";
import { MOCK_HOTEL_PROPERTIES } from "@/lib/data/mockHotels";
import { MOCK_CAB_OPTIONS } from "@/lib/data/mockCabs";
import { formatCurrency } from "@/lib/utils";
import { Booking } from "@/types";

export default function AdminDashboardPage() {
  const { bookings, trips, cancelBooking } = useTravelStore();
  const { role, switchDemoRole } = useAuth();

  const [activeTab, setActiveTab] = useState<"analytics" | "bookings" | "audit" | "inventory" | "coupons">("analytics");
  const [dateFilter, setDateFilter] = useState<"all" | "30days" | "7days" | "today">("all");

  // Booking filtering
  const [bookingFilterType, setBookingFilterType] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  // Inventory state tracking
  const [inventoryState, setInventoryState] = useState<{ [id: string]: boolean }>({
    "bus-pune-goa-01": true,
    "bus-pune-goa-02": true,
    "train-12115": true,
    "train-22223": true,
    "hotel-seaview-goa": true,
    "hotel-grand-hyatt": true,
    "cab-sedan": true,
    "cab-suv": true,
  });

  // Coupons state tracking
  const [couponsList, setCouponsList] = useState<Coupon[]>(AVAILABLE_COUPONS);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => AuditService.getLogs());

  // Cloud Diagnostics & Database Telemetry
  const [healthData, setHealthData] = useState<{
    status: string;
    environment: string;
    supabase: {
      isConfigured: boolean;
      host: string;
      connection: { status: string; latencyMs: number; error: string | null };
    };
    services: Record<string, string>;
  } | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);

  const fetchHealth = async () => {
    setIsHealthLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const json = await res.json();
        setHealthData(json);
      }
    } catch {
      // ignore
    } finally {
      setIsHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const metrics = AdminService.getMetrics(bookings, trips, dateFilter);

  const toggleInventory = (id: string, name: string, category: string) => {
    const nextState = !inventoryState[id];
    setInventoryState((prev) => ({ ...prev, [id]: nextState }));
    AuditService.logEvent({
      actorId: "admin-session",
      actorRole: "admin",
      action: "INVENTORY_TOGGLED",
      entityType: "inventory",
      entityId: id,
      metadata: { name, category, status: nextState ? "ACTIVE" : "SUSPENDED" },
    });
    setAuditLogs(AuditService.getLogs());
  };

  const toggleCoupon = (code: string) => {
    setCouponsList((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
    AuditService.logEvent({
      actorId: "admin-session",
      actorRole: "admin",
      action: "INVENTORY_TOGGLED",
      entityType: "coupon",
      entityId: code,
      metadata: { action: "status_toggled" },
    });
    setAuditLogs(AuditService.getLogs());
  };

  const handleAdminCancelBooking = (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking and initiate a full automated refund?")) return;
    const res = cancelBooking(bookingId);
    alert(res.message);
    setSelectedBookingForDetails(null);
    setAuditLogs(AuditService.getLogs());
  };

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

  const filteredBookings = bookings.filter((b) => {
    const matchesType = bookingFilterType === "all" || b.bookingType === bookingFilterType;
    const matchesSearch =
      b.referenceNumber.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.passengers[0]?.fullName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.contactEmail.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24">
      {/* ADMIN TOP NAV */}
      <div className="bg-[#0B0F19] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  ORIVYA SaaS Portal
                </span>
                <h1 className="text-xl font-extrabold text-white">Operations & Analytics Hub</h1>
              </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
              {[
                { id: "analytics", label: "Analytics", icon: BarChart3 },
                { id: "bookings", label: `Bookings (${bookings.length})`, icon: Ticket },
                { id: "audit", label: `Audit Feed (${auditLogs.length})`, icon: Activity },
                { id: "inventory", label: "Inventory Control", icon: SlidersHorizontal },
                { id: "coupons", label: "Promo Codes", icon: Tag },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ================= TAB 1: ANALYTICS & KPIS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in fade-in-50 duration-150">
            {/* CLOUD INFRASTRUCTURE & SUPABASE STATUS BANNER */}
            <div className="rounded-3xl bg-[#0B0F19] text-white p-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                      Live Telemetry & Diagnostics
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <Database className="h-5 w-5 text-indigo-400" />
                    {healthData?.supabase.isConfigured ? (
                      <span>Supabase PostgreSQL: Connected</span>
                    ) : (
                      <span>Supabase PostgreSQL: In-Memory Fallback Mode</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    {healthData?.supabase.isConfigured ? (
                      <>Production database connected to <span className="font-mono text-indigo-300">{healthData.supabase.host}</span> with {healthData.supabase.connection.latencyMs}ms roundtrip latency.</>
                    ) : (
                      <>Live Render deployment running in resilient fallback mode with stateful memory persistence. To bind to live PostgreSQL, supply <span className="font-mono text-amber-300">NEXT_PUBLIC_SUPABASE_URL</span> & <span className="font-mono text-amber-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in the Render Environment dashboard.</>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Engine Mode</span>
                      <span className={`text-xs font-bold ${healthData?.supabase.isConfigured ? "text-emerald-400" : "text-amber-400"}`}>
                        {healthData?.supabase.isConfigured ? "Live Supabase Cloud" : "Demo Engine (Active)"}
                      </span>
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full ${healthData?.supabase.isConfigured ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </div>

                  <button
                    type="button"
                    onClick={fetchHealth}
                    disabled={isHealthLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isHealthLoading ? "animate-spin" : ""}`} />
                    <span>{isHealthLoading ? "Pinging..." : "Check Cloud Health"}</span>
                  </button>
                </div>
              </div>

              {/* Quick service indicators */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Bus Engine: Operational
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Train Engine: Operational
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Hotels Engine: Operational
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Cabs Engine: Operational
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Seat-Locking TTL: Active
                </span>
              </div>
            </div>

            {/* KPI METRIC CARDS */}
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-bold text-slate-800">Business Health & Real-time GMV</h2>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Window:</span>
                {[
                  { label: "All Time", val: "all" },
                  { label: "30D", val: "30days" },
                  { label: "7D", val: "7days" },
                  { label: "Today", val: "today" },
                ].map((f) => (
                  <button
                    key={f.val}
                    type="button"
                    onClick={() => setDateFilter(f.val as any)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      dateFilter === f.val ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross Platform GMV</span>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(metrics.totalGmv)}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold pt-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+18.4% from baseline</span>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                  <Ticket className="h-4 w-4 text-indigo-500" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{metrics.totalBookingsCount.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold pt-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{metrics.confirmationRatePercent}% confirmation rate</span>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Unified Trips</span>
                  <Briefcase className="h-4 w-4 text-violet-500" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{metrics.activeTripsCount}</p>
                <span className="text-xs text-slate-400 block pt-1">Across 18 corridors</span>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Registered Travellers</span>
                  <Users className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{metrics.registeredUsersCount.toLocaleString()}</p>
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
                  {metrics.serviceMix.map((s) => {
                    const Icon = s.service.includes("Bus")
                      ? Bus
                      : s.service.includes("Train")
                      ? Train
                      : s.service.includes("Hotel")
                      ? Hotel
                      : Car;

                    return (
                      <div key={s.service} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-slate-500" />
                            <span>{s.service}</span>
                          </div>
                          <span>
                            {s.sharePercent}% ({s.count} bookings)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.sharePercent}%` }} />
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
                  {metrics.corridorAnalytics.map((c) => (
                    <div
                      key={c.route}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-sm">{c.route}</span>
                        <p className="text-[11px] text-slate-400">{c.mode}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(c.gmv)}</span>
                        <span className="text-[11px] text-indigo-600 font-semibold block">{c.tripCount} Trips</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: BOOKINGS STREAM ================= */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">All Platform Bookings</h3>
                <p className="text-xs text-slate-500">Live operational ledger across Bus, Train, Hotel, and Cab</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Type Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  {["all", "bus", "train", "hotel", "cab"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBookingFilterType(t)}
                      className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] ${
                        bookingFilterType === t ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search ref or name..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 w-44 sm:w-56"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Primary Passenger</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        {b.referenceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-slate-100 text-slate-700">
                          {b.bookingType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-bold">
                        {b.passengers[0]?.fullName || "Traveller"}
                        <span className="text-slate-400 block text-[10px] font-normal">{b.contactEmail}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{b.paymentMethod}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                        {formatCurrency(b.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDetails(b)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: OPERATIONAL AUDIT FEED ================= */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Immutable Operational Audit Log</h3>
                <p className="text-xs text-slate-500">
                  Full security and lifecycle trail capturing booking, payment, seat locking, and refund events
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ● Live Streaming
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Metadata Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleTimeString()} • {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            log.action.includes("CREATED") || log.action.includes("CAPTURED")
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : log.action.includes("CANCELLED") || log.action.includes("REFUND")
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : log.action.includes("LOCKED")
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {log.entityType.toUpperCase()}: {log.entityId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {log.actorRole} ({log.actorId})
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {JSON.stringify(log.metadata || {})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: INVENTORY CONTROL ================= */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Inventory Status & Quotas</h3>
                <p className="text-xs text-slate-500">
                  Toggle route, train schedule, hotel room, and cab availability in real-time
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bus Inventory */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Bus className="h-3.5 w-3.5 text-indigo-600" />
                  Bus Fleets & Schedules
                </h4>
                <div className="space-y-2">
                  {MOCK_BUS_SCHEDULES.slice(0, 3).map((bus) => {
                    const isActive = inventoryState[bus.id] ?? true;
                    return (
                      <div
                        key={bus.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{bus.operator.name} ({bus.busType})</p>
                          <p className="text-[11px] text-slate-500">{bus.fromCity} ➔ {bus.toCity} • Fare: {formatCurrency(bus.basePrice)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleInventory(bus.id, bus.operator.name, "bus")}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "SUSPENDED"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Train Inventory */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Train className="h-3.5 w-3.5 text-violet-600" />
                  Train Routes & Quotas
                </h4>
                <div className="space-y-2">
                  {MOCK_TRAIN_SCHEDULES.slice(0, 3).map((trn) => {
                    const isActive = inventoryState[trn.id] ?? true;
                    return (
                      <div
                        key={trn.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{trn.trainName} (#{trn.trainNumber})</p>
                          <p className="text-[11px] text-slate-500">{trn.fromCity} ➔ {trn.toCity} • {trn.classes.length} Classes</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleInventory(trn.id, trn.trainName, "train")}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "SUSPENDED"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hotel Inventory */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Hotel className="h-3.5 w-3.5 text-amber-600" />
                  Hotel Properties
                </h4>
                <div className="space-y-2">
                  {MOCK_HOTEL_PROPERTIES.map((htl) => {
                    const isActive = inventoryState[htl.id] ?? true;
                    return (
                      <div
                        key={htl.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{htl.name}</p>
                          <p className="text-[11px] text-slate-500">{htl.city} • {htl.starRating} Stars • {htl.rooms.length} Room Tiers</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleInventory(htl.id, htl.name, "hotel")}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "SUSPENDED"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cab Fleet Inventory */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5 text-emerald-600" />
                  Cab Vehicle Categories
                </h4>
                <div className="space-y-2">
                  {MOCK_CAB_OPTIONS.map((cab) => {
                    const isActive = inventoryState[cab.id] ?? true;
                    return (
                      <div
                        key={cab.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{cab.title} ({cab.modelExample})</p>
                          <p className="text-[11px] text-slate-500">Base: {formatCurrency(cab.baseFare)} • Rate: ₹{cab.perKmRate}/km</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleInventory(cab.id, cab.title, "cab")}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isActive ? "ACTIVE" : "SUSPENDED"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: PROMO CODES & COUPONS ================= */}
        {activeTab === "coupons" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Promo Code Management Engine</h3>
                <p className="text-xs text-slate-500">Manage promotional discount codes, caps, and service restrictions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {couponsList.map((cp) => (
                <div
                  key={cp.code}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {cp.code}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${cp.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                        {cp.isActive ? "ACTIVE" : "PAUSED"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{cp.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="font-bold text-slate-800">
                        {cp.discountType === "flat" ? `Flat ₹${cp.discountValue}` : `${cp.discountValue}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Order:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(cp.minOrderAmount)}</span>
                    </div>
                    {cp.maxDiscount && (
                      <div className="flex justify-between">
                        <span>Max Cap:</span>
                        <span className="font-bold text-slate-800">{formatCurrency(cp.maxDiscount)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCoupon(cp.code)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      cp.isActive
                        ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {cp.isActive ? "Pause Code" : "Activate Code"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= BOOKING INSPECT & ACTIONS MODAL ================= */}
      {selectedBookingForDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/35 backdrop-blur-xs"
          onClick={() => setSelectedBookingForDetails(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForDetails(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shrink-0"
                  title="Return to bookings table"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-600" />
                  <span>Back to Hub</span>
                </button>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block">Booking Management</span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{selectedBookingForDetails.referenceNumber}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                aria-label="Close"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="p-4 sm:p-6 space-y-6 text-xs overflow-y-auto flex-1 overscroll-contain">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">BOOKING TYPE</span>
                  <span className="font-bold uppercase text-slate-900">{selectedBookingForDetails.bookingType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">STATUS</span>
                  <span className="font-bold uppercase text-emerald-700">{selectedBookingForDetails.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PASSENGER / GUEST</span>
                  <span className="font-bold text-slate-900">{selectedBookingForDetails.passengers[0]?.fullName || "Traveller"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CONTACT PHONE</span>
                  <span className="font-bold text-slate-900">{selectedBookingForDetails.contactPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PAYMENT METHOD</span>
                  <span className="font-bold text-slate-900">{selectedBookingForDetails.paymentMethod} ({selectedBookingForDetails.paymentStatus})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TOTAL AMOUNT</span>
                  <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(selectedBookingForDetails.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForDetails(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Hub</span>
                </button>
                {selectedBookingForDetails.status === "CONFIRMED" ? (
                  <button
                    type="button"
                    onClick={() => handleAdminCancelBooking(selectedBookingForDetails.id)}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs text-center transition-colors shadow-md shadow-rose-600/20"
                  >
                    Cancel Booking & Issue Refund
                  </button>
                ) : (
                  <div className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs text-center">
                    Booking is already {selectedBookingForDetails.status}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
