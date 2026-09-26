"use client";

import React, { useState } from "react";
import { 
  BusSeat, 
  BusSchedule, 
  BusPoint, 
  DeckType 
} from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Check, ShieldAlert, Sparkles, MapPin } from "lucide-react";

interface SeatMapProps {
  schedule: BusSchedule;
  seats: BusSeat[];
  selectedSeatNumbers: string[];
  onToggleSeat: (seatNumber: string, price: number) => void;
  onProceedToBooking: (boarding: BusPoint, dropping: BusPoint) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  schedule,
  seats,
  selectedSeatNumbers,
  onToggleSeat,
  onProceedToBooking,
}) => {
  const [activeDeck, setActiveDeck] = useState<DeckType>("lower");
  const [selectedBoarding, setSelectedBoarding] = useState<BusPoint>(schedule.boardingPoints[0]);
  const [selectedDropping, setSelectedDropping] = useState<BusPoint>(schedule.droppingPoints[0]);

  const deckSeats = seats.filter((s) => s.deck === activeDeck);
  // Group by rows (1 to 5)
  const rows = [1, 2, 3, 4, 5];

  const totalAmount = selectedSeatNumbers.reduce((sum, seatNum) => {
    const seatObj = seats.find((s) => s.seatNumber === seatNum);
    return sum + (seatObj?.price || schedule.basePrice);
  }, 0);

  return (
    <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 lg:p-8 animate-in slide-in-from-top-2 duration-300">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: INTERACTIVE BUS DECK */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          {/* Deck Toggle & Orientation */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveDeck("lower")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDeck === "lower"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Lower Deck
              </button>
              <button
                type="button"
                onClick={() => setActiveDeck("upper")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDeck === "upper"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Upper Deck
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span>Steering / Front</span>
              <div className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </div>

          {/* Bus Physical Shell Visualization */}
          <div className="mt-6 border-2 border-slate-300 rounded-3xl p-4 bg-slate-50/60 relative">
            {/* Driver Cabin */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-300 text-[11px] font-semibold text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  🚪
                </div>
                <span>Entry Door</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Driver Cabin</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                  🕹️
                </div>
              </div>
            </div>

            {/* Berths Matrix */}
            <div className="space-y-3.5">
              {rows.map((rowNum) => {
                const singleSeat = deckSeats.find((s) => s.row === rowNum && s.col === 1);
                const doubleLeft = deckSeats.find((s) => s.row === rowNum && s.col === 2);
                const doubleRight = deckSeats.find((s) => s.row === rowNum && s.col === 3);

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-4">
                    {/* Left Single Berth */}
                    <div className="w-1/3">
                      {singleSeat && (
                        <SeatBerth
                          seat={singleSeat}
                          isSelected={selectedSeatNumbers.includes(singleSeat.seatNumber)}
                          onSelect={() => onToggleSeat(singleSeat.seatNumber, singleSeat.price)}
                        />
                      )}
                    </div>

                    {/* Aisle Walkway */}
                    <div className="text-[10px] text-slate-300 font-mono select-none uppercase tracking-widest text-center px-1">
                      Aisle
                    </div>

                    {/* Right Double Berths */}
                    <div className="w-1/2 flex items-center gap-2">
                      {doubleLeft && (
                        <div className="flex-1">
                          <SeatBerth
                            seat={doubleLeft}
                            isSelected={selectedSeatNumbers.includes(doubleLeft.seatNumber)}
                            onSelect={() => onToggleSeat(doubleLeft.seatNumber, doubleLeft.price)}
                          />
                        </div>
                      )}
                      {doubleRight && (
                        <div className="flex-1">
                          <SeatBerth
                            seat={doubleRight}
                            isSelected={selectedSeatNumbers.includes(doubleRight.seatNumber)}
                            onSelect={() => onToggleSeat(doubleRight.seatNumber, doubleRight.price)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Status Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-7 rounded border border-slate-300 bg-white" />
              <span className="text-slate-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-7 rounded bg-indigo-600 border border-indigo-700 text-white flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
              <span className="text-slate-900 font-semibold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-7 rounded bg-slate-200 border border-slate-300" />
              <span className="text-slate-400">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-7 rounded border border-pink-300 bg-pink-50" />
              <span className="text-pink-600 font-medium">Female Only</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOARDING/DROPPING & FARE SUMMARY */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              Boarding & Dropping Points
            </h4>

            {/* Boarding Point Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Boarding Point ({schedule.fromCity})
              </label>
              <select
                value={selectedBoarding.location}
                onChange={(e) => {
                  const pt = schedule.boardingPoints.find((p) => p.location === e.target.value);
                  if (pt) setSelectedBoarding(pt);
                }}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:outline-none focus:border-indigo-500"
              >
                {schedule.boardingPoints.map((pt) => (
                  <option key={pt.location} value={pt.location}>
                    {pt.time} - {pt.location} ({pt.landmark})
                  </option>
                ))}
              </select>
            </div>

            {/* Dropping Point Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Dropping Point ({schedule.toCity})
              </label>
              <select
                value={selectedDropping.location}
                onChange={(e) => {
                  const pt = schedule.droppingPoints.find((p) => p.location === e.target.value);
                  if (pt) setSelectedDropping(pt);
                }}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:outline-none focus:border-indigo-500"
              >
                {schedule.droppingPoints.map((pt) => (
                  <option key={pt.location} value={pt.location}>
                    {pt.time} - {pt.location} ({pt.landmark})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selection Checkout Card */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0B0F19] text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Selected Berths
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {selectedSeatNumbers.length > 0
                  ? selectedSeatNumbers.join(", ")
                  : "None chosen"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Base Fare ({selectedSeatNumbers.length} seats)</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Estimated Taxes (GST 5%)</span>
              <span>{formatCurrency(Math.round(totalAmount * 0.05))}</span>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total Payable</span>
                <span className="text-2xl font-extrabold text-white">
                  {formatCurrency(totalAmount + Math.round(totalAmount * 0.05))}
                </span>
              </div>

              <button
                type="button"
                disabled={selectedSeatNumbers.length === 0}
                onClick={() => onProceedToBooking(selectedBoarding, selectedDropping)}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                CONTINUE TO BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual sleeper berth representation
const SeatBerth = ({
  seat,
  isSelected,
  onSelect,
}: {
  seat: BusSeat;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const isBooked = seat.status === "booked";
  const isFemaleOnly = seat.status === "female_only";

  let bgClass = "bg-white border-slate-300 text-slate-700 hover:border-indigo-400 hover:shadow-xs";
  if (isSelected) {
    bgClass = "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-500/25";
  } else if (isBooked) {
    bgClass = "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed";
  } else if (isFemaleOnly) {
    bgClass = "bg-pink-50 border-pink-300 text-pink-700 hover:border-pink-500";
  }

  return (
    <button
      type="button"
      disabled={isBooked}
      onClick={onSelect}
      className={`w-full h-14 rounded-xl border flex flex-col justify-between p-1.5 transition-all text-left relative ${bgClass}`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-mono font-bold leading-none">
          {seat.seatNumber}
        </span>
        {isSelected ? (
          <Check className="h-3 w-3 stroke-[3]" />
        ) : isFemaleOnly ? (
          <span className="text-[9px] font-bold text-pink-600">♀</span>
        ) : null}
      </div>

      <div className="flex items-center justify-between w-full text-[9px] font-semibold leading-none">
        <span>{formatCurrency(seat.price)}</span>
        <span className="opacity-70 text-[8px] uppercase">
          {seat.tier === "sleeper" ? "Sleep" : "Seat"}
        </span>
      </div>
    </button>
  );
};
