import Stripe from "stripe";
import { serverEnv } from "@/lib/env.server";

export const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20"
});
