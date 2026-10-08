"use client";

import React, { useState, useEffect } from "react";
import { TrainSchedule, TrainClassOption, Passenger, Booking } from "@/types";
import { useTravelStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { 
  Train, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Wallet, 
  QrCode,
  Ticket,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import Link from "next/link";

interface TrainCheckoutModalProps {
  train: TrainSchedule;
  selectedClass: TrainClassOption;
  onClose: () => void;
}

export const TrainCheckoutModal: React.FC<TrainCheckoutModalProps> = ({
  train,
  selectedClass,
  onClose,
}) => {
  const { user } = useAuth();
  const { trips, createNewTrip, addBooking } = useTravelStore();

  const [passengerName, setPassengerName] = useState(user?.name || "Vijay Sharma");
  const [passengerAge, setPassengerAge] = useState(28);
  const [passengerGender, setPassengerGender] = useState<"male" | "female" | "other">("male");
  const [berthPreference, setBerthPreference] = useState("Lower Berth");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CREDIT_CARD" | "WALLET">("UPI");

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const baseFare = selectedClass.price;
  const taxes = Math.round(baseFare * 0.05); // 5% GST
  const fee = 49;
  const discount = paymentMethod === "UPI" ? 50 : 0;
  const totalPayable = Math.max(0, baseFare + taxes + fee - discount);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      const pnrNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const bookingRef = `ORV-TRN-${Math.floor(100000 + Math.random() * 900000)}`;

      const booking: Booking = {
        id: `bk-trn-${Date.now()}`,
        referenceNumber: bookingRef,
        userId: user?.id || "user-default-01",
        bookingType: "train",
        status: "CONFIRMED",
        paymentStatus: "PAID",
        baseAmount: baseFare,
        taxAmount: taxes,
        convenienceFee: fee,
        discountAmount: discount,
        totalAmount: totalPayable,
        paymentMethod: paymentMethod as any,
        createdAt: new Date().toISOString(),
        contactEmail: user?.email || "customer@example.com",
        contactPhone: user?.phone || "+91 98765 43210",
        passengers: [
          {
            id: "p1",
            fullName: passengerName,
            age: passengerAge,
            gender: passengerGender,
            berthPreference,
            seatNumber: "B2-34 (Lower)",
          },
        ],
        details: {
          trainSchedule: train,
          selectedClass: selectedClass.classCode,
          pnrNumber,
        },
      };

      const qrData = JSON.stringify({
        ref: bookingRef,
        pnr: pnrNumber,
        train: `${train.trainName} (${train.trainNumber})`,
        class: selectedClass.classCode,
        passenger: passengerName,
        status: "CONFIRMED",
      });

      const qrUrl = await QRCode.toDataURL(qrData, { width: 240, margin: 1 });
      setQrCodeDataUrl(qrUrl);
      addBooking(booking, train.toCity);
      setConfirmedBooking(booking);

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      alert("Payment processing error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/35 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STICKY HEADER WITH ALWAYS VISIBLE BACK BUTTON & CLOSE */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shrink-0"
              title="Return to train selection"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
              <span>Back to Trains</span>
            </button>
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white font-bold shrink-0">
              <Train className="h-4 w-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {confirmedBooking ? "Train Booking Confirmed!" : `Book ${train.trainName} (#${train.trainNumber})`}
              </h3>
              <p className="text-[11px] text-slate-500 truncate">
                Class: {selectedClass.classCode} ({selectedClass.className}) • {train.fromCity} ➔ {train.toCity}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SCROLLABLE MODAL BODY */}
        <div className="overflow-y-auto flex-1 overscroll-contain">

        {confirmedBooking ? (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-emerald-900">E-Ticket Generated Successfully!</h4>
              <p className="text-emerald-700 font-mono mt-1 font-bold">
                PNR: {confirmedBooking.details.pnrNumber} • Ref: {confirmedBooking.referenceNumber}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-center gap-6 text-xs">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Train:</span>
                  <span className="font-bold text-slate-900">{train.trainName} (#{train.trainNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class:</span>
                  <span className="font-bold text-violet-700">{selectedClass.classCode} ({selectedClass.className})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passenger:</span>
                  <span className="font-bold text-slate-900">{passengerName} ({passengerAge}, {passengerGender})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coach / Berth:</span>
                  <span className="font-mono font-bold text-indigo-600">B2 - 34 (Lower Berth)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">Total Fare Paid:</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(confirmedBooking.totalAmount)}</span>
                </div>
              </div>

              {qrCodeDataUrl && (
                <div className="text-center shrink-0">
                  <img src={qrCodeDataUrl} alt="PNR QR" className="w-32 h-32 rounded-xl border border-slate-200 p-1" />
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">Simulated Scannable Pass</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href="/trips"
                className="flex-1 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs text-center"
              >
                View in My Trips
              </Link>
              <Link
                href="/bookings"
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center"
              >
                View All Passes
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="p-6 space-y-5 text-xs">
            {/* Passenger Fields */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-slate-400">Traveller Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block font-medium text-slate-600 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-medium text-slate-600 mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={passengerAge}
                    onChange={(e) => setPassengerAge(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-medium text-slate-600 mb-1">Gender</label>
                  <select
                    value={passengerGender}
                    onChange={(e) => setPassengerGender(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Berth Preference</label>
                <select
                  value={berthPreference}
                  onChange={(e) => setBerthPreference(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Lower Berth">Lower Berth</option>
                  <option value="Middle Berth">Middle Berth</option>
                  <option value="Upper Berth">Upper Berth</option>
                  <option value="Side Lower">Side Lower</option>
                  <option value="Side Upper">Side Upper</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-slate-400">Payment Option</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "UPI", label: "UPI Instant (₹50 OFF)", icon: Smartphone },
                  { id: "CREDIT_CARD", label: "Credit / Debit Card", icon: CreditCard },
                  { id: "WALLET", label: "ORIVYA Wallet", icon: Wallet },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === m.id
                        ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <m.icon className="h-4 w-4 text-violet-600 mb-1" />
                    <span className="block font-bold text-slate-800 text-[11px]">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({selectedClass.classCode})</span>
                <span>{formatCurrency(baseFare)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & IRCTC Convenience (5%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>UPI Payment Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="text-violet-700">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            {/* ACTION ROW WITH EXPLICIT BACK BUTTON AND PAY */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Trains</span>
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:flex-1 py-3.5 sm:py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? "Reserving berth & generating PNR..." : `PAY ${formatCurrency(totalPayable)} & CONFIRM TICKET`}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};
