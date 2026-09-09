import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const { userId, email } = await request.json();
  if (!userId || !email) return NextResponse.json({ error: "Missing provider identity" }, { status:400 });
  const account = await stripe.accounts.create({ type:"express", email, capabilities:{ card_payments:{ requested:true }, transfers:{ requested:true } }, metadata:{ homehelp_user_id:userId } });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const link = await stripe.accountLinks.create({ account:account.id, refresh_url:`${baseUrl}/provider/onboarding`, return_url:`${baseUrl}/dashboard`, type:"account_onboarding" });
  return NextResponse.json({ accountId:account.id, url:link.url });
}