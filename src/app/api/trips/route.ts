import { NextResponse } from "next/server";
import { TripEngine } from "@/services/tripEngine";
import { INITIAL_SEED_TRIP } from "@/lib/data/mockTrips";
import { Trip } from "@/types";

// In-memory persistent trips list for serverless/local runtime
let serverTrips: Trip[] = [INITIAL_SEED_TRIP];

export async function GET() {
  return NextResponse.json({
    success: true,
    trips: serverTrips,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, destination, startDate, endDate, userId } = body;

    if (!title || !destination || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Missing required trip fields" },
        { status: 400 }
      );
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      userId: userId || "user-default-01",
      title,
      destination,
      startDate,
      endDate,
      status: "upcoming",
      createdAt: new Date().toISOString(),
      items: [],
    };

    serverTrips = [newTrip, ...serverTrips];

    return NextResponse.json({
      success: true,
      trip: newTrip,
      tripReference: TripEngine.generateTripReference(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create trip" },
      { status: 500 }
    );
  }
}
