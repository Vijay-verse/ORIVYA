import { NextResponse } from "next/server";
import { RefundService } from "@/services/refund";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { totalAmount, referenceNumber } = body;

    if (!id || typeof totalAmount !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid cancellation request" },
        { status: 400 }
      );
    }

    const refund = RefundService.processRefund({
      bookingReference: referenceNumber || id,
      totalAmountPaid: totalAmount,
    });

    return NextResponse.json({
      success: true,
      bookingId: id,
      refund,
      message: refund.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
