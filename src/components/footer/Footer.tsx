import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, Clock, CreditCard, Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-200">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">One Unified Trip</h4>
              <p className="text-xs text-slate-500 mt-1">
                Bus, Train, Hotel & Cab linked together in one seamless itinerary.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Temporary Seat Lock</h4>
              <p className="text-xs text-slate-500 mt-1">
                5-minute reserved window prevents double booking while you pay.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Instant Cancellation</h4>
              <p className="text-xs text-slate-500 mt-1">
                Transparent refund calculation with automated wallet or source credit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Digital Pass & QR</h4>
              <p className="text-xs text-slate-500 mt-1">
                Scannable tickets with verified cryptographic booking hash.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-wide">ORIVYA</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multi-modal ground travel discovery, seat reservations, and trip itinerary platform.
            </p>
            <p className="text-xs font-bold text-indigo-600 mt-2">
              Plan. Book. Travel.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Services
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/bus" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Bus Booking
                </Link>
              </li>
              <li>
                <Link href="/train" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Train Reservations
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Hotel & Resort Stays
                </Link>
              </li>
              <li>
                <Link href="/cabs" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Local Cabs & Transfers
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Unified Trip Itinerary
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Popular Routes
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/bus?from=Pune&to=Goa" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Pune ⇄ Goa (VRL & Neeta)
                </Link>
              </li>
              <li>
                <Link href="/bus?from=Pune&to=Hyderabad" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Pune ⇄ Hyderabad
                </Link>
              </li>
              <li>
                <Link href="/train?from=Pune&to=Mumbai" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Pune ⇄ Mumbai (Deccan Queen)
                </Link>
              </li>
              <li>
                <Link href="/hotels?city=Goa" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Goa Beachfront Resorts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Trust & Legal
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  24/7 Concierge & Support
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold">
                  Admin Command Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Trust Badges */}
        <div className="pt-8 mt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>© {new Date().getFullYear()} ORIVYA Technologies. Dedicated Ground & Hospitality Network.</p>
            <span className="hidden sm:inline text-slate-300">•</span>
            <p className="text-slate-600 font-medium">Buses • Trains • Hotels • Cabs</p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Razorpay Secured Gateway
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Supabase Cloud Sync</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
