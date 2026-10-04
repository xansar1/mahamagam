# Mahamagham Premium IA V13

Premium Mahamagham 2027 static frontend with Vercel serverless APIs for support enquiries and Razorpay/Supabase payments.

## V13 changes

- Improved spacing/line-height for the Support Mahamagham 2027 hero heading on desktop and mobile.
- Support-page headings can open the relevant contribution/payment flow without visual link styling.
- Donation, Puja/Seva, Annadanam and every sponsorship category now have distinct payment option keys.
- Fixed charges are controlled server-side through separate Vercel environment variables; the browser cannot override them.
- Unconfigured fixed-price options remain non-payable until an organiser-approved amount is added.
- Programme Puja/Yajna/Annadanam CTAs can deep-link directly into the correct support/payment modal.

## Payment activation

See `PAYMENT_SETUP.md` and `.env.example`. Live payment is not activated by source code alone; Vercel, Supabase and Razorpay Live Mode credentials must be configured.

## Local viewing

Open `index.html` for visual review. Serverless API routes do not run from `file://`; payment testing requires a Vercel deployment or compatible local server/runtime.
