"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Hotel, 
  MapPin, 
  Star, 
  Wifi, 
  Coffee, 
  Waves, 
  CheckCircle2, 
  Calendar, 
  Users, 
  ChevronRight, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { MOCK_HOTEL_PROPERTIES } from "@/lib/data/mockHotels";
import { HotelProperty, HotelRoom } from "@/types";
import { formatCurrency } from "@/lib/utils";

function HotelSearchContent() {
  const searchParams = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") || "Goa");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "2026-10-02");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "2026-10-05");
  const [guests, setGuests] = useState(searchParams.get("guests") || "2");

  const [selectedHotel, setSelectedHotel] = useState<HotelProperty | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Calculate nights
  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    ) || 3
  );

  const hotels = MOCK_HOTEL_PROPERTIES.filter(
    (h) => h.city.toLowerCase() === city.toLowerCase()
  );

  const handleBookRoom = (room: HotelRoom) => {
    setSelectedRoom(room);
  };

  const handleConfirmReservation = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedHotel(null);
      setSelectedRoom(null);
      alert("Hotel reservation confirmed and synced to your trip timeline!");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* SEARCH HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100">
                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                {city}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {checkIn} ➔ {checkOut} ({nights} Nights)
              </span>
              <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {guests} Guests
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ✓ Free Cancellation on Select Rooms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HOTELS LIST */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Found {hotels.length} verified stays in {city}</span>
          <span>Transparent Pricing (Taxes calculated upfront)</span>
        </div>

        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Hotel Image Gallery Preview */}
              <div className="lg:col-span-4 h-64 lg:h-auto relative overflow-hidden">
                <img
                  src={hotel.heroImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-1">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Hotel Info & Amenities */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{hotel.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{hotel.address}</p>
                  <p className="text-xs text-slate-600 italic mt-1 leading-relaxed">
                    "{hotel.tagline}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {hotel.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span>Check-in: {hotel.checkInTime}</span>
                  <span>•</span>
                  <span>Check-out: {hotel.checkOutTime}</span>
                </div>
              </div>

              {/* Pricing & Room Selection Trigger */}
              <div className="lg:col-span-3 p-6 bg-slate-50/60 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-7 px-2 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                      {hotel.guestRating} / 5
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      Excellent ({hotel.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">Starts from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatCurrency(hotel.minPricePerNight)}
                    </span>
                    <span className="text-xs text-slate-500">/ night</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {nights} nights: ~{formatCurrency(hotel.minPricePerNight * nights)} + taxes
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setSelectedRoom(hotel.rooms[0]);
                    }}
                    className="w-full mt-3 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>VIEW ROOMS</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROOM CUSTOMIZATION & RESERVATION MODAL */}
      {selectedHotel && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden space-y-6">
            <div className="bg-[#0B0F19] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  HOTEL RESERVATION
                </span>
                <h3 className="text-lg font-bold">{selectedHotel.name}</h3>
                <p className="text-xs text-slate-400">
                  {nights} Nights ({checkIn} ➔ {checkOut})
                </p>
              </div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Room Tier Options */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Room Category
                </label>
                <div className="space-y-3">
                  {selectedHotel.rooms.map((room) => {
                    const isSelected = selectedRoom.id === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-amber-600 bg-amber-50/40 ring-2 ring-amber-500/20"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{room.name}</h4>
                          <span className="text-sm font-extrabold text-amber-700">
                            {formatCurrency(room.pricePerNight)} / night
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{room.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-[10px] font-semibold text-slate-600">
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Bed: {room.bedType}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">{room.sizeSqFt} sq.ft</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded">Max: {room.maxAdults} Adults</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Room Charge ({nights} nights × {formatCurrency(selectedRoom.pricePerNight)})</span>
                  <span>{formatCurrency(selectedRoom.pricePerNight * nights)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes (12% Luxury Hospitality GST)</span>
                  <span>{formatCurrency(Math.round(selectedRoom.pricePerNight * nights * 0.12))}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-amber-700 text-lg">
                    {formatCurrency(
                      selectedRoom.pricePerNight * nights +
                        Math.round(selectedRoom.pricePerNight * nights * 0.12)
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={bookingConfirmed}
                onClick={handleConfirmReservation}
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
              >
                {bookingConfirmed ? (
                  <span>Generating Voucher & Syncing Trip...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>CONFIRM & BOOK HOTEL ROOM</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Hotel className="h-10 w-10 text-amber-600 animate-bounce" />
        </div>
      }
    >
      <HotelSearchContent />
    </Suspense>
  );
}
