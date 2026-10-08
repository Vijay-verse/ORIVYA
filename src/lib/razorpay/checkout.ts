/**
 * Razorpay Standard Web Checkout Loader & Handler
 * Securely initiates the Razorpay Checkout modal in Next.js
 */

export interface RazorpayCheckoutOptions {
  keyId: string;
  orderId: string;
  amount: number; // In INR
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  themeColor?: string;
  onSuccess: (result: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss?: () => void;
  onError?: (err: any) => void;
}

let scriptLoadPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if ((window as any).Razorpay) {
    return Promise.resolve(true);
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout script");
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

export async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions
): Promise<boolean> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !(window as any).Razorpay) {
    if (options.onError) {
      options.onError(new Error("Unable to load Razorpay payment gateway SDK."));
    }
    return false;
  }

  try {
    const rzpOptions = {
      key: options.keyId,
      amount: Math.round(options.amount * 100), // paise
      currency: options.currency || "INR",
      name: options.name || "ORIVYA Travel",
      description: options.description || "Travel Booking",
      order_id: options.orderId,
      prefill: {
        name: options.prefill?.name || "ORIVYA Traveller",
        email: options.prefill?.email || "customer@orivya.com",
        contact: options.prefill?.contact || "+919876543210",
      },
      notes: options.notes || {},
      theme: {
        color: options.themeColor || "#4f46e5", // Indigo theme
      },
      handler: function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        options.onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          if (options.onDismiss) {
            options.onDismiss();
          }
        },
      },
    };

    const rzp = new (window as any).Razorpay(rzpOptions);
    rzp.open();
    return true;
  } catch (err) {
    if (options.onError) {
      options.onError(err);
    }
    return false;
  }
}
