import { getSupabaseAdmin } from './_lib/supabase.js';
import { verifyWebhookSignature } from './_lib/razorpay.js';
import { noStore } from './_lib/http.js';

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body, 'utf8');
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (chunks.length) return Buffer.concat(chunks);
  if (req.body && typeof req.body === 'object') return Buffer.from(JSON.stringify(req.body), 'utf8');
  return Buffer.alloc(0);
}

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }
  try {
    const raw = await readRawBody(req);
    const signature = req.headers['x-razorpay-signature'];
    if (!verifyWebhookSignature(raw, signature)) return res.status(400).send('Invalid signature');
    const event = JSON.parse(raw.toString('utf8'));
    const eventId = String(req.headers['x-razorpay-event-id'] || event.id || '').slice(0, 160) || null;
    const supabase = getSupabaseAdmin();
    if (eventId) {
      const { data: existing } = await supabase.from('payment_events').select('id').eq('event_id', eventId).maybeSingle();
      if (existing) return res.status(200).json({ ok: true, duplicate: true });
    }
    await supabase.from('payment_events').insert({ event_id: eventId, event_type: event.event || 'unknown', payload: event });
    const payment = event?.payload?.payment?.entity;
    const orderId = payment?.order_id;
    if (orderId && (event.event === 'payment.captured' || event.event === 'order.paid')) {
      await supabase.from('support_intents').update({ status: 'paid', razorpay_payment_id: payment?.id || null, verified_at: new Date().toISOString() }).eq('razorpay_order_id', orderId);
      const { data: intent } = await supabase.from('support_intents').select('id').eq('razorpay_order_id', orderId).maybeSingle();
      if (intent?.id && payment?.id) await supabase.from('payments').upsert({ intent_id: intent.id, razorpay_order_id: orderId, razorpay_payment_id: payment.id, status: 'webhook_verified', verified_at: new Date().toISOString() }, { onConflict: 'razorpay_payment_id' });
    }
    if (orderId && event.event === 'payment.failed') {
      await supabase.from('support_intents').update({ status: 'payment_failed', razorpay_payment_id: payment?.id || null }).eq('razorpay_order_id', orderId);
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('razorpay-webhook error', error);
    return res.status(500).send('Webhook processing failed');
  }
}
