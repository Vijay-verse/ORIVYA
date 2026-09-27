"use client";

import React, { useState, useEffect } from "react";
import { 
  BusSchedule, 
  BusPoint, 
  Passenger, 
  Booking 
} from "@/types";
import { useTravelStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";
import { 
  Clock, 
  ShieldCheck, 
  User, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Building, 
  CheckCircle2, 
  X, 
  Ticket, 
  ArrowRight,
  AlertTriangle,
  QrCode
} from "lucide-react";
import QRCode from "qrcode";
import Link from "next/link";

interface BusCheckoutModalProps {
  schedule: BusSchedule;
  selectedSeats: string[];
  boardingPoint: BusPoint;
  droppingPoint: BusPoint;
  onClose: () => void;
}

export const BusCheckoutModal: React.FC<BusCheckoutModalProps> = ({
  schedule,
  selectedSeats,
  boardingPoint,
  droppingPoint,
  onClose,
}) => {
  const { user, holdSeats, releaseHeldSeats, createBusBooking } = useTravelStore();

  // 5-minute countdown (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isLocked, setIsLocked] = useState(true);

  // Initialize passenger list based on selected seats
  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats.map((seatNum, idx) => ({
      id: `p-${idx}`,
      fullName: idx === 0 ? user.name : "",
      age: idx === 0 ? 28 : 25,
      gender: idx === 0 ? "male" : "female",
      seatNumber: seatNum,
    }))
  );

  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET"
  >("UPI");
  const [upiId, setUpiId] = useState("vijay@okaxis");
  const [cardNumber, setCardNumber] = useState("4111 •••• •••• 4242");

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const [holdToken, setHoldToken] = useState<string>("");

  // Lock seats on mount via server API
  useEffect(() => {
    fetch("/api/bus/hold-seat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        busTripId: schedule.id,
        seatNumbers: selectedSeats,
        userId: user.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.holdToken) {
          setHoldToken(data.holdToken);
        }
      })
      .catch((e) => console.error("Seat hold API error:", e));

    holdSeats(schedule.id, selectedSeats);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      releaseHeldSeats(schedule.id);
    };
  }, [schedule.id, selectedSeats]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const baseFare = schedule.basePrice * selectedSeats.length;
  const taxes = Math.round(baseFare * 0.05);
  const fee = 49;
  const discount = paymentMethod === "UPI" ? 50 : 0;
  const totalPayable = baseFare + taxes + fee - discount;

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, [field]: value } : p))
    );
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      alert("Your seat hold has expired. Please select seats again.");
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Submit to server-side booking API
      const response = await fetch("/api/bus/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule,
          selectedSeats,
          passengers,
          boardingPoint,
          droppingPoint,
          paymentMethod,
          holdToken,
          userId: user.id,
          contactEmail: user.email,
          contactPhone: user.phone,
        }),
      });

      const serverRes = await response.json();
      if (!serverRes.success) {
        throw new Error(serverRes.error || "Server failed to verify payment");
      }

      // 2. Sync to local/session trip store
      const booking = await createBusBooking({
        schedule,
        selectedSeats,
        passengers,
        boardingPoint,
        droppingPoint,
        paymentMethod,
        tripTitle: `${schedule.toCity} Vacation`,
      });

      // 3. Generate live QR code for ticket verification
      const qrData = JSON.stringify({
        ref: booking.referenceNumber,
        operator: schedule.operator.name,
        route: `${schedule.fromCity} -> ${schedule.toCity}`,
        date: schedule.date,
        seats: selectedSeats,
        passengers: passengers.map((p) => p.fullName),
        verified: true,
      });

      const qrUrl = await QRCode.toDataURL(qrData, { width: 250, margin: 1 });
      setQrCodeDataUrl(qrUrl);
      setConfirmedBooking(booking);

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      alert("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {confirmedBooking ? "Booking Confirmed!" : "Review & Complete Booking"}
              </h3>
              <p className="text-xs text-slate-500">
                {schedule.operator.name} • {schedule.fromCity} ➔ {schedule.toCity}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* IF CONFIRMED: SHOW DIGITAL TICKET WITH QR CODE */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-4 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-lg font-bold text-emerald-900">Your Journey is Confirmed!</h4>
              <p className="text-xs text-emerald-700 mt-1">
                Booking Reference: <span className="font-mono font-bold">{confirmedBooking.referenceNumber}</span>
              </p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Automatically added to your <strong>Unified Trip Itinerary</strong>.
              </p>
            </div>

            {/* DIGITAL PASS TICKET DESIGN */}
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="bg-[#0B0F19] text-white p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400">
                    ORIVYA DIGITAL BOARDING PASS
                  </span>
                  <h4 className="text-xl font-extrabold">{schedule.operator.name}</h4>
                  <p className="text-xs text-slate-400">{schedule.busType}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Date</span>
                  <span className="text-sm font-bold text-white">{schedule.date}</span>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Route & Times */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Departure
                      </span>
                      <p className="text-base font-bold text-slate-900">{schedule.departureTime}</p>
                      <p className="text-xs font-semibold text-slate-700">{boardingPoint.location}</p>
                      <p className="text-[11px] text-slate-500">{boardingPoint.landmark}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Arrival (Next Day)
                      </span>
                      <p className="text-base font-bold text-slate-900">{schedule.arrivalTime}</p>
                      <p className="text-xs font-semibold text-slate-700">{droppingPoint.location}</p>
                      <p className="text-[11px] text-slate-500">{droppingPoint.landmark}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Seats Allocated
                      </span>
                      <span className="text-sm font-mono font-bold text-indigo-600">
                        {selectedSeats.join(", ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Passengers
                      </span>
                      <span className="font-semibold text-slate-800">
                        {passengers.map((p) => p.fullName).join(", ")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Total Paid
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(confirmedBooking.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-center">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Ticket Verification QR Code"
                      className="w-32 h-32 rounded-xl shadow-xs border border-slate-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-slate-100 flex items-center justify-center">
                      <QrCode className="h-10 w-10 text-slate-400" />
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">
                    Scan for Onboard Verification
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/trips"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center shadow-lg shadow-indigo-600/30 transition-all"
              >
                VIEW IN MY TRIPS TIMELINE
              </Link>
              <Link
                href="/bookings"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors"
              >
                VIEW ALL BOOKINGS
              </Link>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM & SEAT LOCK ACTIVE */
          <form onSubmit={handleConfirmPayment} className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* 5-MINUTE LOCK NOTICE BAR */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                <span className="font-semibold">
                  Seats held temporarily. Complete your booking before timer expires:
                </span>
              </div>
              <span className="font-mono font-bold text-sm bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 text-amber-800">
                {formattedTime}
              </span>
            </div>

            {/* PASSENGERS DETAILS */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Passenger Details ({selectedSeats.length} Travellers)
              </h4>

              {passengers.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Passenger {idx + 1}</span>
                    <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Seat: {p.seatNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Full Name (as per Govt ID)
                      </label>
                      <input
                        type="text"
                        required
                        value={p.fullName}
                        onChange={(e) => handlePassengerChange(idx, "fullName", e.target.value)}
                        placeholder="e.g. Vijay Sharma"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={p.age}
                        onChange={(e) =>
                          handlePassengerChange(idx, "age", parseInt(e.target.value) || 20)
                        }
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Gender
                      </label>
                      <select
                        value={p.gender}
                        onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAYMENT SIMULATOR */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Payment Method (Sandbox / Test Mode)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === "UPI"
                      ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className="h-4 w-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-bold block text-slate-900">UPI Instant</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">₹50 OFF</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("WALLET")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === "WALLET"
                      ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <Wallet className="h-4 w-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-bold block text-slate-900">ORIVYA Wallet</span>
                    <span className="text-[10px] text-slate-500">Bal: {formatCurrency(user.walletBalance)}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CREDIT_CARD")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === "CREDIT_CARD"
                      ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-bold block text-slate-900">Cards</span>
                    <span className="text-[10px] text-slate-500">Credit / Debit</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("NET_BANKING")}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === "NET_BANKING"
                      ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <Building className="h-4 w-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-bold block text-slate-900">Net Banking</span>
                    <span className="text-[10px] text-slate-500">All Major Banks</span>
                  </div>
                </button>
              </div>

              {/* Dynamic input preview based on method */}
              {paymentMethod === "UPI" && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Virtual Payment Address (VPA) / UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    className="w-full text-xs font-mono font-medium p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
              )}
            </div>

            {/* FARE BREAKDOWN & SUBMIT */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({selectedSeats.length} seats)</span>
                <span>{formatCurrency(baseFare)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & GST (5%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Convenience Fee</span>
                <span>{formatCurrency(fee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>UPI Payment Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Final Total Amount</span>
                <span className="text-lg text-indigo-600">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || timeLeft <= 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Securing payment & generating ticket...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>PAY {formatCurrency(totalPayable)} & CONFIRM TICKET</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
