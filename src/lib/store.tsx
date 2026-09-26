"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Booking, Trip, TripItem, BusSchedule, BusPoint, Passenger, BusSeat } from "@/types";
import { INITIAL_SEED_TRIP, INITIAL_SEED_BOOKINGS } from "./data/mockTrips";
import { MOCK_BUS_SCHEDULES, generateBusSeats } from "./data/mockBuses";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  walletBalance: number;
}

interface TravelStoreContextType {
  user: UserProfile;
  trips: Trip[];
  bookings: Booking[];
  heldSeats: { [key: string]: { seatNumbers: string[]; expiresAt: number } };
  holdSeats: (scheduleId: string, seatNumbers: string[]) => boolean;
  releaseHeldSeats: (scheduleId: string) => void;
  createBusBooking: (params: {
    schedule: BusSchedule;
    selectedSeats: string[];
    passengers: Passenger[];
    boardingPoint: BusPoint;
    droppingPoint: BusPoint;
    paymentMethod: "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET";
    tripTitle?: string;
    targetTripId?: string;
  }) => Promise<Booking>;
  cancelBooking: (bookingId: string) => { success: boolean; refundAmount: number; message: string };
  getTrip: (tripId: string) => Trip | undefined;
  getBooking: (bookingIdOrRef: string) => Booking | undefined;
  createNewTrip: (title: string, destination: string, startDate: string, endDate: string) => Trip;
}

const TravelStoreContext = createContext<TravelStoreContextType | null>(null);

const STORAGE_KEY_TRIPS = "orivya_trips_v1";
const STORAGE_KEY_BOOKINGS = "orivya_bookings_v1";

export const TravelStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<UserProfile>({
    id: "user-default-01",
    name: "Vijay Sharma",
    email: "vijay.traveler@example.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    walletBalance: 1500,
  });

  const [trips, setTrips] = useState<Trip[]>([INITIAL_SEED_TRIP]);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_SEED_BOOKINGS);
  const [heldSeats, setHeldSeats] = useState<{ [key: string]: { seatNumbers: string[]; expiresAt: number } }>({});

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const savedTrips = localStorage.getItem(STORAGE_KEY_TRIPS);
      if (savedTrips) {
        setTrips(JSON.parse(savedTrips));
      }
      const savedBookings = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
    } catch (e) {
      console.error("Failed to load local travel state", e);
    }
  }, []);

  // Save changes
  const saveTrips = (updated: Trip[]) => {
    setTrips(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveBookings = (updated: Booking[]) => {
    setBookings(updated);
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Seat hold logic (5-minute lock simulation)
  const holdSeats = (scheduleId: string, seatNumbers: string[]): boolean => {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    setHeldSeats((prev) => ({
      ...prev,
      [scheduleId]: { seatNumbers, expiresAt },
    }));
    return true;
  };

  const releaseHeldSeats = (scheduleId: string) => {
    setHeldSeats((prev) => {
      const copy = { ...prev };
      delete copy[scheduleId];
      return copy;
    });
  };

  const createNewTrip = (title: string, destination: string, startDate: string, endDate: string): Trip => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      userId: user.id,
      title,
      destination,
      startDate,
      endDate,
      status: "upcoming",
      createdAt: new Date().toISOString(),
      items: [],
    };
    const updated = [newTrip, ...trips];
    saveTrips(updated);
    return newTrip;
  };

  const createBusBooking = async (params: {
    schedule: BusSchedule;
    selectedSeats: string[];
    passengers: Passenger[];
    boardingPoint: BusPoint;
    droppingPoint: BusPoint;
    paymentMethod: "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET";
    tripTitle?: string;
    targetTripId?: string;
  }): Promise<Booking> => {
    const baseFare = params.schedule.basePrice * params.selectedSeats.length;
    const taxes = Math.round(baseFare * 0.05); // 5% GST
    const fee = 49; // Convenience fee
    const discount = params.paymentMethod === "UPI" ? 50 : 0;
    const total = baseFare + taxes + fee - discount;

    const refNumber = `ORV-BUS-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookingId = `bk-bus-${Date.now()}`;

    // Target or create trip
    let tripToLink = trips.find((t) => t.id === params.targetTripId);
    if (!tripToLink) {
      // Find trip with matching destination or create one
      tripToLink = trips.find((t) => t.destination.toLowerCase() === params.schedule.toCity.toLowerCase());
      if (!tripToLink) {
        tripToLink = {
          id: `trip-${Date.now()}`,
          userId: user.id,
          title: params.tripTitle || `${params.schedule.toCity} Journey`,
          destination: params.schedule.toCity,
          startDate: params.schedule.date,
          endDate: params.schedule.date,
          status: "upcoming",
          createdAt: new Date().toISOString(),
          items: [],
        };
      }
    }

    const newBooking: Booking = {
      id: bookingId,
      referenceNumber: refNumber,
      userId: user.id,
      bookingType: "bus",
      tripId: tripToLink.id,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      baseAmount: baseFare,
      taxAmount: taxes,
      convenienceFee: fee,
      discountAmount: discount,
      totalAmount: total,
      paymentMethod: params.paymentMethod,
      createdAt: new Date().toISOString(),
      contactEmail: user.email,
      contactPhone: user.phone,
      passengers: params.passengers,
      details: {
        busSchedule: params.schedule,
        seats: params.selectedSeats,
        boardingPoint: params.boardingPoint,
        droppingPoint: params.droppingPoint,
      },
    };

    // Create corresponding Trip Item
    const newTripItem: TripItem = {
      id: `item-${Date.now()}`,
      tripId: tripToLink.id,
      bookingId: newBooking.id,
      itemType: "bus",
      title: `${params.schedule.operator.name} (${params.schedule.busType})`,
      subtitle: `${params.schedule.fromCity} ➔ ${params.schedule.toCity}`,
      location: `${params.boardingPoint.location} (${params.boardingPoint.landmark})`,
      startTime: `${params.schedule.date} • ${params.schedule.departureTime}`,
      endTime: `${params.schedule.date} • ${params.schedule.arrivalTime}`,
      status: "CONFIRMED",
      bookingRef: refNumber,
      detailsSummary: `Seats: ${params.selectedSeats.join(", ")} • Boarding: ${params.boardingPoint.location}`,
    };

    // Update trip with new item
    const updatedTripItems = [...tripToLink.items, newTripItem];
    const updatedTrips = trips.some((t) => t.id === tripToLink!.id)
      ? trips.map((t) => (t.id === tripToLink!.id ? { ...t, items: updatedTripItems } : t))
      : [{ ...tripToLink, items: updatedTripItems }, ...trips];

    saveTrips(updatedTrips);
    saveBookings([newBooking, ...bookings]);
    releaseHeldSeats(params.schedule.id);

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, refundAmount: 0, message: "Booking not found" };
    }
    if (booking.status === "CANCELLED") {
      return { success: false, refundAmount: 0, message: "Booking is already cancelled" };
    }

    const cancellationFee = 150;
    const refundAmount = Math.max(0, booking.totalAmount - cancellationFee);

    const updatedBookings = bookings.map((b) =>
      b.id === bookingId
        ? {
            ...b,
            status: "CANCELLED" as const,
            paymentStatus: "REFUNDED" as const,
          }
        : b
    );
    saveBookings(updatedBookings);

    // Update status in trip items
    const updatedTrips = trips.map((trip) => ({
      ...trip,
      items: trip.items.map((item) =>
        item.bookingId === bookingId ? { ...item, status: "CANCELLED" as const } : item
      ),
    }));
    saveTrips(updatedTrips);

    return {
      success: true,
      refundAmount,
      message: `Booking cancelled successfully. Refund of ₹${refundAmount} has been initiated to your original payment method (₹${cancellationFee} cancellation fee deducted).`,
    };
  };

  const getTrip = (tripId: string) => trips.find((t) => t.id === tripId);
  const getBooking = (query: string) =>
    bookings.find((b) => b.id === query || b.referenceNumber === query);

  return (
    <TravelStoreContext.Provider
      value={{
        user,
        trips,
        bookings,
        heldSeats,
        holdSeats,
        releaseHeldSeats,
        createBusBooking,
        cancelBooking,
        getTrip,
        getBooking,
        createNewTrip,
      }}
    >
      {children}
    </TravelStoreContext.Provider>
  );
};

export const useTravelStore = () => {
  const context = useContext(TravelStoreContext);
  if (!context) {
    throw new Error("useTravelStore must be used within TravelStoreProvider");
  }
  return context;
};
