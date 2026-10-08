"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Ticket, 
  Bus, 
  Train, 
  Hotel, 
  Car, 
  Calendar, 
  MapPin, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Printer, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useTravelStore } from "@/lib/store";
import { Booking } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import QRCode from "qrcode";

export default function BookingsPage() {
  const { bookings, cancelBooking } = useTravelStore();
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [ticketQrUrl, setTicketQrUrl] = useState<string>("");
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [refundAlert, setRefundAlert] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedBookingForPass(null);
        setCancellingBookingId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenDigitalPass = async (booking: Booking) => {
    setSelectedBookingForPass(booking);
    try {
      const qrData = JSON.stringify({
        ref: booking.referenceNumber,
        service: booking.bookingType,
        amount: booking.totalAmount,
        seats: booking.details.seats || ["1"],
        status: booking.status,
      });
      const url = await QRCode.toDataURL(qrData, { width: 220, margin: 1 });
      setTicketQrUrl(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmCancel = async (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    try {
      if (targetBooking) {
        await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalAmount: targetBooking.totalAmount,
            referenceNumber: targetBooking.referenceNumber,
          }),
        });
      }
    } catch (err) {
      console.error("Server cancellation error:", err);
    }

    const result = cancelBooking(bookingId);
    setRefundAlert(result);
    setCancellingBookingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}
        <div className="pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Ticket className="h-3.5 w-3.5" />
            <span>Digital Passes & Invoices</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings & Tickets
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Access scannable digital passes, QR boarding codes, and manage cancellations & instant refunds.
          </p>
        </div>

        {/* REFUND NOTIFICATION BANNER */}
        {refundAlert && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
              refundAlert.success
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{refundAlert.message}</span>
            </div>
            <button
              onClick={() => setRefundAlert(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* BOOKINGS CARDS LIST */}
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "CANCELLED";

            return (
              <div
                key={booking.id}
                className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {booking.referenceNumber}
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-md ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : booking.status === "CANCELLED"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {booking.status === "CONFIRMED" && "✓ "}
                      {booking.status}
                    </span>

                    <span className="text-xs text-slate-400">
                      Booked on {formatDate(booking.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {booking.bookingType.toUpperCase()} Reservation
                      {booking.details.busSchedule && ` • ${booking.details.busSchedule.operator.name}`}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {booking.passengers.length} Passenger(s):{" "}
                      {booking.passengers.map((p) => p.fullName).join(", ")}
                      {booking.details.seats && ` (Seats: ${booking.details.seats.join(", ")})`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                    <span>
                      Payment: <strong>{booking.paymentMethod}</strong> (
                      {booking.paymentStatus})
                    </span>
                    <span>
                      Total: <strong>{formatCurrency(booking.totalAmount)}</strong>
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleOpenDigitalPass(booking)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-xs transition-colors"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>View Pass & QR</span>
                  </button>

                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => setCancellingBookingId(booking.id)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                    >
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DIGITAL TICKET & QR CODE MODAL */}
      {selectedBookingForPass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/35 backdrop-blur-xs"
          onClick={() => setSelectedBookingForPass(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STICKY HEADER WITH ALWAYS VISIBLE BACK BUTTON & CLOSE */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForPass(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shrink-0"
                  title="Return to bookings list"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-600" />
                  <span>Back to Bookings</span>
                </button>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 block">
                    ORIVYA VERIFIED PASS
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">{selectedBookingForPass.referenceNumber}</h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingForPass(null)}
                aria-label="Close"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="p-4 sm:p-6 space-y-6 text-center overflow-y-auto flex-1 overscroll-contain">
              {ticketQrUrl && (
                <div className="flex flex-col items-center">
                  <img
                    src={ticketQrUrl}
                    alt="Ticket QR"
                    className="w-44 h-44 rounded-2xl border-2 border-slate-200 p-2 shadow-sm bg-white"
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-2 font-medium">
                    Scannable Digital Verification Hash
                  </span>
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Status:</span>
                  <span className="font-bold text-emerald-700">{selectedBookingForPass.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {selectedBookingForPass.bookingType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Fare:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(selectedBookingForPass.totalAmount)}
                  </span>
                </div>
                {selectedBookingForPass.details.seats && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seats:</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {selectedBookingForPass.details.seats.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION ROW */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedBookingForPass(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Bookings</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="h-4 w-4" />
                <span>Print Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION CONFIRMATION DIALOG */}
      {cancellingBookingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/35 backdrop-blur-xs"
          onClick={() => setCancellingBookingId(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Confirm Cancellation</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this booking? According to the operator policy:
            </p>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p>• Cancellation Charge: <strong>₹150</strong></p>
              <p>• Net refund will be credited instantly to your original payment method / wallet.</p>
              <p>• The corresponding itinerary segment in your Unified Trip will be marked cancelled.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBookingId(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Keep Booking</span>
              </button>
              <button
                type="button"
                onClick={() => handleConfirmCancel(cancellingBookingId)}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
              >
                YES, CANCEL & REFUND
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
