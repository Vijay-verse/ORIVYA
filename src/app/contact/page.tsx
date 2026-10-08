"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowLeft, Send, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [tripRef, setTripRef] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              <MessageSquare className="h-3.5 w-3.5" />
              <span>We're Here For You</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Support & Help Desk</h1>
            <p className="text-xs text-slate-500 mt-2">Available 24 hours a day, 7 days a week for active trip emergencies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Channels */}
            <div className="space-y-6">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Inquiries</h3>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">support@orivya.com</p>
                  <p className="text-xs text-slate-500 mt-1">Average response within 15 minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Helpline & WhatsApp</h3>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">+91 98765 43210 / 1800-ORIVYA</p>
                  <p className="text-xs text-slate-500 mt-1">Toll-free across all Indian telecom circles</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 rounded-xl bg-amber-600 text-white shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Office</h3>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">ORIVYA Travel Technologies Pvt. Ltd.</p>
                  <p className="text-xs text-slate-500 mt-1">Cyber City, Magarpatta, Pune, Maharashtra 411028</p>
                </div>
              </div>
            </div>

            {/* Quick Message Form */}
            {submitted ? (
              <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 flex flex-col items-center justify-center text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-600">
                  Thank you, <strong>{name || "Traveller"}</strong>! Your support ticket has been registered. Our concierge team will reach out to <strong>{contact || "your contact"}</strong> promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900">Send an Instant Message</h3>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vijay Sharma"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Email or Phone</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="vijay@example.com or +91 98765..."
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Trip Reference (Optional)</label>
                  <input
                    type="text"
                    value={tripRef}
                    onChange={(e) => setTripRef(e.target.value)}
                    placeholder="e.g. ORV-BUS-123456"
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist your trip?"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
