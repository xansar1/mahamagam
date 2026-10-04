# Mahamagham Premium IA V10

V10 keeps the V9 information architecture, responsive system and payment/data scaffold, with the requested homepage photography and contact-number updates.

## V10 changes

- Replaced the homepage hero photograph with the new Thirunavaya aerial image supplied by the client.
- Replaced the “When the river becomes a place of gathering” photograph with the new aerial festival crowd image supplied by the client.
- Updated the public phone and WhatsApp number to +91 88913 85222 / 918891385222.

- Removed the duplicate large Mahamagham emblem from the homepage hero.
- Added a premium Thirunavaya / Nila event-signature block in its place.
- Hardened responsive behavior for 375px, 390px, 430px and other narrow layouts; footer collapses cleanly to one column on small phones.
- Improved page-hero background handling and general overflow safety.
- Rebuilt Support as a payment-ready experience with donation checkout modal, puja/seva interest capture and sponsorship-prefill flows.
- Added Vercel API functions for enquiries, Razorpay order creation, server-side payment signature verification and webhook processing.
- Added a Supabase schema for enquiries, contribution intents, verified payments and webhook events.
- No secret key is placed in browser code.

## Important: payment is not automatically live

The front-end remains safe on static hosting. If `/api/payment-config` is unavailable or credentials are missing, it shows that secure payment setup is pending instead of pretending a payment succeeded.

To activate live payment/data storage:

1. Deploy this folder on Vercel (or another Node serverless host).
2. Create/review the tables by running `supabase/schema.sql` in the intended Supabase project.
3. Add the values from `.env.example` to the host's environment variables. Prefer `SUPABASE_SECRET_KEY` for projects using Supabase's newer server secret key; `SUPABASE_SERVICE_ROLE_KEY` remains a fallback for older projects.
4. Install dependencies (`npm install`) and redeploy.
5. In Razorpay, point the payment webhook to `https://YOUR_DOMAIN/api/razorpay-webhook` and use the same webhook secret stored in `RAZORPAY_WEBHOOK_SECRET`.
6. Test in Razorpay test mode first. Confirm that a successful test payment creates/updates a `support_intents` row and a `payments` row, and that webhook events appear in `payment_events`.
7. Only after organiser approval should final puja/seva names, dates, contribution amounts and live Razorpay credentials be enabled.

## Security notes

- Keep `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` and the Supabase server secret/service-role key server-side only.
- RLS is enabled on all project tables and no public insert/read policies are created; writes go through server API functions.
- The browser receives only the Razorpay Key ID after a server-side order has been created.
- Payment success is not trusted from the browser alone; the API verifies the Razorpay signature and the webhook provides an additional server-side update path.

## Existing compatibility routes

- `festival.html` → `programmes.html`
- `pilgrim-guide.html` → `visit.html`
- `gallery.html` → `media.html#photos`
- `get-involved.html` → `support.html`
- `contact.html` → `about.html#contact`
