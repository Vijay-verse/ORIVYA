"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bus, 
  Train, 
  Hotel, 
  Car, 
  ArrowRightLeft, 
  Calendar, 
  Users, 
  MapPin, 
  Search,
  Clock,
  Sparkles
} from "lucide-react";
import { ServiceType } from "@/types";

export const SearchSwitcher = ({ defaultTab = "bus" }: { defaultTab?: ServiceType }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ServiceType>(defaultTab);

  // Bus Form State
  const [busFrom, setBusFrom] = useState("Pune");
  const [busTo, setBusTo] = useState("Goa");
  const [busDate, setBusDate] = useState("2026-10-02");
  const [busPassengers, setBusPassengers] = useState("2");

  // Train Form State
  const [trainFrom, setTrainFrom] = useState("Pune");
  const [trainTo, setTrainTo] = useState("Hyderabad");
  const [trainDate, setTrainDate] = useState("2026-10-03");
  const [trainClass, setTrainClass] = useState("ALL");

  // Hotel Form State
  const [hotelCity, setHotelCity] = useState("Goa");
  const [hotelCheckIn, setHotelCheckIn] = useState("2026-10-02");
  const [hotelCheckOut, setHotelCheckOut] = useState("2026-10-05");
  const [hotelGuests, setHotelGuests] = useState("2");
  const [hotelRooms, setHotelRooms] = useState("1");

  // Cab Form State
  const [cabPickup, setCabPickup] = useState("Madgaon Railway Station");
  const [cabDrop, setCabDrop] = useState("SeaView Resort, Calangute");
  const [cabDate, setCabDate] = useState("2026-10-02");
  const [cabTime, setCabTime] = useState("16:30");

  const handleSwap = (
    val1: string, 
    set1: (v: string) => void, 
    val2: string, 
    set2: (v: string) => void
  ) => {
    set1(val2);
    set2(val1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "bus") {
      router.push(`/bus?from=${encodeURIComponent(busFrom)}&to=${encodeURIComponent(busTo)}&date=${busDate}&passengers=${busPassengers}`);
    } else if (activeTab === "train") {
      router.push(`/train?from=${encodeURIComponent(trainFrom)}&to=${encodeURIComponent(trainTo)}&date=${trainDate}&class=${trainClass}`);
    } else if (activeTab === "hotel") {
      router.push(`/hotels?city=${encodeURIComponent(hotelCity)}&checkIn=${hotelCheckIn}&checkOut=${hotelCheckOut}&guests=${hotelGuests}&rooms=${hotelRooms}`);
    } else if (activeTab === "cab") {
      router.push(`/cabs?pickup=${encodeURIComponent(cabPickup)}&drop=${encodeURIComponent(cabDrop)}&date=${cabDate}&time=${cabTime}`);
    }
  };

  const setQuickRoute = (from: string, to: string) => {
    if (activeTab === "bus") {
      setBusFrom(from);
      setBusTo(to);
    } else if (activeTab === "train") {
      setTrainFrom(from);
      setTrainTo(to);
    } else if (activeTab === "hotel") {
      setHotelCity(to);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white shadow-2xl shadow-indigo-950/15 border border-slate-200/90 overflow-hidden">
      {/* Tab Switcher Header */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("bus")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "bus"
              ? "bg-white text-indigo-600 shadow-md shadow-slate-200 border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <Bus className="h-4 w-4" />
          <span>Bus</span>
          <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400">Tickets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("train")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "train"
              ? "bg-white text-indigo-600 shadow-md shadow-slate-200 border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <Train className="h-4 w-4" />
          <span>Train</span>
          <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400">Trains</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hotel")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "hotel"
              ? "bg-white text-indigo-600 shadow-md shadow-slate-200 border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <Hotel className="h-4 w-4" />
          <span>Hotel</span>
          <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400">Resorts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cab")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "cab"
              ? "bg-white text-indigo-600 shadow-md shadow-slate-200 border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <Car className="h-4 w-4" />
          <span>Cab</span>
          <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400">Local & Outstation</span>
        </button>
      </div>

      {/* Dynamic Search Body */}
      <form onSubmit={handleSearch} className="p-4 sm:p-6 lg:p-8">
        {/* BUS SEARCH TAB */}
        {activeTab === "bus" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
            {/* From City */}
            <div className="md:col-span-3 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                From City
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={busFrom}
                  onChange={(e) => setBusFrom(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex md:col-span-1 items-center justify-center -mx-3 z-10">
              <button
                type="button"
                onClick={() => handleSwap(busFrom, setBusFrom, busTo, setBusTo)}
                className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 shadow-sm transition-transform active:rotate-180"
                title="Swap Locations"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* To City */}
            <div className="md:col-span-3 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                To City / Destination
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-violet-500 shrink-0" />
                <input
                  type="text"
                  value={busTo}
                  onChange={(e) => setBusTo(e.target.value)}
                  placeholder="e.g. Goa"
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-3 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Departure Date
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="date"
                  value={busDate}
                  onChange={(e) => setBusDate(e.target.value)}
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="md:col-span-2 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Passengers
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-indigo-500 shrink-0" />
                <select
                  value={busPassengers}
                  onChange={(e) => setBusPassengers(e.target.value)}
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none bg-transparent"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TRAIN SEARCH TAB */}
        {activeTab === "train" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
            <div className="md:col-span-4 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                From Station
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Train className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={trainFrom}
                  onChange={(e) => setTrainFrom(e.target.value)}
                  placeholder="Pune Junction (PUNE)"
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-4 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                To Station
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Train className="h-4 w-4 text-violet-500 shrink-0" />
                <input
                  type="text"
                  value={trainTo}
                  onChange={(e) => setTrainTo(e.target.value)}
                  placeholder="Hyderabad Deccan (HYB)"
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Date
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="date"
                  value={trainDate}
                  onChange={(e) => setTrainDate(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Class
              </label>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={trainClass}
                  onChange={(e) => setTrainClass(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 focus:outline-none bg-transparent"
                >
                  <option value="ALL">All Classes</option>
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="SL">Sleeper (SL)</option>
                  <option value="CC">Chair Car (CC)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* HOTEL SEARCH TAB */}
        {activeTab === "hotel" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
            <div className="md:col-span-4 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                City / Destination
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  placeholder="e.g. Goa"
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-3 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Check-In
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="date"
                  value={hotelCheckIn}
                  onChange={(e) => setHotelCheckIn(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-3 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Check-Out
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="date"
                  value={hotelCheckOut}
                  onChange={(e) => setHotelCheckOut(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Rooms & Guests
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-900">
                  {hotelGuests}G, {hotelRooms}R
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CAB SEARCH TAB */}
        {activeTab === "cab" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
            <div className="md:col-span-4 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pickup Location / Station
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  value={cabPickup}
                  onChange={(e) => setCabPickup(e.target.value)}
                  placeholder="Madgaon Railway Station"
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-4 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Drop Destination / Hotel
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-violet-500 shrink-0" />
                <input
                  type="text"
                  value={cabDrop}
                  onChange={(e) => setCabDrop(e.target.value)}
                  placeholder="SeaView Resort, Calangute"
                  className="w-full text-base font-semibold text-slate-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Date
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="date"
                  value={cabDate}
                  onChange={(e) => setCabDate(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-2xl border border-slate-200 p-3 hover:border-indigo-400 transition-colors focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pickup Time
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                <input
                  type="time"
                  value={cabTime}
                  onChange={(e) => setCabTime(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 focus:outline-none bg-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Row & Popular Route Pills */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {/* Quick Route Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Popular:
            </span>
            <button
              type="button"
              onClick={() => setQuickRoute("Pune", "Goa")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium transition-colors"
            >
              Pune ➔ Goa
            </button>
            <button
              type="button"
              onClick={() => setQuickRoute("Pune", "Hyderabad")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium transition-colors"
            >
              Pune ➔ Hyderabad
            </button>
            <button
              type="button"
              onClick={() => setQuickRoute("Pune", "Mumbai")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium transition-colors"
            >
              Pune ➔ Mumbai
            </button>
          </div>

          {/* Main Search Action Button */}
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
            <span>SEARCH {activeTab.toUpperCase()}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
