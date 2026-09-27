import { test, describe } from "node:test";
import assert from "node:assert";
import { PricingService } from "../src/services/pricing";
import { RefundService } from "../src/services/refund";
import { TripEngine } from "../src/services/tripEngine";
import { SeatLockService } from "../src/services/seatLock";
import { TripItem, Booking } from "../src/types";

describe("PricingService Unit Tests", () => {
  test("calculates bus pricing with 5% GST and booking fee", () => {
    const result = PricingService.calculatePrice({
      serviceType: "bus",
      baseUnitRate: 1000,
      unitsCount: 2,
    });

    assert.strictEqual(result.baseAmount, 2000);
    assert.strictEqual(result.taxRatePercent, 5);
    assert.strictEqual(result.taxAmount, 100); // 5% of 2000
    assert.strictEqual(result.feeAmount, 49);
    assert.strictEqual(result.discountAmount, 0);
    assert.strictEqual(result.totalAmount, 2149); // 2000 + 100 + 49
  });

  test("calculates hotel luxury stays with 12% hospitality GST", () => {
    const result = PricingService.calculatePrice({
      serviceType: "hotel",
      baseUnitRate: 4500,
      unitsCount: 3, // 3 nights
    });

    assert.strictEqual(result.baseAmount, 13500);
    assert.strictEqual(result.taxRatePercent, 12);
    assert.strictEqual(result.taxAmount, 1620); // 12% of 13500
    assert.strictEqual(result.totalAmount, 13500 + 1620 + 49);
  });

  test("applies UPI instant discount and promotional coupon", () => {
    const result = PricingService.calculatePrice({
      serviceType: "bus",
      baseUnitRate: 1200,
      unitsCount: 1,
      paymentMethod: "UPI",
      couponCode: "ORIVYA100",
    });

    assert.strictEqual(result.baseAmount, 1200);
    assert.strictEqual(result.discountAmount, 150); // 50 (UPI) + 100 (ORIVYA100)
    assert.strictEqual(result.totalAmount, 1200 + 60 + 49 - 150); // 1159
  });
});

describe("RefundService Unit Tests", () => {
  test("enforces standard operator cancellation fee deduction", () => {
    const totalPaid = 1299;
    const refund = RefundService.processRefund({
      bookingReference: "ORV-BUS-783421",
      totalAmountPaid: totalPaid,
    });

    assert.strictEqual(refund.cancellationFee, 150);
    assert.strictEqual(refund.netRefundAmount, 1149); // 1299 - 150
    assert.strictEqual(refund.status, "COMPLETED");
    assert.match(refund.refundReference, /^ORV-REF-\d{6}$/);
  });

  test("handles low value booking refunds without negative amounts", () => {
    const refund = RefundService.processRefund({
      bookingReference: "ORV-BUS-MIN",
      totalAmountPaid: 100, // less than fee
    });

    assert.strictEqual(refund.netRefundAmount, 0); // No negative refund
  });
});

describe("TripEngine Itinerary Sorting Tests", () => {
  test("strictly orders itinerary items chronologically by timestamp", () => {
    const items: TripItem[] = [
      {
        id: "item-hotel",
        tripId: "t1",
        bookingId: "b1",
        itemType: "hotel",
        title: "SeaView Resort Check-in",
        subtitle: "Check-in",
        location: "Calangute",
        startTime: "2026-10-03 14:00",
        endTime: "2026-10-06 11:00",
        status: "CONFIRMED",
        bookingRef: "ORV-HTL-1",
        detailsSummary: "Room",
      },
      {
        id: "item-bus-departure",
        tripId: "t1",
        bookingId: "b2",
        itemType: "bus",
        title: "Pune to Goa Bus",
        subtitle: "VRL Travels",
        location: "Swargate",
        startTime: "2026-10-02 21:30",
        endTime: "2026-10-03 08:00",
        status: "CONFIRMED",
        bookingRef: "ORV-BUS-1",
        detailsSummary: "Seats L1",
      },
      {
        id: "item-cab-pickup",
        tripId: "t1",
        bookingId: "b3",
        itemType: "cab",
        title: "Station to Resort Cab",
        subtitle: "Dzire Sedan",
        location: "Panaji Stand",
        startTime: "2026-10-03 08:15",
        endTime: "2026-10-03 09:00",
        status: "SCHEDULED",
        bookingRef: "ORV-CAB-1",
        detailsSummary: "Transfer",
      },
    ];

    const sorted = TripEngine.sortChronologically(items);

    assert.strictEqual(sorted[0].id, "item-bus-departure"); // Oct 2 21:30
    assert.strictEqual(sorted[1].id, "item-cab-pickup");     // Oct 3 08:15
    assert.strictEqual(sorted[2].id, "item-hotel");          // Oct 3 14:00
  });
});

describe("SeatLockService Unit Tests", () => {
  test("leases seats atomically with 5-minute TTL", async () => {
    const tripId = `test-trip-${Date.now()}`;
    const seats = ["L1A", "L1B"];

    const holdResult = await SeatLockService.holdSeats({
      busTripId: tripId,
      seatNumbers: seats,
    });

    assert.strictEqual(holdResult.success, true);
    assert.ok(holdResult.holdToken.length > 0);
    assert.ok(holdResult.expiresAt > Date.now());

    // Second hold on same seat should be rejected
    const duplicateHold = await SeatLockService.holdSeats({
      busTripId: tripId,
      seatNumbers: ["L1A"], // duplicate
    });

    assert.strictEqual(duplicateHold.success, false);
    assert.match(duplicateHold.error || "", /currently held/i);

    // Release hold
    await SeatLockService.releaseHold(holdResult.holdToken);

    // After release, seat can be held again
    const reHold = await SeatLockService.holdSeats({
      busTripId: tripId,
      seatNumbers: ["L1A"],
    });

    assert.strictEqual(reHold.success, true);
  });
});
