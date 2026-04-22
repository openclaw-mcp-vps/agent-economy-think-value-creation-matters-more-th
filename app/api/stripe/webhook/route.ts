import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { upsertPurchase } from "@/lib/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = (await headers()).get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ message: "Missing Stripe webhook configuration." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ message: "Webhook signature verification failed." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email;

    if (email) {
      await upsertPurchase({
        email,
        source: "stripe",
        purchasedAt: new Date().toISOString(),
        sessionId: session.id
      });
    }
  }

  return NextResponse.json({ received: true });
}
