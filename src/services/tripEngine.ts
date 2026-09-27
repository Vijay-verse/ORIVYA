import { Trip, TripItem, Booking, ServiceType } from "@/types";

export class TripEngine {
  /**
   * Sort trip items in strict chronological order based on datetime strings
   */
  static sortChronologically(items: TripItem[]): TripItem[] {
    return [...items].sort((a, b) => {
      const timeA = this.parseTimestamp(a.startTime);
      const timeB = this.parseTimestamp(b.startTime);
      return timeA - timeB;
    });
  }

  /**
   * Safe parser for diverse timestamp formats (ISO or formatted display strings)
   */
  private static parseTimestamp(timeStr: string): number {
    if (!timeStr) return 0;
    // Check if ISO formatted
    const parsedIso = Date.parse(timeStr);
    if (!isNaN(parsedIso)) return parsedIso;

    // Handle string format like "02 Oct 2026 • 21:30" or "2026-10-02 • 21:30"
    const cleaned = timeStr.replace("•", "").trim();
    const parsed = Date.parse(cleaned);
    if (!isNaN(parsed)) return parsed;

    return 0;
  }

  /**
   * Generate canonical master trip reference number
   */
  static generateTripReference(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    return `ORV-TRIP-${year}-${rand}`;
  }

  /**
   * Compile a confirmed booking into a structured TripItem
   */
  static compileBookingToTripItem(params: {
    tripId: string;
    booking: Booking;
  }): TripItem {
    const { tripId, booking } = params;
    let title = `${booking.bookingType.toUpperCase()} Booking`;
    let subtitle = `Reference: ${booking.referenceNumber}`;
    let location = "Transit Point";
    let startTime = booking.createdAt;
    let endTime = booking.createdAt;
    let detailsSummary = `Status: ${booking.status}`;

    if (booking.bookingType === "bus" && booking.details.busSchedule) {
      const sched = booking.details.busSchedule;
      title = `${sched.operator.name} (${sched.busType})`;
      subtitle = `${sched.fromCity} ➔ ${sched.toCity}`;
      location = booking.details.boardingPoint?.location || sched.fromCity;
      startTime = `${sched.date} • ${sched.departureTime}`;
      endTime = `${sched.date} • ${sched.arrivalTime}`;
      detailsSummary = `Seats: ${booking.details.seats?.join(", ") || "1"} • Boarding: ${location}`;
    } else if (booking.bookingType === "train" && booking.details.trainSchedule) {
      const sched = booking.details.trainSchedule;
      title = `${sched.trainName} (#${sched.trainNumber})`;
      subtitle = `${sched.fromCity} ➔ ${sched.toCity}`;
      location = sched.fromStation;
      startTime = `${sched.departureTime}`;
      endTime = `${sched.arrivalTime}`;
      detailsSummary = `Class: ${booking.details.selectedClass || "SL"} • PNR: ${booking.details.pnrNumber || "Pending"}`;
    } else if (booking.bookingType === "hotel" && booking.details.hotel) {
      const htl = booking.details.hotel;
      title = htl.name;
      subtitle = `${booking.details.nightsCount || 1} Nights • ${booking.details.room?.name || "Room"}`;
      location = htl.address;
      startTime = `${booking.details.checkInDate || "Check-in"}`;
      endTime = `${booking.details.checkOutDate || "Check-out"}`;
      detailsSummary = `Check-in: ${htl.checkInTime} • ${booking.details.room?.name || "Deluxe"}`;
    } else if (booking.bookingType === "cab" && booking.details.cab) {
      title = booking.details.cab.title;
      subtitle = `${booking.details.pickupLocation} ➔ ${booking.details.dropLocation}`;
      location = booking.details.pickupLocation || "Pickup Point";
      startTime = `${booking.details.pickupTime || "Immediate"}`;
      endTime = `${booking.details.pickupTime || "In-Trip"}`;
      detailsSummary = `Driver: ${booking.details.driver?.name || "Assigned"} • ${booking.details.cab.category.toUpperCase()}`;
    }

    return {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      tripId,
      bookingId: booking.id,
      itemType: booking.bookingType,
      title,
      subtitle,
      location,
      startTime,
      endTime,
      status: booking.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED",
      bookingRef: booking.referenceNumber,
      detailsSummary,
    };
  }
}
