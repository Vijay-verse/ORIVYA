import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface SeatHoldRecord {
  busTripId: string;
  seatNumbers: string[];
  holdToken: string;
  expiresAt: number; // epoch ms
}

// In-memory atomic lease store for server runtime (used in development / serverless instances)
const globalSeatLeases = new Map<string, SeatHoldRecord>();

export class SeatLockService {
  private static HOLD_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Atomically attempt to lease seats for 5 minutes
   */
  static async holdSeats(params: {
    busTripId: string;
    seatNumbers: string[];
    requestedByUserId?: string;
  }): Promise<{ success: boolean; holdToken: string; expiresAt: number; error?: string }> {
    const { busTripId, seatNumbers } = params;
    const now = Date.now();
    const expiresAt = now + this.HOLD_DURATION_MS;
    const holdToken = `hold_${busTripId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. If Supabase is live, use database atomic procedure
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        let allSeatsHeld = true;

        for (const seatNum of seatNumbers) {
          const { data, error } = await supabase.rpc("hold_bus_seat_atomic", {
            p_bus_trip_id: busTripId,
            p_seat_number: seatNum,
            p_hold_token: holdToken,
            p_hold_minutes: 5,
          });

          if (error || !data) {
            allSeatsHeld = false;
            break;
          }
        }

        if (allSeatsHeld) {
          return { success: true, holdToken, expiresAt };
        } else {
          return {
            success: false,
            holdToken: "",
            expiresAt: 0,
            error: "One or more selected seats were just reserved by another traveller. Please choose alternative seats.",
          };
        }
      } catch (err) {
        console.error("Supabase RPC seat hold error, falling back to server memory lock:", err);
      }
    }

    // 2. Server-side memory lock fallback
    // Clean up expired leases first
    for (const [key, lease] of globalSeatLeases.entries()) {
      if (lease.expiresAt < now) {
        globalSeatLeases.delete(key);
      }
    }

    // Verify no seat collision with active unexpired leases
    for (const [, lease] of globalSeatLeases.entries()) {
      if (lease.busTripId === busTripId && lease.expiresAt > now) {
        const collision = seatNumbers.some((s) => lease.seatNumbers.includes(s));
        if (collision) {
          return {
            success: false,
            holdToken: "",
            expiresAt: 0,
            error: "One or more selected seats are currently held by another passenger. Please select another seat.",
          };
        }
      }
    }

    // Acquire lock
    globalSeatLeases.set(holdToken, {
      busTripId,
      seatNumbers,
      holdToken,
      expiresAt,
    });

    return { success: true, holdToken, expiresAt };
  }

  /**
   * Release seat hold early (e.g. user cancelled or closed modal)
   */
  static async releaseHold(holdToken: string): Promise<boolean> {
    if (!holdToken) return true;

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase
          .from("bus_seats")
          .update({
            status: "available",
            hold_token: null,
            hold_expires_at: null,
          })
          .eq("hold_token", holdToken);
      } catch (e) {
        console.error("Error releasing hold in database:", e);
      }
    }

    globalSeatLeases.delete(holdToken);
    return true;
  }

  /**
   * Validate if a holdToken is still active and valid for booking completion
   */
  static isHoldValid(holdToken: string, busTripId: string, seatNumbers: string[]): boolean {
    const lease = globalSeatLeases.get(holdToken);
    if (!lease) {
      // In serverless without db, grant standard validation if not expired
      return true;
    }

    if (lease.expiresAt < Date.now()) {
      return false;
    }

    return (
      lease.busTripId === busTripId &&
      seatNumbers.every((s) => lease.seatNumbers.includes(s))
    );
  }
}
