import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { writeAuditEvent } from "@/server/security/audit-log";

const payloadSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email()
});

export async function POST(request: Request) {
  enforceRateLimit("checkout-session", 20, 60_000);
  const payload = payloadSchema.parse(await request.json());

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
    customer_email: payload.email,
    success_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing?success=1`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=1`
  });

  await writeAuditEvent({
    userId: payload.userId,
    action: "billing.updated",
    metadata: { checkoutSessionId: session.id }
  });

  return NextResponse.json({ url: session.url });
}
