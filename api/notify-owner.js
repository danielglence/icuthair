const APP_ID = '94e4877a-081f-4297-8789-b580aa2e9681';
const ALLOWED_ORIGINS = new Set([
  'https://icuthair.vercel.app',
  'https://icuthairgroomingstudio.vercel.app',
]);

export default async function handler(request, response) {
  const origin = request.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Vary', 'Origin');
  if (request.method === 'OPTIONS') return response.status(204).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return response.status(403).json({ error: 'Origin not allowed' });

  const { name, service, date, time } = request.body || {};
  if (![name, service, date, time].every(value => typeof value === 'string' && value.trim() && value.length <= 100)) {
    return response.status(400).json({ error: 'Invalid booking details' });
  }
  if (!process.env.ONESIGNAL_REST_API_KEY) return response.status(503).json({ error: 'Push notifications are not configured' });

  const pushResponse = await fetch('https://api.onesignal.com/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: APP_ID,
      target_channel: 'push',
      included_segments: ['Subscribed Users'],
      headings: { en: 'New booking received' },
      contents: { en: `${name.trim()} booked ${service.trim()} on ${date.trim()} at ${time.trim()}` },
      web_url: 'https://icuthair.vercel.app/owner/dashboard',
      chrome_web_icon: 'https://icuthair.vercel.app/favicon.svg',
    }),
  });
  const result = await pushResponse.json();
  return response.status(pushResponse.ok ? 200 : 502).json(pushResponse.ok ? { sent: true } : { error: 'Push delivery failed', details: result });
}
