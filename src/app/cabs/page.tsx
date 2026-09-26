"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MOCK_CAB_OPTIONS, MOCK_DRIVERS } from "@/lib/data/mockCabs";
import { CabOption, CabDriver, CabRideStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";

function CabSearchContent() {
  const searchParams = useSearchParams();
  const [pickup, setPickup] = useState(
    searchParams.get("pickup") || "Madgaon Railway Station"
  );
  const [drop, setDrop] = useState(
    searchParams.get("drop") || "SeaView Resort, Calangute"
  );
  const [date, setDate] = useState(searchParams.get("date") || "2026-10-02");
  const [time, setTime] = useState(searchParams.get("time") || "16:30");

  const [selectedCab, setSelectedCab] = useState<CabOption>(MOCK_CAB_OPTIONS[1]); // Sedan default
  const [rideStatus, setRideStatus] = useState<CabRideStatus | "idle">("idle");
  const [assignedDriver, setAssignedDriver] = useState<CabDriver | null>(null);
  const [liveDistanceKm, setLiveDistanceKm] = useState(2.8);

  // Live simulation lifecycle
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rideStatus === "searching") {
      timer = setTimeout(() => {
        setAssignedDriver(MOCK_DRIVERS[0]);
        setRideStatus("driver_assigned");
      }, 2000);
    } else if (rideStatus === "driver_assigned") {
      timer = setTimeout(() => {
        setRideStatus("arriving");
      }, 2500);
    } else if (rideStatus === "arriving") {
      const distanceInterval = setInterval(() => {
        setLiveDistanceKm((prev) => {
          if (prev <= 0.4) {
            clearInterval(distanceInterval);
            setRideStatus("in_trip");
            return 0;
          }
          return Number((prev - 0.6).toFixed(1));
        });
      }, 2000);
      return () => clearInterval(distanceInterval);
    } else if (rideStatus === "in_trip") {
      timer = setTimeout(() => {
        setRideStatus("completed");
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [rideStatus]);

  const handleStartBooking = () => {
    setRideStatus("searching");
    setLiveDistanceKm(2.8);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* SEARCH HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                <Car className="h-3.5 w-3.5 text-emerald-600" />
                {pickup} ➔ {drop}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {date} at {time}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ✓ Guaranteed On-Time Station Pickup
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* VEHICLE FLEET CATEGORIES */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Select vehicle tier for your transfer</span>
              <span>Fixed Upfront Pricing</span>
            </div>

            {MOCK_CAB_OPTIONS.map((cab) => {
              const isSelected = selectedCab.id === cab.id;
              return (
                <div
                  key={cab.id}
                  onClick={() => rideStatus === "idle" && setSelectedCab(cab)}
                  className={`rounded-3xl p-5 border cursor-pointer transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Car className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{cab.title}</h4>
                        <span className="text-[10px] text-slate-400">({cab.modelExample})</span>
                      </div>
                      <p className="text-xs text-slate-500">{cab.features.join(" • ")}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 font-medium">
                        <span>Max {cab.capacity} Passengers</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">{cab.etaMinutes} min away</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:border-l border-slate-100 sm:pl-6">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatCurrency(cab.estimatedPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Fixed All-inclusive</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: LIVE SIMULATOR DISPATCH RADAR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-emerald-600" />
                  Live Dispatch Simulation
                </h3>
                <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  Status: {rideStatus.toUpperCase()}
                </span>
              </div>

              {/* SIMULATED MAP RADAR VIEW */}
              <div className="relative h-56 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
                {/* Radar grid effect */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                {rideStatus === "idle" && (
                  <div className="text-center p-4 text-slate-400 text-xs">
                    <Car className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                    <span>Click Book Cab to simulate live driver matching</span>
                  </div>
                )}

                {rideStatus === "searching" && (
                  <div className="text-center space-y-3">
                    <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mx-auto" />
                    <span className="text-xs font-bold text-emerald-400 block">
                      Searching nearest drivers in Madgaon / Panaji...
                    </span>
                  </div>
                )}

                {(rideStatus === "driver_assigned" || rideStatus === "arriving") && (
                  <div className="text-center space-y-2 p-4 text-white">
                    <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto animate-pulse">
                      <Car className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold">Driver on the way</p>
                    <p className="text-xs text-emerald-400 font-mono font-bold">
                      {liveDistanceKm > 0 ? `${liveDistanceKm} km away` : "Arriving at pickup point"}
                    </p>
                  </div>
                )}

                {rideStatus === "in_trip" && (
                  <div className="text-center space-y-2 p-4 text-white">
                    <div className="h-12 w-12 rounded-full bg-indigo-500 text-white flex items-center justify-center mx-auto animate-bounce">
                      <Navigation className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-indigo-300">Ride in Progress</p>
                    <p className="text-xs text-slate-300">En route to SeaView Resort</p>
                  </div>
                )}

                {rideStatus === "completed" && (
                  <div className="text-center space-y-2 p-4 text-white">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                    <p className="text-sm font-bold text-emerald-300">Ride Completed!</p>
                    <p className="text-xs text-slate-300">Synced to your Unified Itinerary</p>
                  </div>
                )}
              </div>

              {/* DRIVER INFO IF ASSIGNED */}
              {assignedDriver && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{assignedDriver.name}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                        ★ {assignedDriver.rating}
                      </span>
                    </div>
                    <p className="text-slate-500">{assignedDriver.vehicleModel}</p>
                    <p className="font-mono font-bold text-indigo-600">{assignedDriver.plateNumber}</p>
                  </div>

                  <a
                    href={`tel:${assignedDriver.phone}`}
                    className="p-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                    title="Call Driver"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              )}

              {/* ACTION BUTTON */}
              {rideStatus === "idle" && (
                <button
                  type="button"
                  onClick={handleStartBooking}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Car className="h-4 w-4" />
                  <span>BOOK {selectedCab.title.toUpperCase()} ({formatCurrency(selectedCab.estimatedPrice)})</span>
                </button>
              )}

              {rideStatus === "completed" && (
                <button
                  type="button"
                  onClick={() => setRideStatus("idle")}
                  className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
                >
                  Book Another Ride
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CabPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Car className="h-10 w-10 text-emerald-600 animate-bounce" />
        </div>
      }
    >
      <CabSearchContent />
    </Suspense>
  );
}
