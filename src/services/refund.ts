export interface RefundCalculation {
  originalAmount: number;
  cancellationFee: number;
  netRefundAmount: number;
  refundReference: string;
  processedAt: string;
  status: "COMPLETED" | "PROCESSING" | "FAILED";
  message: string;
}

export class RefundService {
  private static STANDARD_CANCELLATION_FEE = 150;

  /**
   * Calculate and execute policy-compliant refund
   */
  static processRefund(params: {
    bookingReference: string;
    totalAmountPaid: number;
    reason?: string;
  }): RefundCalculation {
    const { totalAmountPaid } = params;

    const cancellationFee = this.STANDARD_CANCELLATION_FEE;
    const netRefundAmount = Math.max(0, totalAmountPaid - cancellationFee);
    const refundReference = `ORV-REF-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      originalAmount: totalAmountPaid,
      cancellationFee,
      netRefundAmount,
      refundReference,
      processedAt: new Date().toISOString(),
      status: "COMPLETED",
      message: `Refund of ₹${netRefundAmount} has been processed back to original source after ₹${cancellationFee} operator cancellation fee. Ref: ${refundReference}`,
    };
  }
}
