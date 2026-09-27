export interface PaymentOrderParams {
  bookingReference: string;
  amount: number;
  currency: string;
  paymentMethod: "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET";
  customerEmail: string;
  customerPhone?: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  status: "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED";
  provider: "mock" | "razorpay";
  transactionReference: string;
}

export interface PaymentVerificationParams {
  orderId: string;
  transactionReference: string;
  paymentMethod: string;
  amount: number;
}

export interface PaymentVerificationResult {
  verified: boolean;
  status: "PAID" | "FAILED";
  transactionReference: string;
  paidAt: string;
  message: string;
}

export interface PaymentProvider {
  createPaymentOrder(params: PaymentOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult>;
}

/**
 * Mock Payment Provider for sandbox testing & development
 */
export class MockPaymentProvider implements PaymentProvider {
  async createPaymentOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    // Simulate gateway handoff
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const transactionReference = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    return {
      orderId,
      amount: params.amount,
      currency: params.currency || "INR",
      status: "CREATED",
      provider: "mock",
      transactionReference,
    };
  }

  async verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult> {
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      verified: true,
      status: "PAID",
      transactionReference: params.transactionReference,
      paidAt: new Date().toISOString(),
      message: `Simulated transaction ${params.transactionReference} verified successfully via ${params.paymentMethod}.`,
    };
  }
}

export const defaultPaymentProvider = new MockPaymentProvider();
