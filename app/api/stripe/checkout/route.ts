import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";

export async function POST(request: Request) {
  const { bookingId, providerAccountId, amountCents, customerEmail } = await request.json();
  if (!bookingId || !providerAccountId || !amountCents) return NextResponse.json({ error:"Missing booking details" }, { status:400 });
  const fee = Math.round(amountCents * PLATFORM_FEE_PERCENT / 100);
  const session = await stripe.checkout.sessions.create({ mode:"payment", customer_email:customerEmail, line_items:[{ price_data:{ currency:"eur", product_data:{ name:"HomeHelp service booking" }, unit_amount:amountCents }, quantity:1 }], payment_intent_data:{ application_fee_amount:fee, transfer_data:{ destination:providerAccountId }, metadata:{ booking_id:bookingId } }, success_url:`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking=confirmed`, cancel_url:`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking=cancelled`, metadata:{ booking_id:bookingId } });
  return NextResponse.json({ url:session.url });
}