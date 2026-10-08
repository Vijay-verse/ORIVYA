import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — ORIVYA",
  description: "Privacy policy detailing customer data protection, encryption, and telemetry practices on ORIVYA.",
};

export default function PrivacyPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
              <Lock className="h-3.5 w-3.5" />
              <span>Data Protection & Privacy</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-2">Last updated: October 2026 • Compliant with Indian IT Act 2000 & DPDP Act</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
              <p>
                When you create an account, plan an itinerary, or purchase travel tickets on ORIVYA, we collect relevant information necessary to fulfill your bookings:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Identity Information:</strong> Passenger full name, age, gender, and contact phone number.</li>
                <li><strong>Contact Information:</strong> Email address for ticket delivery, booking receipts, and SMS/WhatsApp updates.</li>
                <li><strong>Itinerary Records:</strong> Departure origins, destinations, selected bus seat numbers, hotel room tiers, and cab pickup coordinates.</li>
                <li><strong>Payment Metadata:</strong> Transaction reference IDs, payment method category (UPI/Card), and timestamp. We never store bank passwords or debit/credit card CVVs.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. How We Use Your Data</h2>
              <p>
                Your personal information is used exclusively to transmit manifest details to your selected transport operator (e.g. bus conductor roster or hotel check-in desk), issue verifiable QR passes, calculate accurate taxes and promotional discounts, and prevent duplicate reservations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Cloud Infrastructure & Security Architecture</h2>
              <p>
                ORIVYA stores customer profiles and relational booking manifests on hardened Supabase PostgreSQL instances with Row Level Security (RLS) policies. All communication between your browser and our servers is encrypted using modern TLS 1.3 encryption.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Third-Party Service Providers</h2>
              <p>
                We do not sell, rent, or monetize your personal information to third-party advertising networks. Data is shared strictly with authorized partners directly involved in executing your itinerary:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Razorpay:</strong> Secure payment processing and settlement.</li>
                <li><strong>Transport Operators & Hoteliers:</strong> Required passenger details for travel manifest compliance.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Your Rights & Data Retention</h2>
              <p>
                You may review, download, or request deletion of your account and booking history at any time by contacting privacy@orivya.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
