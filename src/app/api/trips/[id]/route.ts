import { NextResponse } from "next/server";
import { INITIAL_SEED_TRIP } from "@/lib/data/mockTrips";
import { TripEngine } from "@/services/tripEngine";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Return trip (defaults to seed trip if matching or demo)
    const trip = id === INITIAL_SEED_TRIP.id ? INITIAL_SEED_TRIP : {
      ...INITIAL_SEED_TRIP,
      id,
    };

    // Sort items chronologically
    const sortedItems = TripEngine.sortChronologically(trip.items);

    return NextResponse.json({
      success: true,
      trip: {
        ...trip,
        items: sortedItems,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch trip" },
      { status: 500 }
    );
  }
}
