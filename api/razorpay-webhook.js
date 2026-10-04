import { getSupabaseAdmin } from './_lib/supabase.js';
import { verifyWebhookSignature } from './_lib/razorpay.js';

export const runtime = 'nodejs';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  }
});

export async function POST(request) {
  try {
    // Razorpay requires the signature to be calculated from the exact raw request body.
    // Web Request.text() preserves the payload before JSON parsing.
    const rawText = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    if (!verifyWebhookSignature(Buffer.from(rawText, 'utf8'), signature)) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(rawText || '{}');
    const eventId = String(request.headers.get('x-razorpay-event-id') || event.id || '').slice(0, 160) || null;
    const supabase = getSupabaseAdmin();

    if (eventId) {
      const { data: existing, error: lookupError } = await supabase
        .from('payment_events')
        .select('id')
        .eq('event_id', eventId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) return json({ ok: true, duplicate: true });
    }

    const { error: eventError } = await supabase.from('payment_events').insert({
      event_id: eventId,
      event_type: event.event || 'unknown',
      payload: event
    });
    if (eventError) throw eventError;

    const payment = event?.payload?.payment?.entity;
    const order = event?.payload?.order?.entity;
    const orderId = payment?.order_id || order?.id || null;
    const paymentId = payment?.id || null;

    if (orderId && (event.event === 'payment.captured' || event.event === 'order.paid')) {
      const { error: updateError } = await supabase
        .from('support_intents')
        .update({
          status: 'paid',
          razorpay_payment_id: paymentId,
          verified_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', orderId);
      if (updateError) throw updateError;

      if (paymentId) {
        const { data: intent, error: intentError } = await supabase
          .from('support_intents')
          .select('id')
          .eq('razorpay_order_id', orderId)
          .maybeSingle();
        if (intentError) throw intentError;
        if (intent?.id) {
          const { error: paymentError } = await supabase.from('payments').upsert({
            intent_id: intent.id,
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            status: 'webhook_verified',
            verified_at: new Date().toISOString()
          }, { onConflict: 'razorpay_payment_id' });
          if (paymentError) throw paymentError;
        }
      }
    }

    if (orderId && event.event === 'payment.failed') {
      const { error: failedError } = await supabase
        .from('support_intents')
        .update({ status: 'payment_failed', razorpay_payment_id: paymentId })
        .eq('razorpay_order_id', orderId);
      if (failedError) throw failedError;
    }

    return json({ ok: true });
  } catch (error) {
    console.error('razorpay-webhook error', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
}

export function GET() {
  return json({ error: 'Method not allowed' }, 405);
}
