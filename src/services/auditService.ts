export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorRole: "user" | "admin" | "system";
  action: 
    | "BOOKING_CREATED" 
    | "BOOKING_CANCELLED" 
    | "PAYMENT_CAPTURED" 
    | "REFUND_COMPLETED" 
    | "SEAT_LOCKED" 
    | "SEAT_RELEASED" 
    | "RIDE_COMPLETED" 
    | "COUPON_APPLIED" 
    | "INVENTORY_TOGGLED";
  entityType: "booking" | "seat" | "trip" | "payment" | "refund" | "inventory" | "coupon";
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-101",
    actorId: "user-default-01",
    actorRole: "user",
    action: "BOOKING_CREATED",
    entityType: "booking",
    entityId: "ORV-BUS-783421",
    metadata: {
      operator: "VRL Travels",
      route: "Pune to Goa",
      amount: 2198,
      seats: ["L2A", "L2B"],
    },
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: "audit-102",
    actorId: "system",
    actorRole: "system",
    action: "PAYMENT_CAPTURED",
    entityType: "payment",
    entityId: "pay-sim-984210",
    metadata: {
      method: "UPI",
      gateway: "MockRazorpayProvider",
      amount: 2198,
    },
    createdAt: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
  },
  {
    id: "audit-103",
    actorId: "admin-system",
    actorRole: "admin",
    action: "INVENTORY_TOGGLED",
    entityType: "inventory",
    entityId: "bus-vrl-pune-goa-01",
    metadata: {
      status: "ACTIVE",
      totalSeats: 36,
      quota: "General",
    },
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "audit-104",
    actorId: "user-default-01",
    actorRole: "user",
    action: "COUPON_APPLIED",
    entityType: "coupon",
    entityId: "ORIVYA100",
    metadata: {
      discount: 100,
      service: "bus",
    },
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: "audit-105",
    actorId: "user-default-01",
    actorRole: "user",
    action: "RIDE_COMPLETED",
    entityType: "booking",
    entityId: "ORV-CAB-492104",
    metadata: {
      driver: "Ramesh Pawar",
      vehicle: "Maruti Dzire",
      route: "Madgaon Station to SeaView Resort",
    },
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
];

const STORAGE_KEY_AUDIT = "orivya_audit_logs_v1";

export class AuditService {
  private static logs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  /**
   * Log an operational event
   */
  static logEvent(params: Omit<AuditLogEntry, "id" | "createdAt">): AuditLogEntry {
    const entry: AuditLogEntry = {
      ...params,
      id: `audit-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };

    this.logs.unshift(entry);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
        const existing: AuditLogEntry[] = stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;
        const updated = [entry, ...existing];
        localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updated.slice(0, 100)));
      } catch (err) {
        console.error("Failed to persist audit log", err);
      }
    }

    return entry;
  }

  /**
   * Get all audit logs sorted newest first
   */
  static getLogs(): AuditLogEntry[] {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (err) {
        console.error(err);
      }
    }
    return this.logs;
  }
}
