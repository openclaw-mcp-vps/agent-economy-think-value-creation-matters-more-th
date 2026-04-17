import crypto from "crypto";
import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

let lemonInitialized = false;

export function initializeLemonSqueezy(): void {
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

  if (!apiKey || lemonInitialized) {
    return;
  }

  lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      console.error("Lemon Squeezy SDK error:", error);
    }
  });

  lemonInitialized = true;
}

export function getCheckoutOverlayUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL;

  if (explicitUrl) {
    return explicitUrl.includes("?") ? `${explicitUrl}&embed=1` : `${explicitUrl}?embed=1`;
  }

  const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;
  return `https://checkout.lemonsqueezy.com/buy/${productId}?embed=1`;
}

export function verifyLemonWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret || !signatureHeader) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const provided = Buffer.from(signatureHeader);
  const expected = Buffer.from(digest);

  if (provided.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(provided, expected);
}

export interface LemonWebhookPayload {
  meta?: {
    event_name?: string;
    custom_data?: {
      email?: string;
      [key: string]: string | number | boolean | null | undefined;
    };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      user_email?: string;
      customer_email?: string;
      customer_name?: string;
      [key: string]: string | number | boolean | null | undefined;
    };
  };
}

export function parseLemonWebhook(rawBody: string): LemonWebhookPayload {
  return JSON.parse(rawBody) as LemonWebhookPayload;
}

export function extractCustomerEmail(payload: LemonWebhookPayload): string | null {
  return (
    payload.data?.attributes?.user_email?.toString() ??
    payload.data?.attributes?.customer_email?.toString() ??
    payload.meta?.custom_data?.email?.toString() ??
    null
  );
}

export function isSuccessfulPaymentEvent(eventName?: string): boolean {
  if (!eventName) {
    return false;
  }

  return ["order_created", "subscription_created", "subscription_payment_success"].includes(eventName);
}
