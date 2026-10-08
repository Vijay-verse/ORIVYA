import { NextResponse } from "next/server";
import { PricingService } from "@/services/pricing";
import { defaultPaymentProvider } from "@/services/payment";
import { SeatLockService } from "@/services/seatLock";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      schedule,
      selectedSeats,
      passengers,
      boardingPoint,
      droppingPoint,
      paymentMethod,
      holdToken,
      userId,
      contactEmail,
      contactPhone,
    } = body;

    if (!schedule || !selectedSeats || !passengers || selectedSeats.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid booking request parameters" },
        { status: 400 }
      );
    }

    // 1. Calculate canonical server price
    const pricing = PricingService.calculatePrice({
      serviceType: "bus",
      baseUnitRate: schedule.basePrice,
      unitsCount: selectedSeats.length,
      paymentMethod,
    });

    const bookingRef = `ORV-BUS-${Math.floor(100000 + Math.random() * 900000)}`;

    // 2. Process Razorpay verification or simulated order & capture
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
    let paymentStatus: "PAID" | "FAILED" = "PAID";
    let txnRef = razorpayPaymentId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const verification = await defaultPaymentProvider.verifyPayment({
        orderId: razorpayOrderId,
        transactionReference: razorpayPaymentId,
        paymentMethod: paymentMethod || "RAZORPAY",
        amount: pricing.totalAmount,
        razorpaySignature,
      });

      if (!verification.verified) {
        return NextResponse.json(
          { success: false, error: "Razorpay signature verification failed" },
          { status: 400 }
        );
      }
      paymentStatus = verification.status;
      txnRef = razorpayPaymentId;
    } else {
      const paymentOrder = await defaultPaymentProvider.createPaymentOrder({
        bookingReference: bookingRef,
        amount: pricing.totalAmount,
        currency: "INR",
        paymentMethod,
        customerEmail: contactEmail || "customer@example.com",
        customerPhone: contactPhone,
      });

      const verification = await defaultPaymentProvider.verifyPayment({
        orderId: paymentOrder.orderId,
        transactionReference: paymentOrder.transactionReference,
        paymentMethod,
        amount: pricing.totalAmount,
      });
      paymentStatus = verification.status;
      txnRef = paymentOrder.transactionReference;
    }

    // 3. Release temporary hold token now that seats are confirmed
    if (holdToken) {
      await SeatLockService.releaseHold(holdToken);
    }

    // 4. Return confirmed booking payload
    const confirmedBooking = {
      id: `bk-bus-${Date.now()}`,
      referenceNumber: bookingRef,
      userId: userId || "user-default-01",
      bookingType: "bus" as const,
      status: "CONFIRMED" as const,
      paymentStatus: paymentStatus,
      baseAmount: pricing.baseAmount,
      taxAmount: pricing.taxAmount,
      convenienceFee: pricing.feeAmount,
      discountAmount: pricing.discountAmount,
      totalAmount: pricing.totalAmount,
      paymentMethod,
      createdAt: new Date().toISOString(),
      contactEmail: contactEmail || "customer@example.com",
      contactPhone: contactPhone || "+91 98765 43210",
      passengers,
      details: {
        busSchedule: schedule,
        seats: selectedSeats,
        boardingPoint,
        droppingPoint,
      },
    };

    return NextResponse.json({
      success: true,
      booking: confirmedBooking,
      transactionReference: txnRef,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process booking" },
      { status: 500 }
    );
  }
}
