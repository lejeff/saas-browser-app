import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { writeAuditEvent } from "@/server/security/audit-log";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

  if (event.type === "checkout.session.completed") {
    await writeAuditEvent({
      userId: "system",
      action: "billing.updated",
      metadata: { eventId: event.id, type: event.type }
    });
  }

  return NextResponse.json({ received: true });
}
