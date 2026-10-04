import { getSupabaseAdmin } from './_lib/supabase.js';
import { methodNotAllowed, noStore, getJsonBody, cleanText, cleanPhone, isEmail } from './_lib/http.js';

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'POST') return methodNotAllowed(res);
  try {
    const body = getJsonBody(req);
    const name = cleanText(body.name, 120);
    const phone = cleanPhone(body.phone);
    const email = cleanText(body.email, 254).toLowerCase();
    const interest = cleanText(body.interest, 80);
    const category = cleanText(body.category, 160);
    const message = cleanText(body.message, 2000);
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
    if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email address' });
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('support_enquiries').insert({ name, phone, email: email || null, interest, category: category || null, message: message || null, source: 'website' });
    if (error) throw error;
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('enquiries error', error);
    return res.status(500).json({ error: 'Unable to record enquiry' });
  }
}
