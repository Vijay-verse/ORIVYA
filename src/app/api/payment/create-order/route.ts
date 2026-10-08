import { NextResponse } from "next/server";
import { defaultPaymentProvider, RazorpayPaymentProvider } from "@/services/payment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = "INR",
      bookingReference = `ORV-${Date.now()}`,
      paymentMethod = "UPI",
      customerEmail = "guest@orivya.com",
      customerPhone = "+919876543210",
      customerName = "ORIVYA Traveller",
      notes,
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const razorpay = new RazorpayPaymentProvider();
    const provider = razorpay.isConfigured() ? razorpay : defaultPaymentProvider;

    const orderResult = await provider.createPaymentOrder({
      bookingReference,
      amount: Number(amount),
      currency,
      paymentMethod,
      customerEmail,
      customerPhone,
      customerName,
      notes,
    });

    return NextResponse.json({
      success: true,
      orderId: orderResult.orderId,
      amount: orderResult.amount,
      currency: orderResult.currency,
      keyId: orderResult.keyId,
      provider: orderResult.provider,
    });
  } catch (error: any) {
    console.error("Payment create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
