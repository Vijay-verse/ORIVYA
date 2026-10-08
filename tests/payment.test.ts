import test, { describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { RazorpayPaymentProvider, MockPaymentProvider } from "@/services/payment";

describe("Payment Gateway & Razorpay Provider Tests", () => {
  const testKeyId = "rzp_test_TlP448dEVGiUgi";
  const testKeySecret = "UmhiAJC8raSpGtNdcbYz7VxT";

  test("verifies RazorpayPaymentProvider correctly identifies valid configuration", () => {
    const provider = new RazorpayPaymentProvider(testKeyId, testKeySecret);
    assert.equal(provider.isConfigured(), true);
    assert.equal(provider.getKeyId(), testKeyId);
  });

  test("verifies RazorpayPaymentProvider detects unconfigured or placeholder keys", () => {
    const emptyProvider = new RazorpayPaymentProvider("", "");
    assert.equal(emptyProvider.isConfigured(), false);

    const placeholderProvider = new RazorpayPaymentProvider("your-key-id", "your-secret");
    assert.equal(placeholderProvider.isConfigured(), false);
  });

  test("validates HMAC-SHA256 signature when signature matches cryptographic digest", async () => {
    const provider = new RazorpayPaymentProvider(testKeyId, testKeySecret);
    const orderId = "order_TlPF6F6FvoG7VG";
    const paymentId = "pay_test_9988776655";

    // Generate canonical HMAC signature
    const validSignature = crypto
      .createHmac("sha256", testKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const result = await provider.verifyPayment({
      orderId,
      transactionReference: paymentId,
      paymentMethod: "UPI",
      amount: 500,
      razorpaySignature: validSignature,
    });

    assert.equal(result.verified, true);
    assert.equal(result.status, "PAID");
    assert.equal(result.provider, "razorpay");
  });

  test("rejects tampered or mismatched payment signatures", async () => {
    const provider = new RazorpayPaymentProvider(testKeyId, testKeySecret);
    const orderId = "order_TlPF6F6FvoG7VG";
    const paymentId = "pay_test_9988776655";
    const fakeSignature = "invalid_tampered_signature_hex_123456";

    const result = await provider.verifyPayment({
      orderId,
      transactionReference: paymentId,
      paymentMethod: "UPI",
      amount: 500,
      razorpaySignature: fakeSignature,
    });

    assert.equal(result.verified, false);
    assert.equal(result.status, "FAILED");
  });

  test("verifies MockPaymentProvider provides instantaneous simulated transactions", async () => {
    const mockProvider = new MockPaymentProvider();
    const order = await mockProvider.createPaymentOrder({
      bookingReference: "ORV-TEST-MOCK",
      amount: 1200,
      currency: "INR",
      paymentMethod: "UPI",
      customerEmail: "traveller@example.com",
    });

    assert.equal(order.status, "CREATED");
    assert.equal(order.amount, 1200);
    assert.equal(order.provider, "mock");

    const verification = await mockProvider.verifyPayment({
      orderId: order.orderId,
      transactionReference: order.transactionReference,
      paymentMethod: "UPI",
      amount: 1200,
    });

    assert.equal(verification.verified, true);
    assert.equal(verification.status, "PAID");
  });
});
