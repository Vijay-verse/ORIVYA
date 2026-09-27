import { ServiceType } from "@/types";

export interface Coupon {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  applicableServices?: ServiceType[];
  description: string;
  isActive: boolean;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "ORIVYA100",
    discountType: "flat",
    discountValue: 100,
    minOrderAmount: 1000,
    description: "Flat ₹100 OFF on bookings above ₹1,000",
    isActive: true,
  },
  {
    code: "FIRSTTRIP",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscount: 200,
    description: "10% OFF up to ₹200 for your journey",
    isActive: true,
  },
  {
    code: "GOA500",
    discountType: "flat",
    discountValue: 500,
    minOrderAmount: 4000,
    applicableServices: ["hotel", "bus"],
    description: "Flat ₹500 OFF on Goa resorts & luxury buses above ₹4,000",
    isActive: true,
  },
  {
    code: "TRAIN10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 400,
    maxDiscount: 150,
    applicableServices: ["train"],
    description: "10% OFF up to ₹150 on Train reservations",
    isActive: true,
  },
];

export class CouponService {
  /**
   * Validate and apply coupon code server-side
   */
  static validateCoupon(params: {
    code: string;
    subtotal: number;
    serviceType: ServiceType;
  }): {
    valid: boolean;
    discountAmount: number;
    coupon?: Coupon;
    message: string;
  } {
    const { code, subtotal, serviceType } = params;
    const normalized = code.trim().toUpperCase();

    const coupon = AVAILABLE_COUPONS.find((c) => c.code === normalized);
    if (!coupon || !coupon.isActive) {
      return {
        valid: false,
        discountAmount: 0,
        message: "Invalid or expired promo code.",
      };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Promo code ${coupon.code} requires a minimum booking amount of ₹${coupon.minOrderAmount}.`,
      };
    }

    if (coupon.applicableServices && !coupon.applicableServices.includes(serviceType)) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Promo code ${coupon.code} is only valid for ${coupon.applicableServices.join(", ").toUpperCase()} bookings.`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === "flat") {
      discountAmount = coupon.discountValue;
    } else {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    return {
      valid: true,
      discountAmount,
      coupon,
      message: `Promo code ${coupon.code} applied! You saved ₹${discountAmount}.`,
    };
  }
}
