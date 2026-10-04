import crypto from 'node:crypto';
import { getSupabaseAdmin } from './_lib/supabase.js';
import { getRazorpay } from './_lib/razorpay.js';
import { getPaymentOption } from './_lib/payment-catalog.js';
import { methodNotAllowed, noStore, applyCors, getJsonBody, cleanText, cleanPhone, isEmail } from './_lib/http.js';

export default async function handler(req, res) {
  noStore(res);
  if (applyCors(req, res, 'POST,OPTIONS')) return;
  if (req.method !== 'POST') return methodNotAllowed(res);
  let intentId;
  try {
    const body = getJsonBody(req);
    const optionKey = cleanText(body.optionKey, 100) || 'donation-general';
    const option = getPaymentOption(optionKey);
    if (!option) return res.status(400).json({ error: 'Unknown contribution option' });
    if (!option.available) return res.status(409).json({ error: 'The contribution amount for this option has not been published yet' });

    const name = cleanText(body.name, 120);
    const phone = cleanPhone(body.phone);
    const email = cleanText(body.email, 254).toLowerCase();
    const message = cleanText(body.message, 1000);

    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
    if (phone.replace(/\D/g, '').length < 8) return res.status(400).json({ error: 'Enter a valid phone number' });
    if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email address' });

    let amount;
    if (option.customAmount) {
      const amountRupees = Number(body.amount);
      if (!Number.isFinite(amountRupees) || amountRupees < 1 || amountRupees > 10000000) {
        return res.status(400).json({ error: 'Enter a valid contribution amount' });
      }
      amount = Math.round(amountRupees * 100);
    } else {
      // Fixed charges are resolved server-side from environment variables.
      // Browser-supplied amount is deliberately ignored for fixed-price items.
      amount = option.amountPaise;
    }

    const reference = `MG27-${crypto.randomUUID().replaceAll('-', '').slice(0, 18).toUpperCase()}`;
    const supabase = getSupabaseAdmin();
    const { data: intent, error: insertError } = await supabase.from('support_intents').insert({
      reference,
      kind: option.kind,
      category: option.category,
      name,
      phone,
      email: email || null,
      message: message || null,
      amount_paise: amount,
      currency: 'INR',
      status: 'creating_order',
      source: 'website'
    }).select('id,reference').single();
    if (insertError) throw insertError;
    intentId = intent.id;

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: reference.slice(0, 40),
      notes: { intent_id: intent.id, category: option.category, kind: option.kind, option_key: optionKey }
    });

    const { error: updateError } = await supabase
      .from('support_intents')
      .update({ razorpay_order_id: order.id, status: 'order_created' })
      .eq('id', intent.id);
    if (updateError) throw updateError;

    return res.status(201).json({
      intentId: intent.id,
      reference: intent.reference,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      description: option.category,
      optionKey
    });
  } catch (error) {
    console.error('create-order error', error);
    if (intentId) {
      try {
        await getSupabaseAdmin().from('support_intents').update({ status: 'order_failed' }).eq('id', intentId);
      } catch (_) {}
    }
    return res.status(500).json({ error: 'Unable to prepare secure payment' });
  }
}
