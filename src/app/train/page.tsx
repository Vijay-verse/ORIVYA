"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Train, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Ticket
} from "lucide-react";
import { MOCK_TRAIN_SCHEDULES } from "@/lib/data/mockTrains";
import { TrainSchedule } from "@/types";
import { formatCurrency } from "@/lib/utils";

function TrainSearchContent() {
  const searchParams = useSearchParams();
  const [fromStation, setFromStation] = useState(searchParams.get("from") || "Pune");
  const [toStation, setToStation] = useState(searchParams.get("to") || "Hyderabad");
  const [date, setDate] = useState(searchParams.get("date") || "2026-10-03");

  const [selectedTrainForRoute, setSelectedTrainForRoute] = useState<TrainSchedule | null>(null);
  const [pnrInput, setPnrInput] = useState("");
  const [pnrResult, setPnrResult] = useState<string | null>(null);

  const trains = MOCK_TRAIN_SCHEDULES.filter((t) => {
    return (
      t.fromCity.toLowerCase().includes(fromStation.toLowerCase()) ||
      t.toCity.toLowerCase().includes(toStation.toLowerCase())
    );
  });

  const checkPnr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput) return;
    setPnrResult(`PNR ${pnrInput}: Confirmed • Coach B2 Berth 34 (Side Lower) • Chart Prepared`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* SEARCH HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex items-center gap-1 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-lg border border-violet-100">
                <Train className="h-3.5 w-3.5 text-violet-600" />
                {fromStation} ➔ {toStation}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {date}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ✓ Live Quota Simulation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* TRAIN RESULTS LIST */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Found {trains.length} Trains on this route</span>
              <span>Sorted by Departure</span>
            </div>

            {trains.map((train) => (
              <div
                key={train.id}
                className="rounded-3xl bg-white border border-slate-200 shadow-xs p-6 space-y-5 hover:border-violet-300 transition-all"
              >
                {/* Train Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                        #{train.trainNumber}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">{train.trainName}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Runs on: {train.daysOfRun.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {train.pantryAvailable && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Utensils className="h-3 w-3 text-slate-500" />
                        Pantry Car
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedTrainForRoute(train)}
                      className="text-xs font-bold text-violet-600 hover:underline"
                    >
                      View Route & Halts
                    </button>
                  </div>
                </div>

                {/* Timing Bar */}
                <div className="grid grid-cols-3 gap-2 text-center items-center py-2">
                  <div className="text-left">
                    <p className="text-2xl font-bold text-slate-900">{train.departureTime}</p>
                    <p className="text-xs font-semibold text-slate-700">{train.fromStation}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-slate-400">{train.duration}</span>
                    <div className="w-24 sm:w-36 h-0.5 bg-slate-200 relative flex items-center justify-center my-1.5">
                      <Train className="h-3.5 w-3.5 text-violet-600 bg-white" />
                    </div>
                    <span className="text-[10px] text-slate-400">Direct Express</span>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{train.arrivalTime}</p>
                    <p className="text-xs font-semibold text-slate-700">{train.toStation}</p>
                  </div>
                </div>

                {/* Class & Quota Selector Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {train.classes.map((cls) => (
                    <div
                      key={cls.classCode}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-violet-50/50 hover:border-violet-300 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{cls.classCode}</span>
                        <span className="text-xs font-extrabold text-violet-700">
                          {formatCurrency(cls.price)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{cls.className}</span>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                        <span
                          className={
                            cls.status === "AVAILABLE"
                              ? "text-emerald-600"
                              : cls.status === "RAC"
                              ? "text-amber-600"
                              : "text-rose-600"
                          }
                        >
                          {cls.status}: {cls.seatsCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `Simulated Train Booking for ${train.trainName} (${cls.classCode}). Class reserved.`
                            )
                          }
                          className="px-2 py-0.5 rounded bg-violet-600 hover:bg-violet-700 text-white text-[10px]"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDEBAR: PNR STATUS & IRCTC INFORMATION */}
          <div className="lg:col-span-4 space-y-6">
            {/* PNR Checker Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">Check PNR Status</h3>
              </div>

              <p className="text-xs text-slate-500">
                Enter your 10-digit simulated PNR number to check live coach, berth, and chart status.
              </p>

              <form onSubmit={checkPnr} className="space-y-3">
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 4829103942"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-600"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 transition-all"
                >
                  CHECK STATUS
                </button>
              </form>

              {pnrResult && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {pnrResult}
                </div>
              )}
            </div>

            {/* IRCTC Quota Rules */}
            <div className="bg-gradient-to-br from-violet-900 to-slate-900 text-white rounded-3xl p-6 space-y-3 shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-300">
                Railway Architecture
              </span>
              <h4 className="text-base font-bold">Simulated Multi-Tier Quotas</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                ORIVYA models sleeper class, AC 3-tier, AC 2-tier, and Chair Car quotas with live RAC/Waiting List simulation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROUTE HALTS MODAL */}
      {selectedTrainForRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B0F19] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-violet-400">
                  ROUTE & TIMETABLE
                </span>
                <h4 className="text-lg font-bold">
                  {selectedTrainForRoute.trainName} (#{selectedTrainForRoute.trainNumber})
                </h4>
              </div>
              <button
                onClick={() => setSelectedTrainForRoute(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              <div className="divide-y divide-slate-100 text-xs">
                {selectedTrainForRoute.halts.map((h, idx) => (
                  <div key={h.stationCode} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">
                        {idx + 1}. {h.stationName} ({h.stationCode})
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Distance: {h.distanceKm} km • Day {h.day}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-slate-500 block">Arr: {h.arrivalTime}</span>
                      <span className="font-bold text-violet-700">Dep: {h.departureTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setSelectedTrainForRoute(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrainPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Train className="h-10 w-10 text-violet-600 animate-bounce" />
        </div>
      }
    >
      <TrainSearchContent />
    </Suspense>
  );
}
