# Mahamagham 2027 — Live Payment Setup (V13)

V13 contains the secure Razorpay + Supabase payment flow, but live payments only activate after the required Vercel environment variables and Supabase schema are configured.

## 1. Deploy the project to Vercel

Connect the GitHub repository to Vercel and deploy the repository root. The `api/` directory contains the server-side Vercel functions.

If the public frontend continues to use GitHub Pages, keep `assets/js/site-config.js` pointed at the Vercel API origin and set `SITE_ORIGINS` to the GitHub Pages origin. Hosting the full site on Vercel is simpler because the frontend and API share one origin.

## 2. Create/select a dedicated Supabase project

Run `supabase/schema.sql` once in the Mahamagham Supabase project. The browser never receives the Supabase secret/service-role key.

Required Vercel variables:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_SERVICE_ROLE_KEY`

## 3. Add Razorpay Live Mode credentials

Required Vercel variables:

- `RAZORPAY_KEY_ID` — live key (`rzp_live_...`)
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Do not place the secret key or webhook secret in HTML, browser JavaScript, GitHub source, or any public file.

## 4. Add the individual approved charges

Donation is intentionally custom-amount. Other payment routes are fixed-price and are resolved on the server. The browser cannot change the authoritative fixed amount.

Set the relevant Vercel variables in INR, for example `1080` or `2500`:

- `PAYMENT_AMOUNT_PUJA_SEVA`
- `PAYMENT_AMOUNT_PUJA_PARTICIPATION`
- `PAYMENT_AMOUNT_YAJNA_SEVA`
- `PAYMENT_AMOUNT_ANNADANAM`
- `PAYMENT_AMOUNT_SPONSORSHIP_GENERAL`
- `PAYMENT_AMOUNT_SPONSOR_MAIN_CEREMONY`
- `PAYMENT_AMOUNT_SPONSOR_PUJA_SEVA`
- `PAYMENT_AMOUNT_SPONSOR_ACCOMMODATION`
- `PAYMENT_AMOUNT_SPONSOR_TRANSPORTATION`
- `PAYMENT_AMOUNT_SPONSOR_DRINKING_WATER`
- `PAYMENT_AMOUNT_SPONSOR_VENUE_INFRASTRUCTURE`
- `PAYMENT_AMOUNT_SPONSOR_MEDIA_DOCUMENTATION`
- `PAYMENT_AMOUNT_SPONSOR_LIVE_STREAMING`
- `PAYMENT_AMOUNT_SPONSOR_PUBLICATIONS`
- `PAYMENT_AMOUNT_SPONSOR_VISITOR_SERVICES`

An option with no approved charge stays non-payable even if Razorpay is connected. Its modal can open, but checkout remains disabled until the amount is configured.

## 5. Configure the Razorpay webhook

Use the Vercel production URL:

`https://YOUR_DOMAIN/api/razorpay-webhook`

Set the same secret in Razorpay and Vercel as `RAZORPAY_WEBHOOK_SECRET`. Enable the payment events required by the deployed webhook handler.

## 6. What V13 verifies

- Order is created server-side.
- Fixed prices come from server-side configuration, not the browser.
- Razorpay checkout signature is verified server-side.
- The payment is fetched back from Razorpay and order ID, amount, currency, and payment state are checked.
- Supabase stores the payment intent and verified payment.
- Webhook events are HMAC-verified before being recorded/processed.

## 7. Production check before accepting public money

Use an authorised small live transaction only after the organiser confirms recipient details and all charges. Confirm that the Razorpay payment appears in the intended merchant account and that the corresponding `support_intents`, `payments`, and webhook records appear in the intended Mahamagham Supabase project.
