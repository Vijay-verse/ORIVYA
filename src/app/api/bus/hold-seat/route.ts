import { NextResponse } from "next/server";
import { SeatLockService } from "@/services/seatLock";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { busTripId, seatNumbers, userId } = body;

    if (!busTripId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing busTripId or seatNumbers array" },
        { status: 400 }
      );
    }

    const result = await SeatLockService.holdSeats({
      busTripId,
      seatNumbers,
      requestedByUserId: userId,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to hold seats" },
      { status: 500 }
    );
  }
}
