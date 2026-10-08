import React from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy — ORIVYA",
  description: "Transparent cancellation guidelines, operator deductions, and automated refund settlement rules for ORIVYA travellers.",
};

export default function RefundPolicyPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold mb-3">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Customer Fair Refund Promise</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cancellation & Refund Policy</h1>
            <p className="text-xs text-slate-500 mt-2">Transparent turnaround times • Automated refund processing</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Overview</h2>
              <p>
                At ORIVYA, we strive to make travel cancellations as smooth and transparent as booking. Our automated refund engine computes refunds in strict accordance with individual operator timelines and regulatory transport standards.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">2. Intercity Bus Cancellation Tiers</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-3 px-4">Cancellation Time Window</th>
                      <th className="py-3 px-4">Operator Deduction</th>
                      <th className="py-3 px-4">Refund to Traveller</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-3 px-4">More than 24 hours prior to departure</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">10% standard fee</td>
                      <td className="py-3 px-4 font-bold text-slate-900">90% of base fare</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Between 12 to 24 hours prior to departure</td>
                      <td className="py-3 px-4 font-semibold text-amber-600">25% deduction</td>
                      <td className="py-3 px-4 font-bold text-slate-900">75% of base fare</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Between 4 to 12 hours prior to departure</td>
                      <td className="py-3 px-4 font-semibold text-rose-600">50% deduction</td>
                      <td className="py-3 px-4 font-bold text-slate-900">50% of base fare</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Less than 4 hours before departure</td>
                      <td className="py-3 px-4 font-semibold text-slate-500">100% (No show)</td>
                      <td className="py-3 px-4 font-bold text-slate-900">0% (Taxes non-refundable)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Hotel & Resort Stays</h2>
              <p>
                Cancellations made 48 hours prior to official check-in time (typically 14:00 hrs) are eligible for a 100% refund on room rates. Non-refundable promotional room rates are explicitly tagged during checkout and cannot be refunded once confirmed.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Cab Transfers & Local Rides</h2>
              <p>
                Airport and station transfers may be cancelled up to 2 hours prior to the scheduled pickup timestamp without penalty. Late cancellations within 2 hours incur a flat ₹150 driver mobilization fee.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Refund Settlement Timelines</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <h3 className="font-bold text-indigo-950 text-xs uppercase tracking-wider">ORIVYA Wallet Credit</h3>
                  <p className="text-xs text-indigo-800 mt-1">Instantaneous credit (available for your next booking immediately).</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Original Payment Source (UPI/Card)</h3>
                  <p className="text-xs text-slate-600 mt-1">Settled via Razorpay within 2 to 5 business days back to your bank account.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
