"use client";

import React from "react";
import Link from "next/link";
import { 
  Compass, 
  Bus, 
  Train, 
  Hotel, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Ticket, 
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Zap,
  Users
} from "lucide-react";
import { SearchSwitcher } from "@/components/search/SearchSwitcher";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const destinations = [
    {
      city: "Goa",
      state: "Goa",
      tag: "Top Beach Destination",
      startingBus: 1149,
      startingHotel: 3200,
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      routes: "Pune ⇄ Goa • Mumbai ⇄ Goa",
    },
    {
      city: "Pune",
      state: "Maharashtra",
      tag: "Oxford of the East",
      startingBus: 450,
      startingHotel: 2800,
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80",
      routes: "Mumbai ⇄ Pune • Hyderabad ⇄ Pune",
    },
    {
      city: "Hyderabad",
      state: "Telangana",
      tag: "City of Pearls",
      startingBus: 950,
      startingHotel: 3500,
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
      routes: "Pune ⇄ Hyderabad • Bangalore ⇄ Hyderabad",
    },
    {
      city: "Mumbai",
      state: "Maharashtra",
      tag: "Maximum City",
      startingBus: 399,
      startingHotel: 4500,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
      routes: "Pune ⇄ Mumbai • Goa ⇄ Mumbai",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/50 pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Brand Eyebrow */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Multi-Modal Travel Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              One trip. Every booking. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                One place.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal">
              Book transportation, hotels, and local cabs under a single chronological itinerary. No more fragmented apps or lost tickets.
            </p>
          </div>

          {/* Centered Search Engine Component */}
          <SearchSwitcher />
        </div>
      </section>

      {/* THE PROBLEM VS ORIVYA SOLUTION SECTION */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
              Why ORIVYA?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Say goodbye to fragmented travel planning
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Traditional travel requires juggling 4 different apps, tracking disparate booking codes, and manual coordination. ORIVYA unifies the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* The Messy Way */}
            <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider">
                  The Fragmented Way
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  "Search Bus on App A, verify seat availability",
                  "Open Hotel App B, match check-in date with bus arrival",
                  "Scramble for local station taxi upon arrival at 7:00 AM",
                  "Screenshot 4 separate PDF tickets and reference numbers",
                  "Deal with separate cancellation policies and refund disputes",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
                      ✕
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle arrow indicator */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <ArrowRight className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 mt-2">ORIVYA TRIP</span>
            </div>

            {/* The ORIVYA Way */}
            <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-[#0B0F19] text-white shadow-xl shadow-indigo-950/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base font-bold text-emerald-300 uppercase tracking-wider">
                    The ORIVYA Unified Trip
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-400/30">
                  Pune ➔ Goa
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bus className="h-4 w-4 text-indigo-400" />
                    <span>02 Oct • 21:30 | VRL Travels (L2A, L2B)</span>
                  </div>
                  <span className="text-emerald-400 font-bold">CONFIRMED ✓</span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Car className="h-4 w-4 text-amber-400" />
                    <span>03 Oct • 08:15 | Station ➔ SeaView Resort</span>
                  </div>
                  <span className="text-amber-400 font-bold">SCHEDULED</span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Hotel className="h-4 w-4 text-violet-400" />
                    <span>03-06 Oct | SeaView Beachfront Resort</span>
                  </div>
                  <span className="text-emerald-400 font-bold">CONFIRMED ✓</span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bus className="h-4 w-4 text-indigo-400" />
                    <span>06 Oct • 20:00 | IntrCity Return (U1A, U1B)</span>
                  </div>
                  <span className="text-emerald-400 font-bold">CONFIRMED ✓</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">Single Master Pass & QR</span>
                <Link
                  href="/trips/trip-goa-vacation-2026"
                  className="text-xs font-bold text-indigo-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  View Sample Trip <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR PILLARS SHOWCASE */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
              The 4 Core Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Engineered with production-grade detail
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Explore how each service module is purpose-built to deliver deep domain capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bus Card */}
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Bus className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bus Booking</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Interactive multi-deck seat layout with single sleeper, double sleeper, and female-only seat protection.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>5-min temporary seat locking</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Live boarding & drop points</span>
                  </div>
                </div>
              </div>
              <Link
                href="/bus"
                className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Book Bus Seats</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Train Card */}
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Train className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Train Booking</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Accurate class availability simulation (SL, 3A, 2A, 1A) with PNR status generator and full route halt times.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Simulated IRCTC Quotas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Station-to-station schedule</span>
                  </div>
                </div>
              </div>
              <Link
                href="/train"
                className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Search Trains</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Hotel Card */}
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Hotel className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Hotel & Resorts</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Real-time room tier breakdown (Deluxe, Club, Presidential Suite) with transparent tax calculation.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>High-res imagery & amenities</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Instant check-in voucher</span>
                  </div>
                </div>
              </div>
              <Link
                href="/hotels"
                className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Explore Stays</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Cab Card */}
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Local Cabs</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Instant local transfer dispatch from railway station or bus terminals directly to your resort or hotel.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Mini, Sedan, SUV Prime fleet</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Live ride lifecycle simulation</span>
                  </div>
                </div>
              </div>
              <Link
                href="/cabs"
                className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Book Transfers</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS GRID */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
                Trending Getaways
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Popular destinations in India
              </h2>
            </div>
            <Link
              href="/bus?from=Pune&to=Goa"
              className="mt-4 sm:mt-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
            >
              <span>Explore all routes</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.city}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 backdrop-blur-xs">
                      {dest.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-xl font-bold leading-tight">{dest.city}</h3>
                    <p className="text-xs text-slate-300">{dest.state}</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-500 font-medium">{dest.routes}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Buses from</span>
                      <span className="font-bold text-slate-900">{formatCurrency(dest.startingBus)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Stays from</span>
                      <span className="font-bold text-slate-900">{formatCurrency(dest.startingHotel)}/night</span>
                    </div>
                  </div>

                  <Link
                    href={`/bus?from=Pune&to=${dest.city}`}
                    className="w-full mt-2 inline-flex items-center justify-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-bold text-slate-700 transition-colors"
                  >
                    View Journeys
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
