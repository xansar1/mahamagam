import { getSupabaseAdmin } from './_lib/supabase.js';
import { getRazorpay, verifyPaymentSignature } from './_lib/razorpay.js';
import { methodNotAllowed, noStore, applyCors, getJsonBody, cleanText } from './_lib/http.js';

export default async function handler(req, res) {
  noStore(res);
  if (applyCors(req, res, 'POST,OPTIONS')) return;
  if (req.method !== 'POST') return methodNotAllowed(res);
  try {
    const body = getJsonBody(req);
    const intentId = cleanText(body.intentId, 80);
    const orderId = cleanText(body.razorpay_order_id, 120);
    const paymentId = cleanText(body.razorpay_payment_id, 120);
    const signature = cleanText(body.razorpay_signature, 256);
    if (!intentId || !orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const supabase = getSupabaseAdmin();
    const { data: intent, error: fetchError } = await supabase
      .from('support_intents')
      .select('id,reference,razorpay_order_id,status,amount_paise,currency')
      .eq('id', intentId)
      .single();
    if (fetchError || !intent) return res.status(404).json({ error: 'Payment record not found' });
    if (intent.razorpay_order_id !== orderId) return res.status(400).json({ error: 'Order does not match this contribution' });
    if (!verifyPaymentSignature(orderId, paymentId, signature)) {
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    // Verify the payment details with Razorpay instead of trusting browser-returned fields.
    const payment = await getRazorpay().payments.fetch(paymentId);
    if (!payment || payment.order_id !== orderId) return res.status(400).json({ error: 'Payment order verification failed' });
    if (Number(payment.amount) !== Number(intent.amount_paise)) return res.status(400).json({ error: 'Payment amount verification failed' });
    if (String(payment.currency || '').toUpperCase() !== String(intent.currency || 'INR').toUpperCase()) {
      return res.status(400).json({ error: 'Payment currency verification failed' });
    }
    if (!['authorized', 'captured'].includes(payment.status)) {
      return res.status(409).json({ error: 'Payment is not yet confirmed' });
    }

    const verifiedAt = new Date().toISOString();
    const nextStatus = payment.status === 'captured' ? 'paid' : 'verified';
    const { error: updateError } = await supabase
      .from('support_intents')
      .update({ status: nextStatus, razorpay_payment_id: paymentId, verified_at: verifiedAt })
      .eq('id', intentId);
    if (updateError) throw updateError;

    const { error: paymentError } = await supabase.from('payments').upsert({
      intent_id: intentId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      status: payment.status === 'captured' ? 'verified' : 'authorized',
      verified_at: verifiedAt
    }, { onConflict: 'razorpay_payment_id' });
    if (paymentError) throw paymentError;

    return res.status(200).json({ ok: true, reference: intent.reference, status: nextStatus });
  } catch (error) {
    console.error('verify-payment error', error);
    return res.status(500).json({ error: 'Unable to verify payment' });
  }
}
