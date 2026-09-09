"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [message, setMessage] = useState("");
  async function startCheckout() {
    setMessage("Creating secure checkout…");
    const response = await fetch("/api/stripe/checkout", { method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({ bookingId:"demo-booking", providerAccountId:"acct_demo", amountCents:5376, customerEmail:"" }) });
    const data = await response.json();
    if (!response.ok) setMessage(data.error ?? "Checkout is not configured yet.");
    else if (data.url) window.location.href = data.url;
  }
  return <main className="hero" style={{ minHeight:"100vh" }}><div className="shell" style={{ maxWidth:620 }}><Link className="brand" href="/"><span className="mark">·</span>homehelp</Link><div className="card" style={{ padding:28, marginTop:55 }}><div className="kicker">Secure checkout</div><h1 style={{ fontSize:"clamp(2.4rem,7vw,4.4rem)", marginTop:13 }}>Confirm your booking.</h1><p className="lead" style={{ fontSize:16 }}>This checkout is wired for Stripe Connect. Add your Stripe and Supabase credentials to enable real payment processing.</p><div className="card" style={{ boxShadow:"none", padding:16, marginTop:24 }}><div className="price"><span>Provider</span><strong>Sofia V.</strong></div><div className="price"><span>Service</span><strong>Home cleaning · 2 hours</strong></div><div className="price"><span>Wednesday · 14:00</span><strong>€48.00</strong></div><div className="price"><span>HomeHelp service fee</span><strong>€5.76</strong></div><div className="price total"><span>Total</span><strong>€53.76</strong></div></div><button className="btn btn-primary full-btn" onClick={startCheckout}>Continue to Stripe Checkout</button>{message && <p className="note">{message}</p>}<Link className="btn btn-secondary full-btn" href="/">Back to marketplace</Link></div></div></main>;
}