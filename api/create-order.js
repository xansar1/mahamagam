import crypto from 'node:crypto';
import { getSupabaseAdmin } from './_lib/supabase.js';
import { getRazorpay } from './_lib/razorpay.js';
import { methodNotAllowed, noStore, getJsonBody, cleanText, cleanPhone, isEmail } from './_lib/http.js';

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'POST') return methodNotAllowed(res);
  let intentId;
  try {
    const body = getJsonBody(req);
    const kind = cleanText(body.kind, 40) || 'donation';
    const category = cleanText(body.category, 160) || 'General support';
    const name = cleanText(body.name, 120);
    const phone = cleanPhone(body.phone);
    const email = cleanText(body.email, 254).toLowerCase();
    const message = cleanText(body.message, 1000);
    const amountRupees = Number(body.amount);
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
    if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email address' });
    if (!Number.isFinite(amountRupees) || amountRupees < 1 || amountRupees > 10000000) return res.status(400).json({ error: 'Enter a valid contribution amount' });
    const amount = Math.round(amountRupees * 100);
    const reference = `MG27-${crypto.randomUUID().replaceAll('-', '').slice(0, 18).toUpperCase()}`;
    const supabase = getSupabaseAdmin();
    const { data: intent, error: insertError } = await supabase.from('support_intents').insert({
      reference, kind, category, name, phone, email: email || null, message: message || null,
      amount_paise: amount, currency: 'INR', status: 'creating_order', source: 'website'
    }).select('id,reference').single();
    if (insertError) throw insertError;
    intentId = intent.id;
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: reference.slice(0, 40), notes: { intent_id: intent.id, category, kind } });
    const { error: updateError } = await supabase.from('support_intents').update({ razorpay_order_id: order.id, status: 'order_created' }).eq('id', intent.id);
    if (updateError) throw updateError;
    return res.status(201).json({ intentId: intent.id, reference: intent.reference, keyId: process.env.RAZORPAY_KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency, description: category });
  } catch (error) {
    console.error('create-order error', error);
    if (intentId) {
      try { await getSupabaseAdmin().from('support_intents').update({ status: 'order_failed' }).eq('id', intentId); } catch (_) {}
    }
    return res.status(500).json({ error: 'Unable to prepare secure payment' });
  }
}
