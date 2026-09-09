# HomeHelp Amsterdam — deploy-ready MVP starter

This is the first functional MVP foundation for the Amsterdam pilot:

- Customer sign-in with Supabase magic links
- Provider application flow with invite-only/approval-ready status
- Provider marketplace data model and availability model
- Customer bookings and booking statuses
- Customer dashboard and Stripe checkout route
- Stripe Checkout with Stripe Connect destination charges
- 12% platform fee configured through `PLATFORM_FEE_PERCENT`
- Admin review surface for pending providers
- Vercel-compatible Next.js app

## Important limitation

This project is deploy-ready, not production-launched. It contains no credentials and will not process real payments until you create and connect the required Supabase, Stripe, GitHub, and Vercel accounts. Before launch, add legal terms, privacy/GDPR handling, provider verification, cancellation/refund rules, and complete the webhook TODOs.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the project URL and anon key into `.env.local`.
4. Add the service role key only to server-side environments; never expose it in browser code.
5. Enable email magic-link authentication.

## Stripe setup

1. Create a Stripe account and enable Connect.
2. Add `STRIPE_SECRET_KEY` to `.env.local`.
3. Set `NEXT_PUBLIC_APP_URL` to the local or Vercel URL.
4. Configure a webhook endpoint at `/api/webhooks/stripe` for checkout completion and payment failure events.
5. Add the webhook signing secret.

The MVP uses Stripe Connect Express accounts and a 12% application fee. Change `PLATFORM_FEE_PERCENT` for testing a different model.

## Deploy to Vercel

1. Create a GitHub repository and push this folder.
2. Import the repository into Vercel.
3. Add the variables from `.env.example` in Vercel Project Settings.
4. Deploy, then update `NEXT_PUBLIC_APP_URL` and the Stripe webhook URL to the production domain.

## Suggested next build pass

- Add real availability management and conflict checks
- Add provider invite tokens and admin approve/reject actions
- Add customer profile, saved addresses, messaging, and reviews
- Complete Stripe webhook persistence and refunds
- Add email notifications and GDPR/legal pages
- Add Dutch/English localization and Amsterdam neighborhood filters
