"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function submit() {
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.auth.signInWithOtp({
  email,
  options: { shouldCreateUser: mode === "sign-up" }
});
    setMessage(result.error ? result.error.message : "Check your email for the secure sign-in link.");
  }
  return <main className="hero" style={{ minHeight:"100vh" }}><div className="shell" style={{ maxWidth:520 }}><Link className="brand" href="/"> <span className="mark">·</span>homehelp</Link><div className="card" style={{ padding:28, marginTop:60 }}><div className="kicker">{mode === "sign-in" ? "Welcome back" : "Join the pilot"}</div><h1 style={{ fontSize:"clamp(2.3rem,7vw,4rem)", marginTop:13 }}>{mode === "sign-in" ? "Sign in to HomeHelp." : "Create your account."}</h1><p className="lead" style={{ fontSize:16 }}>Use a magic link—no password to remember.</p><div className="field" style={{ marginTop:24 }}><label htmlFor="email">Email</label><input className="input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div><button className="btn btn-primary full-btn" onClick={submit}>{mode === "sign-in" ? "Send sign-in link" : "Create account"}</button>{message && <p className="note">{message}</p>}<button className="btn btn-ghost full-btn" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>{mode === "sign-in" ? "New here? Create an account" : "Already have an account? Sign in"}</button></div></div></main>;
}
