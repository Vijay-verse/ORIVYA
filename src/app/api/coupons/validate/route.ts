import { NextResponse } from "next/server";
import { CouponService } from "@/services/couponService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal, serviceType } = body;

    if (!code || typeof subtotal !== "number" || !serviceType) {
      return NextResponse.json(
        { valid: false, discountAmount: 0, message: "Missing code, subtotal, or serviceType" },
        { status: 400 }
      );
    }

    const result = CouponService.validateCoupon({
      code,
      subtotal,
      serviceType,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, discountAmount: 0, message: error.message || "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
