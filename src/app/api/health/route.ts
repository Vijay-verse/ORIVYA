import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RazorpayPaymentProvider } from "@/services/payment";

export async function GET() {
  const configured = isSupabaseConfigured();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let maskedHost = "unconfigured";
  
  if (rawUrl) {
    try {
      maskedHost = new URL(rawUrl).host;
    } catch {
      maskedHost = "invalid-url";
    }
  }

  let dbConnection = {
    status: configured ? "testing" : "not_configured",
    latencyMs: 0,
    error: null as string | null,
  };

  if (configured) {
    const startTime = Date.now();
    try {
      const supabase = await createServerSupabaseClient();
      // Test ping to database
      const { error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      dbConnection.latencyMs = Date.now() - startTime;
      if (error) {
        dbConnection.status = "error";
        dbConnection.error = error.message;
      } else {
        dbConnection.status = "connected";
      }
    } catch (err: any) {
      dbConnection.latencyMs = Date.now() - startTime;
      dbConnection.status = "exception";
      dbConnection.error = err.message || "Failed to reach Supabase";
    }
  }

  const razorpay = new RazorpayPaymentProvider();
  const isRzpReady = razorpay.isConfigured();

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    supabase: {
      isConfigured: configured,
      host: maskedHost,
      connection: dbConnection,
    },
    paymentGateway: {
      isConfigured: isRzpReady,
      provider: isRzpReady ? "razorpay" : "mock",
      keyIdMasked: isRzpReady
        ? `${razorpay.getKeyId().slice(0, 12)}...`
        : "mock_demo",
    },
    services: {
      busBooking: "operational",
      trainReservations: "operational",
      hotelHospitality: "operational",
      cabTransfers: "operational",
      unifiedTripEngine: "operational",
      pricingEngine: "operational",
      seatLockEngine: "operational",
      auditLogger: "operational",
    },
  });
}

