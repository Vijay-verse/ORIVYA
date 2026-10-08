"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  SlidersHorizontal, 
  Star, 
  Clock, 
  ShieldCheck, 
  Wifi, 
  BatteryCharging, 
  Tv, 
  Coffee,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { MOCK_BUS_SCHEDULES, generateBusSeats } from "@/lib/data/mockBuses";
import { BusSchedule, BusPoint } from "@/types";
import { SeatMap } from "@/components/bus/SeatMap";
import { BusCheckoutModal } from "@/components/bus/BusCheckoutModal";
import { formatCurrency } from "@/lib/utils";

function BusSearchContent() {
  const searchParams = useSearchParams();

  // Search parameters
  const [fromCity, setFromCity] = useState(searchParams.get("from") || "Pune");
  const [toCity, setToCity] = useState(searchParams.get("to") || "Goa");
  const [date, setDate] = useState(searchParams.get("date") || "2026-10-02");
  const [passengers, setPassengers] = useState(searchParams.get("passengers") || "2");

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  // Sorting
  const [sortBy, setSortBy] = useState<"price_asc" | "rating_desc" | "departure_asc">("price_asc");

  // Active expanded bus seat selector
  const [expandedBusId, setExpandedBusId] = useState<string | null>("bus-vrl-01"); // Auto-expand first bus for demo!
  const [selectedSeats, setSelectedSeats] = useState<{ [busId: string]: string[] }>({
    "bus-vrl-01": ["L1A"],
  });

  // Modal checkout state
  const [checkoutModalData, setCheckoutModalData] = useState<{
    schedule: BusSchedule;
    boarding: BusPoint;
    dropping: BusPoint;
  } | null>(null);

  // Pre-generate dynamic seats per schedule
  const scheduleSeatsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof generateBusSeats>>();
    MOCK_BUS_SCHEDULES.forEach((sched) => {
      map.set(sched.id, generateBusSeats(sched.id, sched.basePrice));
    });
    return map;
  }, []);

  // Filtered & Sorted schedules
  const filteredBuses = useMemo(() => {
    return MOCK_BUS_SCHEDULES.filter((b) => {
      // Matching cities (case insensitive)
      const matchRoute =
        b.fromCity.toLowerCase().includes(fromCity.toLowerCase()) &&
        b.toCity.toLowerCase().includes(toCity.toLowerCase());

      if (!matchRoute) return false;
      if (b.basePrice > maxPrice) return false;
      if (minRating > 0 && b.rating < minRating) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(b.busType)) return false;
      if (selectedOperators.length > 0 && !selectedOperators.includes(b.operator.name)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.basePrice - b.basePrice;
      if (sortBy === "rating_desc") return b.rating - a.rating;
      if (sortBy === "departure_asc") return a.departureTime.localeCompare(b.departureTime);
      return 0;
    });
  }, [fromCity, toCity, maxPrice, minRating, selectedTypes, selectedOperators, sortBy]);

  const toggleSeatSelection = (busId: string, seatNumber: string) => {
    setSelectedSeats((prev) => {
      const current = prev[busId] || [];
      if (current.includes(seatNumber)) {
        return { ...prev, [busId]: current.filter((s) => s !== seatNumber) };
      } else {
        return { ...prev, [busId]: [...current, seatNumber] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* SEARCH REFINEMENT HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 font-semibold text-slate-800">
              <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100">
                <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                {fromCity} ➔ {toCity}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {date}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {passengers} Travellers
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="price_asc">Cheapest First</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="departure_asc">Earliest Departure</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA: FILTERS + BUS CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FILTERS SIDEBAR */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                Filters
              </h3>
              <button
                onClick={() => {
                  setMaxPrice(1500);
                  setSelectedTypes([]);
                  setSelectedOperators([]);
                  setMinRating(0);
                }}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Max Price</span>
                <span className="font-bold text-indigo-600">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="800"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹800</span>
                <span>₹1,500</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Customer Rating
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[0, 4.0, 4.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMinRating(rate)}
                    className={`py-1.5 px-2 rounded-xl border text-center font-bold transition-all ${
                      minRating === rate
                        ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {rate === 0 ? "All" : `${rate}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bus Class / Type */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Bus Type
              </label>
              <div className="space-y-2 text-xs">
                {["AC Sleeper (2+1)", "AC Seater (2+2)", "BharatBenz Multi-Axle Luxury"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedTypes([...selectedTypes, type]);
                        else setSelectedTypes(selectedTypes.filter((t) => t !== type));
                      }}
                      className="rounded accent-indigo-600"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bus Operators */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Bus Operators
              </label>
              <div className="space-y-2 text-xs">
                {["VRL Travels", "Neeta Travels", "IntrCity SmartBus", "Zingbus Plus"].map((op) => (
                  <label key={op} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedOperators.includes(op)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedOperators([...selectedOperators, op]);
                        else setSelectedOperators(selectedOperators.filter((o) => o !== op));
                      }}
                      className="rounded accent-indigo-600"
                    />
                    <span>{op}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* BUS RESULTS LIST */}
          <div className="lg:col-span-9 space-y-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Showing {filteredBuses.length} buses from {fromCity} to {toCity}</span>
              <span className="text-emerald-600">✓ Instant Seat Hold Enabled</span>
            </div>

            {filteredBuses.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
                <Bus className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">No buses match your filters</h4>
                <p className="text-xs text-slate-500 mt-1">Try widening your price range or clearing filters.</p>
              </div>
            ) : (
              filteredBuses.map((bus) => {
                const isExpanded = expandedBusId === bus.id;
                const busSeats = scheduleSeatsMap.get(bus.id) || [];
                const busSelectedSeats = selectedSeats[bus.id] || [];

                return (
                  <div
                    key={bus.id}
                    className="rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all overflow-hidden"
                  >
                    {/* BUS SUMMARY CARD */}
                    <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Operator & Type */}
                      <div className="md:col-span-4 space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-base text-slate-900">
                            {bus.operator.name}
                          </span>
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            ★ {bus.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{bus.busType}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {bus.amenities.slice(0, 3).map((a) => (
                            <span
                              key={a}
                              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Timing & Duration */}
                      <div className="md:col-span-5 flex items-center justify-between text-center px-2">
                        <div className="text-left">
                          <p className="text-xl font-bold text-slate-900">{bus.departureTime}</p>
                          <p className="text-xs font-semibold text-slate-600">{bus.fromCity}</p>
                          <p className="text-[10px] text-slate-400">{bus.boardingPoints[0].location}</p>
                        </div>

                        <div className="flex flex-col items-center px-4">
                          <span className="text-[11px] font-semibold text-slate-400 mb-1">
                            {bus.duration}
                          </span>
                          <div className="w-24 sm:w-28 h-0.5 bg-slate-200 relative flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-600" />
                          </div>
                          <span className="text-[10px] text-indigo-600 font-medium mt-1">Direct</span>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-slate-900">{bus.arrivalTime}</p>
                          <p className="text-xs font-semibold text-slate-600">{bus.toCity}</p>
                          <p className="text-[10px] text-slate-400">{bus.droppingPoints[0].location}</p>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 block font-semibold">Starting from</span>
                          <span className="text-2xl font-extrabold text-slate-900">
                            {formatCurrency(bus.basePrice)}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold block">
                            {bus.seatsAvailableCount} Seats Left
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedBusId(isExpanded ? null : bus.id)}
                          className={`mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                            isExpanded
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                          }`}
                        >
                          <span>{isExpanded ? "HIDE SEATS" : "SELECT SEATS"}</span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED INTERACTIVE SEAT MAP */}
                    {isExpanded && (
                      <SeatMap
                        schedule={bus}
                        seats={busSeats}
                        selectedSeatNumbers={busSelectedSeats}
                        onToggleSeat={(seatNum) => toggleSeatSelection(bus.id, seatNum)}
                        onProceedToBooking={(boarding, dropping) => {
                          setCheckoutModalData({
                            schedule: bus,
                            boarding,
                            dropping,
                          });
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL WITH 5-MINUTE LOCK & PAYMENT */}
      {checkoutModalData && (
        <BusCheckoutModal
          schedule={checkoutModalData.schedule}
          selectedSeats={selectedSeats[checkoutModalData.schedule.id] || []}
          boardingPoint={checkoutModalData.boarding}
          droppingPoint={checkoutModalData.dropping}
          onClose={() => setCheckoutModalData(null)}
        />
      )}
    </div>
  );
}

export default function BusSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-3">
            <Bus className="h-10 w-10 text-indigo-600 animate-bounce mx-auto" />
            <p className="text-sm font-bold text-slate-700">Loading bus schedules...</p>
          </div>
        </div>
      }
    >
      <BusSearchContent />
    </Suspense>
  );
}
