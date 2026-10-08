"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  MapPin, 
  Bus, 
  Train, 
  Hotel, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowLeft,
  X
} from "lucide-react";
import { useTravelStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function TripsPage() {
  const { trips, createNewTrip } = useTravelStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("2026-10-02");
  const [endDate, setEndDate] = useState("2026-10-05");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCreateModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination) return;
    createNewTrip(title, destination, startDate, endDate);
    setShowCreateModal(false);
    setTitle("");
    setDestination("");
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Unified Travel Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Trips & Itineraries
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              All your transportation, stays, and local transfers compiled into master chronological itineraries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>CREATE NEW TRIP</span>
          </button>
        </div>

        {/* TRIPS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const confirmedCount = trip.items.filter((i) => i.status === "CONFIRMED").length;
            const scheduledCount = trip.items.filter((i) => i.status === "SCHEDULED").length;

            return (
              <div
                key={trip.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  {/* Status & Destination */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      <MapPin className="h-3.5 w-3.5" />
                      {trip.destination}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {trip.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {trip.startDate} ➔ {trip.endDate}
                    </p>
                  </div>

                  {/* Summary of items in trip */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Chronological Itinerary ({trip.items.length} Bookings)
                    </span>
                    <div className="space-y-1.5">
                      {trip.items.slice(0, 3).map((item) => {
                        const Icon =
                          item.itemType === "bus"
                            ? Bus
                            : item.itemType === "train"
                            ? Train
                            : item.itemType === "hotel"
                            ? Hotel
                            : Car;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Icon className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                              <span className="font-semibold text-slate-800 truncate">
                                {item.title}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                                item.status === "CONFIRMED"
                                  ? "text-emerald-700 bg-emerald-50"
                                  : item.status === "CANCELLED"
                                  ? "text-rose-700 bg-rose-50"
                                  : "text-amber-700 bg-amber-50"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        );
                      })}

                      {trip.items.length > 3 && (
                        <p className="text-[11px] text-slate-400 text-center font-medium">
                          + {trip.items.length - 3} more connected bookings
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">
                    {confirmedCount} Confirmed • {scheduledCount} Scheduled
                  </span>
                  <Link
                    href={`/trips/${trip.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group"
                  >
                    <span>Open Master Itinerary</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE NEW TRIP MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/35 backdrop-blur-xs"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shrink-0"
                  title="Return to trips list"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-600" />
                  <span>Back to Trips</span>
                </button>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  Create Master Trip
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                aria-label="Close"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 overscroll-contain">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Trip Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad Tech Summit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all text-center"
                >
                  CREATE TRIP & START PLANNING
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
