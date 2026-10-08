import { NextResponse } from "next/server";
import { defaultPaymentProvider } from "@/services/payment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      paymentId,
      signature,
      amount = 0,
      paymentMethod = "UPI",
    } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or paymentId parameter" },
        { status: 400 }
      );
    }

    const verification = await defaultPaymentProvider.verifyPayment({
      orderId,
      transactionReference: paymentId,
      paymentMethod,
      amount: Number(amount),
      razorpaySignature: signature,
    });

    return NextResponse.json({
      success: verification.verified,
      status: verification.status,
      transactionReference: verification.transactionReference,
      paidAt: verification.paidAt,
      message: verification.message,
      provider: verification.provider,
    });
  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
