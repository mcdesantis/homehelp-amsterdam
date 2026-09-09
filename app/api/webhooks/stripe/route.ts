import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error:"Webhook not configured" }, { status:400 });
  let event;
  try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET); } catch (error) { return NextResponse.json({ error:`Webhook signature failed: ${String(error)}` }, { status:400 }); }
  switch (event.type) {
    case "checkout.session.completed":
      // TODO: mark booking paid and notify the provider in Supabase.
      break;
    case "payment_intent.payment_failed":
      // TODO: mark booking payment_failed in Supabase.
      break;
  }
  return NextResponse.json({ received:true });
}