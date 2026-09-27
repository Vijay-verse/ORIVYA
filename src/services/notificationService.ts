export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking_confirmed" | "payment_success" | "booking_cancelled" | "refund_processed" | "cab_update" | "trip_reminder";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: "notif-01",
    userId: "user-default-01",
    title: "Booking Confirmed: VRL Travels",
    message: "Your AC Sleeper bus seats (L2A, L2B) for Pune to Goa are confirmed. Ref: ORV-BUS-783421",
    type: "booking_confirmed",
    isRead: false,
    createdAt: "2026-09-27T10:00:00.000Z",
    link: "/bookings",
  },
  {
    id: "notif-02",
    userId: "user-default-01",
    title: "Goa Coastal Getaway Trip Updated",
    message: "A new return bus has been attached to your Goa vacation itinerary.",
    type: "trip_reminder",
    isRead: false,
    createdAt: "2026-09-27T08:30:00.000Z",
    link: "/trips",
  },
  {
    id: "notif-03",
    userId: "user-default-01",
    title: "Cab Transfer Scheduled",
    message: "Driver Ramesh Pawar has been scheduled for your pickup at Panaji Terminal on 03 Oct at 08:15.",
    type: "cab_update",
    isRead: true,
    createdAt: "2026-09-26T18:00:00.000Z",
    link: "/cabs",
  },
];

export class NotificationService {
  /**
   * Format friendly relative time e.g. "5m ago", "2h ago", "Yesterday"
   */
  static formatRelativeTime(dateIso: string): string {
    const diffMs = Date.now() - new Date(dateIso).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  }
}
