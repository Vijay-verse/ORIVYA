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
  Users,
  Shield,
  CreditCard,
  QrCode,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { SearchSwitcher } from "@/components/search/SearchSwitcher";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const iconicCorridors = [
    {
      id: "konkan-goa",
      title: "The Konkan Coastal Corridor",
      route: "Pune ➔ Goa",
      description: "Overnight multi-deck sleeper coach through the Western Ghats, doorstep station transfer, and beachfront villa reservation.",
      tag: "Most Popular Weekend",
      modes: ["Bus", "Cab", "Hotel"],
      startingPrice: 4299,
      duration: "3 Nights / 4 Days",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      link: "/trips/trip-goa-vacation-2026",
    },
    {
      id: "mumbai-pune",
      title: "The Deccan Expressway Route",
      route: "Mumbai ➔ Pune",
      description: "Express rail corridor paired with on-demand executive sedan transfer and boutique club accommodation in Koregaon Park.",
      tag: "Business & Leisure",
      modes: ["Train", "Cab", "Hotel"],
      startingPrice: 3199,
      duration: "2 Nights / 3 Days",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
      link: "/trips",
    },
    {
      id: "hyderabad-heritage",
      title: "The Charminar & Nizami Circuit",
      route: "Pune ➔ Hyderabad",
      description: "AC sleeper coach departure with pre-scheduled chauffeur pickup and luxury palace stay with complimentary Hyderabadi breakfast.",
      tag: "Heritage Gateway",
      modes: ["Bus", "Cab", "Hotel"],
      startingPrice: 5499,
      duration: "4 Nights / 5 Days",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
      link: "/trips",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (EDITORIAL LUXURY GROUND NETWORK)                          */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#070A11] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle radial ambient illumination */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-40 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Eyebrow badge */}
          <div className="flex flex-col items-center text-center space-y-5 max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="uppercase tracking-wider font-bold text-[11px] text-white">Dedicated Ground & Hospitality Network</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-300">Zero Flights Needed</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              One Master Journey. <br />
              <span className="bg-gradient-to-r from-indigo-300 via-white to-amber-200 bg-clip-text text-transparent">
                Every Ground Booking.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Intercity sleeper buses, high-speed rail corridors, verified hotel sanctuaries, and pre-assigned station cabs — synchronized into a single, seamless digital pass.
            </p>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Razorpay Verified UPI & Cards
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" />
                5-Min Concurrency Seat Lock
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-indigo-400" />
                Single Cryptographic QR Pass
              </span>
            </div>
          </div>

          {/* Centered Luxury Search Switcher Deck */}
          <div className="relative z-20">
            <SearchSwitcher />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE SYSTEM TELEMETRY TICKER BAR                                        */}
      {/* ========================================================================= */}
      <section className="bg-[#0B0F19] text-white border-y border-slate-800 py-3.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">SUPABASE CLOUD POSTGRESQL:</span>
              <span className="text-emerald-400 font-bold">ONLINE (LATENCY: ~450ms)</span>
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <span className="hidden sm:inline">
                ACTIVE CORRIDORS: <strong className="text-white">18 ROUTES</strong>
              </span>
              <span>
                SEAT LOCK ENGINE: <strong className="text-amber-400">ATOMIC TTL (300s)</strong>
              </span>
              <span className="hidden md:inline">
                PAYMENT GATEWAY: <strong className="text-indigo-400">RAZORPAY LIVE READY</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE GROUND TRAVEL ADVANTAGE (WHY NO FLIGHTS)                           */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#FBFBFD]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>The Ground & Hospitality Philosophy</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Travel from city center to city center. No airports. No chaos.
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                A 1-hour domestic flight frequently turns into a 6-hour ordeal: 2 hours travelling to remote out-of-town airports, 90 minutes in security lines, and hefty luggage fees.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                ORIVYA connects you through <strong>luxury sleeper coaches</strong>, <strong>panoramic railway corridors</strong>, <strong>verified stays</strong>, and <strong>pre-booked transfers</strong>. Sleep comfortably overnight, wake up at your destination, and step right into your hotel room.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-2xl font-extrabold text-slate-900">0 hrs</span>
                  <span className="text-xs text-slate-500 block">Airport gate delays</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-2xl font-extrabold text-emerald-600">100%</span>
                  <span className="text-xs text-slate-500 block">Single QR itinerary pass</span>
                </div>
              </div>
            </div>

            {/* Interactive Timeline Visual */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#0B0F19] p-6 sm:p-8 text-white border border-slate-800 shadow-2xl shadow-indigo-950/20 relative overflow-hidden">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                      Live Trip Simulation
                    </span>
                    <h3 className="text-lg font-bold text-white">Pune ➔ Goa Coastal Vacation</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    CONFIRMED PASS ✓
                  </span>
                </div>

                <div className="space-y-4 pt-6">
                  {/* Leg 1: Bus */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">VRL Travels Multi-Axle Sleeper</span>
                        <span className="text-indigo-400 font-mono font-bold">Seats: L2A, L2B</span>
                      </div>
                      <p className="text-slate-400 mt-1">21:30 Swargate, Pune ➔ 07:30 Mapusa, Goa (Lower Deck Berth)</p>
                    </div>
                  </div>

                  {/* Leg 2: Cab */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">Dedicated Station Transfer</span>
                        <span className="text-amber-400 font-mono font-bold">Sedan Prime</span>
                      </div>
                      <p className="text-slate-400 mt-1">07:45 Mapusa Bus Stand ➔ SeaView Resort, Calangute (Driver Assigned)</p>
                    </div>
                  </div>

                  {/* Leg 3: Hotel */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/30">
                      <Hotel className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">SeaView Beachfront Resort</span>
                        <span className="text-violet-400 font-mono font-bold">3 Nights</span>
                      </div>
                      <p className="text-slate-400 mt-1">Deluxe Sea Facing Balcony Room • Early Check-In Synchronized</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">TOTAL MULTI-MODAL COST</span>
                    <span className="text-lg font-extrabold text-white">₹7,899 <span className="text-xs text-slate-400 font-normal">all taxes included</span></span>
                  </div>
                  <Link
                    href="/trips/trip-goa-vacation-2026"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <span>Inspect Sample Itinerary</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 4 PILLARS (DEEP CAPABILITIES)                                      */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
              The 4 Pillars of ORIVYA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Bespoke travel modules. Zero compromises.
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Each mode of travel is built with domain-specific depth, rich seat selection, and reliable pricing logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bus Module */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-400 hover:shadow-xl transition-all group">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <Bus className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Intercity Buses</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Interactive multi-deck seat layout with single sleeper, double sleeper, and female-only berth protection across VRL, SRS & Zingbus.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>5-min atomic seat locks</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Boarding & drop tracking</span>
                  </div>
                </div>
              </div>

              <Link
                href="/bus"
                className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Search Buses</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Train Module */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between hover:border-violet-400 hover:shadow-xl transition-all group">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-600/20 group-hover:scale-105 transition-transform">
                  <Train className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Railway Corridors</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Simulated multi-tier class quotas (SL, 3A, 2A, 1A) with instant 10-digit PNR lookup and full station-to-station running halt times.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Live quota simulation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>PNR confirmation status</span>
                  </div>
                </div>
              </div>

              <Link
                href="/train"
                className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-violet-600 hover:text-violet-700"
              >
                <span>Search Trains</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Hotel Module */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-400 hover:shadow-xl transition-all group">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
                  <Hotel className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Hotel & Resorts</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Curated boutique hotels, beachfront villas, and luxury resorts with room-tier breakdown, amenities, and transparent 12% GST breakdown.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Deluxe & Executive rooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Verified guest check-in</span>
                  </div>
                </div>
              </div>

              <Link
                href="/hotels"
                className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                <span>Explore Hotels</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Cab Module */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xl transition-all group">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Doorstep Cabs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hatchback, Sedan, and SUV options for airport, station, and intercity outstation transfers with fixed distance tariffs and zero surge surprises.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Pre-assigned pickup time</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Transparent distance tariff</span>
                  </div>
                </div>
              </div>

              <Link
                href="/cabs"
                className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <span>Book Cabs</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CURATED POPULAR INDIAN CORRIDORS                                       */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
                Curated Travel Circuits
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Popular Multi-Modal Routes
              </h2>
            </div>
            <Link
              href="/trips"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5"
            >
              <span>View All 18 Corridors</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {iconicCorridors.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold">
                        {c.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      {c.modes.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          {m}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{c.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">STARTING AT</span>
                    <span className="text-lg font-extrabold text-slate-900">{formatCurrency(c.startingPrice)}</span>
                  </div>

                  <Link
                    href={c.link}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                  >
                    <span>View Journey</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION FOOTER BANNER                                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-br from-[#0B0F19] via-indigo-950 to-slate-950 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-indigo-300 text-xs font-bold">
            <Compass className="h-4 w-4" />
            <span>Ready for your next ground adventure?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop juggling 4 apps. <br />
            Plan your complete trip in minutes.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Book buses, trains, hotels, and cabs under one unified order with real-time seat locks and verified Razorpay checkouts.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/bus"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-xl transition-all"
            >
              BOOK BUS SEATS NOW
            </Link>
            <Link
              href="/trips"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-colors"
            >
              EXPLORE UNIFIED ITINERARIES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
