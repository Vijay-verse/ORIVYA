import { ServiceType } from "@/types";

export interface PricingBreakdown {
  baseAmount: number;
  taxAmount: number;
  feeAmount: number;
  discountAmount: number;
  totalAmount: number;
  taxRatePercent: number;
  description: string;
}

export class PricingService {
  /**
   * Calculate canonical server-side pricing for transportation or lodging
   */
  static calculatePrice(params: {
    serviceType: ServiceType;
    baseUnitRate: number;
    unitsCount: number; // seat count or room-nights
    paymentMethod?: string;
    couponCode?: string;
  }): PricingBreakdown {
    const { serviceType, baseUnitRate, unitsCount, paymentMethod, couponCode } = params;

    const baseAmount = Math.max(0, baseUnitRate * unitsCount);

    // GST Tax rates: 5% for Bus & Train transportation, 12% for Hotel luxury stays, 5% for Cabs
    let taxRatePercent = 5;
    if (serviceType === "hotel") {
      taxRatePercent = 12;
    }

    const taxAmount = Math.round((baseAmount * taxRatePercent) / 100);

    // Convenience booking fee
    const feeAmount = serviceType === "cab" ? 0 : 49;

    // Payment method incentives (e.g. ₹50 instant discount for direct UPI rail)
    let discountAmount = 0;
    if (paymentMethod === "UPI" && baseAmount >= 500) {
      discountAmount = 50;
    }

    // Coupon discount validation
    if (couponCode) {
      const normalizedCode = couponCode.trim().toUpperCase();
      if (normalizedCode === "ORIVYA100" && baseAmount >= 1000) {
        discountAmount += 100;
      } else if (normalizedCode === "FIRSTTRIP") {
        discountAmount += Math.min(200, Math.round(baseAmount * 0.1));
      }
    }

    const totalAmount = Math.max(0, baseAmount + taxAmount + feeAmount - discountAmount);

    return {
      baseAmount,
      taxAmount,
      feeAmount,
      discountAmount,
      totalAmount,
      taxRatePercent,
      description: `${serviceType.toUpperCase()} (${unitsCount} units @ ₹${baseUnitRate}) + ${taxRatePercent}% GST + fee - discount`,
    };
  }
}
