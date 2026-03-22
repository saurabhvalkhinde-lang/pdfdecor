/**
 * Vercel Serverless Function: POST /api/razorpay/create-order
 * Creates a real Razorpay Order using the Orders API (server-side, secure).
 * Requires env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Plan = 'monthly' | 'yearly';

const PLAN_AMOUNT_PAISE: Record<Plan, number> = {
  monthly: 24900,  // ₹249
  yearly: 239000,  // ₹2,390
};

function basicAuthHeader(keyId: string, keySecret: string) {
  return 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers (Vercel adds these but explicit is fine)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('[create-order] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env var');
    return res.status(500).json({ error: 'Payment gateway not configured. Contact support.' });
  }

  const { plan, userEmail } = (req.body || {}) as { plan?: string; userEmail?: string };

  if (plan !== 'monthly' && plan !== 'yearly') {
    return res.status(400).json({ error: 'Invalid plan. Must be monthly or yearly.' });
  }
  if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid userEmail is required.' });
  }

  const amount = PLAN_AMOUNT_PAISE[plan as Plan];

  try {
    const resp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicAuthHeader(keyId, keySecret),
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          plan,
          userEmail,
          app: process.env.APP_NAME || 'PDFDecor',
        },
      }),
    });

    const data = await resp.json() as any;

    if (!resp.ok) {
      console.error('[create-order] Razorpay error:', data);
      return res.status(500).json({
        error: data?.error?.description || 'Failed to create Razorpay order',
      });
    }

    return res.status(200).json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
    });
  } catch (e: any) {
    console.error('[create-order] Exception:', e?.message);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
}
