import { test, describe } from "node:test";
import assert from "node:assert";
import { CouponService } from "../src/services/couponService";
import { HotelService } from "../src/services/hotelService";
import { TrainService } from "../src/services/trainService";
import { CabService } from "../src/services/cabService";
import { NotificationService } from "../src/services/notificationService";

describe("CouponService Integration Tests", () => {
  test("validates flat discount coupon ORIVYA100 when order exceeds threshold", () => {
    const res = CouponService.validateCoupon({
      code: "ORIVYA100",
      subtotal: 1200,
      serviceType: "bus",
    });

    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.discountAmount, 100);
    assert.strictEqual(res.coupon?.discountType, "flat");
  });

  test("rejects coupon when subtotal is less than minimum order requirement", () => {
    const res = CouponService.validateCoupon({
      code: "ORIVYA100",
      subtotal: 800, // below 1000 minimum
      serviceType: "bus",
    });

    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.discountAmount, 0);
    assert.match(res.message, /minimum booking amount of ₹1000/i);
  });

  test("validates percentage coupon with ceiling cap (FIRSTTRIP: 10% up to ₹200)", () => {
    // 10% of 3000 is 300, but cap is 200
    const res = CouponService.validateCoupon({
      code: "FIRSTTRIP",
      subtotal: 3000,
      serviceType: "hotel",
    });

    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.discountAmount, 200);
  });

  test("enforces service-type restrictions (TRAIN10 only valid for trains)", () => {
    const invalidRes = CouponService.validateCoupon({
      code: "TRAIN10",
      subtotal: 1000,
      serviceType: "hotel", // invalid service
    });

    assert.strictEqual(invalidRes.valid, false);
    assert.match(invalidRes.message, /only valid for TRAIN/i);

    const validRes = CouponService.validateCoupon({
      code: "TRAIN10",
      subtotal: 1000,
      serviceType: "train",
    });

    assert.strictEqual(validRes.valid, true);
    assert.strictEqual(validRes.discountAmount, 100); // 10% of 1000
  });

  test("rejects unrecognized promo codes gracefully", () => {
    const res = CouponService.validateCoupon({
      code: "INVALID_PROMO_CODE",
      subtotal: 5000,
      serviceType: "bus",
    });

    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.discountAmount, 0);
    assert.match(res.message, /invalid or expired/i);
  });
});

describe("HotelService Integration Tests", () => {
  test("searches hotels by city destination", () => {
    const goaHotels = HotelService.searchHotels("Goa");
    assert.ok(goaHotels.length >= 1);
    assert.ok(goaHotels.some((h) => h.city.toLowerCase().includes("goa")));
  });

  test("calculates multi-night hospitality pricing with 12% GST", () => {
    const quote = HotelService.checkAvailabilityAndPrice({
      hotelId: "hotel-seaview-goa",
      roomId: "room-deluxe-01",
      checkIn: "2026-10-02",
      checkOut: "2026-10-05", // 3 nights
    });

    assert.ok(quote !== null);
    assert.strictEqual(quote?.nightsCount, 3);
    assert.strictEqual(quote?.pricePerNight, 4500);
    assert.strictEqual(quote?.roomSubtotal, 13500); // 4500 * 3
    assert.strictEqual(quote?.taxAmount, 1620); // 12% of 13500
    assert.strictEqual(quote?.totalPayable, 13500 + 1620); // 15120
    assert.strictEqual(quote?.isAvailable, true);
  });
});

describe("TrainService Integration Tests", () => {
  test("searches trains by route corridor", () => {
    const trains = TrainService.searchTrains("Pune", "Hyderabad");
    assert.ok(trains.length >= 1);
    assert.ok(trains.some((t) => t.trainName.includes("Siddheshwar") || t.toCity === "Hyderabad"));
  });

  test("verifies simulated 10-digit PNR lookup", () => {
    const pnrStatus = TrainService.checkPnrStatus("9823419082");
    assert.strictEqual(pnrStatus.pnr, "9823419082");
    assert.strictEqual(pnrStatus.status, "CONFIRMED");
    assert.strictEqual(pnrStatus.chartStatus, "PREPARED");
    assert.ok(pnrStatus.coach.length > 0);
  });
});

describe("CabService Integration Tests", () => {
  test("generates distance-based fare quotes across vehicle tiers", () => {
    const quotes = CabService.getCabQuotes(20); // 20 km trip
    assert.ok(quotes.length >= 3);

    const sedan = quotes.find((q) => q.category === "sedan");
    assert.ok(sedan);
    assert.strictEqual(sedan?.estimatedPrice, 120 + 18 * 20); // base (120) + 18 * 20 = 480
  });

  test("advances ride state machine sequentially through full lifecycle", () => {
    const step1 = CabService.getNextRideState("searching");
    assert.strictEqual(step1.nextStatus, "driver_assigned");
    assert.ok(step1.driver);

    const step2 = CabService.getNextRideState("driver_assigned");
    assert.strictEqual(step2.nextStatus, "arriving");

    const step3 = CabService.getNextRideState("arriving");
    assert.strictEqual(step3.nextStatus, "in_trip");

    const step4 = CabService.getNextRideState("in_trip");
    assert.strictEqual(step4.nextStatus, "completed");
  });
});

describe("NotificationService Integration Tests", () => {
  test("formats friendly relative timestamps", () => {
    const nowIso = new Date().toISOString();
    assert.strictEqual(NotificationService.formatRelativeTime(nowIso), "Just now");

    const tenMinsAgoIso = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    assert.strictEqual(NotificationService.formatRelativeTime(tenMinsAgoIso), "10m ago");

    const twoHoursAgoIso = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(NotificationService.formatRelativeTime(twoHoursAgoIso), "2h ago");
  });
});
