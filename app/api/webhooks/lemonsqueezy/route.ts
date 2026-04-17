import { NextResponse } from "next/server";

import {
  extractCustomerEmail,
  initializeLemonSqueezy,
  isSuccessfulPaymentEvent,
  parseLemonWebhook,
  verifyLemonWebhookSignature
} from "@/lib/lemonsqueezy";
import { upsertPaidCustomer } from "@/lib/supabase";

export async function POST(request: Request): Promise<NextResponse> {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, message: "Invalid webhook signature" }, { status: 401 });
  }

  try {
    initializeLemonSqueezy();

    const payload = parseLemonWebhook(rawBody);
    const eventName = payload.meta?.event_name;

    if (!isSuccessfulPaymentEvent(eventName)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const email = extractCustomerEmail(payload);
    const orderId = payload.data?.id ?? "unknown-order";
    const status = payload.data?.attributes?.status?.toString() ?? "paid";

    if (email) {
      await upsertPaidCustomer({
        email,
        orderId: orderId.toString(),
        status,
        customerName: payload.data?.attributes?.customer_name?.toString() ?? null,
        rawPayload: payload
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
