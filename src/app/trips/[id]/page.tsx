"use client";

import React, { use } from "react";
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
  Plus
} from "lucide-react";
import { useTravelStore } from "@/lib/store";
import { ServiceType } from "@/types";

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getTrip } = useTravelStore();
  const trip = getTrip(resolvedParams.id);

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
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* TOP TRIP BANNER */}
      <div className="bg-[#0B0F19] text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>All Trips</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Unified Trip Itinerary</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {trip.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                  {trip.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  {trip.startDate} ➔ {trip.endDate}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase text-[10px]">
                  {trip.status}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors border border-white/10"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Master Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CHRONOLOGICAL TIMELINE */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Journey Itinerary Timeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every transportation segment, stay, and cab transfer organized chronologically.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cabs"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Local Cab</span>
              </Link>
            </div>
          </div>

          {/* VERTICAL TIMELINE LIST */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {trip.items.map((item, idx) => {
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
