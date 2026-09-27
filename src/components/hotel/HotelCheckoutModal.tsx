"use client";

import React, { useState } from "react";
import { HotelProperty, HotelRoom, Passenger, Booking } from "@/types";
import { useTravelStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { CouponService } from "@/services/couponService";
import { 
  Building2, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Wallet, 
  QrCode,
  Tag,
  Calendar,
  Users,
  MapPin,
  Star,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import Link from "next/link";

interface HotelCheckoutModalProps {
  hotel: HotelProperty;
  room: HotelRoom;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  onClose: () => void;
}

export const HotelCheckoutModal: React.FC<HotelCheckoutModalProps> = ({
  hotel,
  room,
  checkIn,
  checkOut,
  nights,
  guestsCount,
  onClose,
}) => {
  const { user } = useAuth();
  const { addBooking } = useTravelStore();

  const [leadGuestName, setLeadGuestName] = useState(user?.name || "Vijay Sharma");
  const [leadGuestEmail, setLeadGuestEmail] = useState(user?.email || "vijay.traveler@example.com");
  const [leadGuestPhone, setLeadGuestPhone] = useState(user?.phone || "+91 98765 43210");
  const [specialRequests, setSpecialRequests] = useState("Quiet room on high floor, non-smoking");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CREDIT_CARD" | "WALLET">("UPI");

  // Promo code state
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const roomSubtotal = room.pricePerNight * nights;
  const taxes = Math.round(roomSubtotal * 0.12); // 12% Hospitality GST
  const serviceFee = 99;
  const upiDiscount = paymentMethod === "UPI" ? 50 : 0;
  const totalPayable = Math.max(0, roomSubtotal + taxes + serviceFee - upiDiscount - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = CouponService.validateCoupon({
      code: couponCode.trim(),
      subtotal: roomSubtotal,
      serviceType: "hotel",
    });

    if (res.valid) {
      setCouponDiscount(res.discountAmount);
      setCouponMsg({ text: `Coupon applied: ₹${res.discountAmount} savings!`, isError: false });
    } else {
      setCouponDiscount(0);
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      const bookingRef = `ORV-HTL-${Math.floor(100000 + Math.random() * 900000)}`;

      const booking: Booking = {
        id: `bk-htl-${Date.now()}`,
        referenceNumber: bookingRef,
        userId: user?.id || "user-default-01",
        bookingType: "hotel",
        status: "CONFIRMED",
        paymentStatus: "PAID",
        baseAmount: roomSubtotal,
        taxAmount: taxes,
        convenienceFee: serviceFee,
        discountAmount: upiDiscount + couponDiscount,
        totalAmount: totalPayable,
        paymentMethod: paymentMethod as any,
        createdAt: new Date().toISOString(),
        contactEmail: leadGuestEmail,
        contactPhone: leadGuestPhone,
        passengers: [
          {
            id: "p1",
            fullName: leadGuestName,
            age: 30,
            gender: "male",
            roomName: room.name,
          },
        ],
        details: {
          hotel,
          room,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          nightsCount: nights,
          roomsCount: 1,
        },
      };

      const qrData = JSON.stringify({
        ref: bookingRef,
        hotel: hotel.name,
        room: room.name,
        guest: leadGuestName,
        checkIn,
        checkOut,
        nights,
        status: "CONFIRMED",
      });

      const qrUrl = await QRCode.toDataURL(qrData, { width: 240, margin: 1 });
      setQrCodeDataUrl(qrUrl);
      addBooking(booking, hotel.city);
      setConfirmedBooking(booking);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to confirm hotel reservation.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {confirmedBooking ? "Hotel Reservation Confirmed!" : `Book ${hotel.name}`}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>{room.name}</span>
                <span>•</span>
                <span>{nights} Nights ({checkIn} ➔ {checkOut})</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* CONFIRMATION E-VOUCHER */
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-base font-bold text-emerald-900">Stay Reserved Successfully!</h4>
              <p className="text-emerald-700 font-mono mt-1 font-bold">
                Booking Voucher: {confirmedBooking.referenceNumber}
              </p>
              <p className="text-emerald-600 text-[11px] mt-0.5">
                Automatically synced into your multi-modal trip timeline.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-center gap-6 text-xs">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-bold text-slate-900">{hotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-700">{hotel.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Category:</span>
                  <span className="font-bold text-amber-700">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-in:</span>
                  <span className="font-semibold text-slate-800">{checkIn} ({hotel.checkInTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-out:</span>
                  <span className="font-semibold text-slate-800">{checkOut} ({hotel.checkOutTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Guest:</span>
                  <span className="font-bold text-slate-900">{leadGuestName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">Total Paid:</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(confirmedBooking.totalAmount)}</span>
                </div>
              </div>

              {qrCodeDataUrl && (
                <div className="text-center shrink-0">
                  <img src={qrCodeDataUrl} alt="Hotel Check-in QR" className="w-32 h-32 rounded-xl border border-slate-200 p-1" />
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">Present at Front Desk</span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Front Desk Guidelines:</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Government photo ID required at check-in for all adult guests. Free Wi-Fi access credentials will be provided upon arrival.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/trips"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs text-center shadow-md shadow-amber-600/20"
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
          /* RESERVATION CHECKOUT FORM */
          <form onSubmit={handleConfirmReservation} className="p-6 space-y-6">
            {/* STAY SUMMARY CARD */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{hotel.name}</h4>
                  <p className="text-xs text-slate-500">{hotel.address}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-100/70 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{hotel.starRating} Star</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">CHECK-IN</span>
                  <span className="font-bold text-slate-800">{checkIn}</span>
                  <span className="text-[10px] text-slate-500 block">From {hotel.checkInTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CHECK-OUT</span>
                  <span className="font-bold text-slate-800">{checkOut}</span>
                  <span className="text-[10px] text-slate-500 block">Until {hotel.checkOutTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DURATION</span>
                  <span className="font-bold text-amber-700">{nights} Nights</span>
                  <span className="text-[10px] text-slate-500 block">{guestsCount} Guests</span>
                </div>
              </div>
            </div>

            {/* GUEST DETAILS */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                Primary Guest Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={leadGuestName}
                    onChange={(e) => setLeadGuestName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={leadGuestEmail}
                    onChange={(e) => setLeadGuestEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={leadGuestPhone}
                    onChange={(e) => setLeadGuestPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Special Request (Optional)</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* PROMO CODE SECTION */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GOA500, ORIVYA100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs font-mono uppercase p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs font-semibold ${couponMsg.isError ? "text-rose-600" : "text-emerald-600"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* PAYMENT METHOD SELECTION */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "UPI", label: "UPI Instant", sub: "Save ₹50", icon: Smartphone },
                  { id: "CREDIT_CARD", label: "Cards", sub: "Credit/Debit", icon: CreditCard },
                  { id: "WALLET", label: "Wallet", sub: "Orivya Pay", icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`h-4 w-4 mb-1.5 ${isSelected ? "text-amber-600" : "text-slate-500"}`} />
                      <p className="text-xs font-bold text-slate-900">{item.label}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">{item.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIVE FARE BREAKDOWN */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Room Charges ({nights} nights × {formatCurrency(room.pricePerNight)})</span>
                <span>{formatCurrency(roomSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hospitality GST (12%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sanitation & Service Fee</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
              {upiDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>UPI Payment Discount</span>
                  <span>- {formatCurrency(upiDiscount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Code Savings</span>
                  <span>- {formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount Payable</span>
                <span className="text-amber-700 text-lg font-extrabold">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            {/* CONFIRM BUTTON */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Confirming Reservation & Syncing Trip...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>PAY {formatCurrency(totalPayable)} & CONFIRM STAY</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
