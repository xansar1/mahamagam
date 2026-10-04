import { getSupabaseAdmin } from './_lib/supabase.js';
import { verifyPaymentSignature } from './_lib/razorpay.js';
import { methodNotAllowed, noStore, getJsonBody, cleanText } from './_lib/http.js';

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'POST') return methodNotAllowed(res);
  try {
    const body = getJsonBody(req);
    const intentId = cleanText(body.intentId, 80);
    const orderId = cleanText(body.razorpay_order_id, 120);
    const paymentId = cleanText(body.razorpay_payment_id, 120);
    const signature = cleanText(body.razorpay_signature, 256);
    if (!intentId || !orderId || !paymentId || !signature) return res.status(400).json({ error: 'Missing payment verification fields' });
    const supabase = getSupabaseAdmin();
    const { data: intent, error: fetchError } = await supabase.from('support_intents').select('id,reference,razorpay_order_id,status').eq('id', intentId).single();
    if (fetchError || !intent) return res.status(404).json({ error: 'Payment record not found' });
    if (intent.razorpay_order_id !== orderId) return res.status(400).json({ error: 'Order does not match this contribution' });
    if (!verifyPaymentSignature(orderId, paymentId, signature)) return res.status(400).json({ error: 'Payment signature verification failed' });
    const { error: updateError } = await supabase.from('support_intents').update({ status: 'paid', razorpay_payment_id: paymentId, verified_at: new Date().toISOString() }).eq('id', intentId);
    if (updateError) throw updateError;
    await supabase.from('payments').upsert({ intent_id: intentId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, status: 'verified', verified_at: new Date().toISOString() }, { onConflict: 'razorpay_payment_id' });
    return res.status(200).json({ ok: true, reference: intent.reference });
  } catch (error) {
    console.error('verify-payment error', error);
    return res.status(500).json({ error: 'Unable to verify payment' });
  }
}
