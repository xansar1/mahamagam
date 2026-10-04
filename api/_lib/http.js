export function methodNotAllowed(res, allow = 'POST') {
  res.setHeader('Allow', allow);
  return res.status(405).json({ error: 'Method not allowed' });
}

export function noStore(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

export function getJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  if (Buffer.isBuffer(req.body)) {
    try { return JSON.parse(req.body.toString('utf8')); } catch { return {}; }
  }
  return {};
}

export function cleanText(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

export function cleanPhone(value) {
  return cleanText(value, 32).replace(/[^0-9+ ()-]/g, '');
}

export function isEmail(value) {
  const email = cleanText(value, 254);
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
