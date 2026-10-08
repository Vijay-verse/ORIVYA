import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — ORIVYA",
  description: "Terms and conditions governing ground travel bookings, ticketing, and platform usage on ORIVYA.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
              <FileText className="h-3.5 w-3.5" />
              <span>Legal & Platform Agreement</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-slate-500 mt-2">Last updated: October 2026 • Effective immediately</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or booking services via ORIVYA (accessible at https://orivya.onrender.com and its affiliated domains), you agree to be bound by these Terms of Service. ORIVYA operates as a unified multi-modal ground travel aggregator facilitating bookings for intercity buses, railway corridors, verified hotel properties, and local/outstation cab transfers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Scope of Services & Intermediary Role</h2>
              <p>
                ORIVYA provides an integrated software platform allowing users to discover, plan, book, and coordinate travel inventory across independent licensed transport operators, fleet owners, and hospitality partners. ORIVYA does not own or operate buses, trains, hotels, or cab fleets directly; rather, we serve as an authorized digital aggregator and booking facilitator.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Seat Reservations & Concurrency Locking</h2>
              <p>
                To provide fair inventory allocation, ORIVYA employs a temporary 5-minute atomic seat lease mechanism upon passenger checkout. If payment is not completed before the expiration timer, held seats are automatically returned to public inventory.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Payment Processing & Security</h2>
              <p>
                All monetary transactions on ORIVYA are securely processed via authorized payment partners, including Razorpay Payment Gateway, in compliance with RBI guidelines. We support UPI (Google Pay, PhonePe, Paytm, BHIM), major credit cards, debit cards, net banking, and digital wallets. User financial credentials (such as CVV or UPI PIN) are never stored on our servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Passenger Responsibilities & Identification</h2>
              <p>
                Travellers must present valid government-issued photographic identification (Aadhaar Card, Passport, Driving License, or Voter ID) matching the passenger name on the digital QR ticket pass upon boarding buses, trains, or checking into hotel properties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">6. Limitation of Liability</h2>
              <p>
                While ORIVYA verifies all partner schedules and enforces service quality agreements, we shall not be held liable for unexpected transit delays resulting from severe weather conditions, national highway traffic bottlenecks, mechanical repairs, or railway network signaling directives beyond our reasonable control.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
