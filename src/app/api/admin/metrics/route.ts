import { NextResponse } from "next/server";
import { AdminService } from "@/services/adminService";
import { INITIAL_SEED_BOOKINGS, INITIAL_SEED_TRIP } from "@/lib/data/mockTrips";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = (searchParams.get("filter") as any) || "all";

    const metrics = AdminService.getMetrics(
      INITIAL_SEED_BOOKINGS,
      [INITIAL_SEED_TRIP],
      filter
    );

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch admin metrics" },
      { status: 500 }
    );
  }
}
