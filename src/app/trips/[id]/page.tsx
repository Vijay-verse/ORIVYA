"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Bus, 
  Train, 
  Hotel, 
  Car, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  Printer, 
  Share2, 
  Sparkles,
  ArrowRight,
  Plus,
  DollarSign,
  QrCode,
  ShieldCheck
} from "lucide-react";
import { useTravelStore } from "@/lib/store";
import { ServiceType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import QRCode from "qrcode";

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getTrip, bookings } = useTravelStore();
  const trip = getTrip(resolvedParams.id);
  const [masterQrUrl, setMasterQrUrl] = useState<string>("");

  useEffect(() => {
    if (trip) {
      const qrPayload = JSON.stringify({
        masterTripId: trip.id,
        ref: `ORV-TRIP-2026-${trip.destination.slice(0, 3).toUpperCase()}`,
        title: trip.title,
        destination: trip.destination,
        dates: `${trip.startDate} to ${trip.endDate}`,
        segmentsCount: trip.items.length,
      });

      QRCode.toDataURL(qrPayload, { width: 220, margin: 1 })
        .then(setMasterQrUrl)
        .catch(console.error);
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center space-y-4">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Trip Not Found</h2>
          <p className="text-xs text-slate-500">The trip you requested does not exist or was deleted.</p>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to My Trips</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate budget breakdown by matching bookings
  const tripBookingIds = new Set(trip.items.map((i) => i.bookingId));
  const relevantBookings = bookings.filter((b) => tripBookingIds.has(b.id));

  const transitSpend = relevantBookings
    .filter((b) => (b.bookingType === "bus" || b.bookingType === "train") && b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const staySpend = relevantBookings
    .filter((b) => b.bookingType === "hotel" && b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const cabSpend = relevantBookings
    .filter((b) => b.bookingType === "cab" && b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalTripInvestment = transitSpend + staySpend + cabSpend;
  const masterTripRef = `ORV-TRIP-2026-${trip.destination.slice(0, 3).toUpperCase()}-${trip.id.slice(-3).toUpperCase()}`;

  const getItemIcon = (type: ServiceType) => {
    switch (type) {
      case "bus":
        return Bus;
      case "train":
        return Train;
      case "hotel":
        return Hotel;
      case "cab":
        return Car;
    }
  };

  const getItemColor = (type: ServiceType) => {
    switch (type) {
      case "bus":
        return "bg-indigo-500 text-white";
      case "train":
        return "bg-violet-500 text-white";
      case "hotel":
        return "bg-amber-500 text-white";
      case "cab":
        return "bg-emerald-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 print:bg-white print:pb-0">
      {/* TOP TRIP BANNER */}
      <div className="bg-[#0B0F19] text-white border-b border-slate-800 print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors print:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>All Trips</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider print:border-slate-400 print:text-slate-900">
                  <Sparkles className="h-3.5 w-3.5 print:hidden" />
                  <span>Master Trip Pass</span>
                </span>
                <span className="font-mono text-xs font-extrabold bg-slate-800 text-slate-200 px-3 py-1 rounded-full border border-slate-700 print:bg-slate-100 print:text-slate-900">
                  {masterTripRef}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {trip.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 print:text-slate-600 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400 print:text-slate-900" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400 print:text-slate-900" />
                  {trip.startDate} ➔ {trip.endDate}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase text-[10px] print:text-slate-900 print:border-slate-300">
                  {trip.status}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <Printer className="h-4 w-4" />
                <span>Print Master Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* MASTER SUMMARY & BUDGET CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* BUDGET & EXPENDITURE CARD */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-indigo-600" />
                <span>Trip Financial & Budget Summary</span>
              </h3>
              <span className="text-xs font-extrabold text-slate-900">
                Total: {formatCurrency(totalTripInvestment)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-indigo-600">Transit Spend</span>
                <p className="text-sm font-extrabold text-indigo-950">{formatCurrency(transitSpend)}</p>
                <span className="text-[10px] text-indigo-500">Bus & Rail Legs</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-amber-600">Hospitality Spend</span>
                <p className="text-sm font-extrabold text-amber-950">{formatCurrency(staySpend)}</p>
                <span className="text-[10px] text-amber-500">Resort & Hotels</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-emerald-600">Local Mobility</span>
                <p className="text-sm font-extrabold text-emerald-950">{formatCurrency(cabSpend)}</p>
                <span className="text-[10px] text-emerald-500">Transfers & Cabs</span>
              </div>
            </div>
          </div>

          {/* MASTER QR PASS CARD */}
          <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center">
            {masterQrUrl ? (
              <img
                src={masterQrUrl}
                alt="Master Trip Pass QR"
                className="w-28 h-28 rounded-xl border border-slate-200 p-1"
              />
            ) : (
              <div className="w-28 h-28 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
                <QrCode className="h-8 w-8 text-slate-300" />
              </div>
            )}
            <span className="text-[10px] font-mono font-bold text-slate-600 mt-2 block">
              Scan for Consolidated Passes
            </span>
            <span className="text-[9px] text-slate-400 block">Unified Carrier Validation</span>
          </div>
        </div>

        {/* CHRONOLOGICAL TIMELINE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Journey Itinerary Timeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every transportation segment, stay, and cab transfer organized chronologically.
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <Link
                href="/cabs"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Cab</span>
              </Link>
              <Link
                href="/hotels"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Stay</span>
              </Link>
            </div>
          </div>

          {/* VERTICAL TIMELINE LIST */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {trip.items.map((item) => {
              const Icon = getItemIcon(item.itemType);
              const colorClass = getItemColor(item.itemType);

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Badge */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full ${colorClass} shadow-md ring-4 ring-white`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>

                  {/* Card Content */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {item.itemType.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-1">{item.subtitle}</p>
                      </div>

                      <span
                        className={`inline-flex items-center text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase w-fit ${
                          item.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "CANCELLED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status === "CONFIRMED" && "✓ "}
                        {item.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          Timing & Schedule
                        </span>
                        <span className="text-slate-800 font-medium">{item.startTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          Location / Landmark
                        </span>
                        <span className="text-slate-800 font-medium">{item.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>{item.detailsSummary}</span>
                      <span className="font-mono text-slate-400">Ref: {item.bookingRef}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
