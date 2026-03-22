/**
 * Vercel Serverless Function: POST /api/razorpay/verify-payment
 * Verifies Razorpay payment signature using HMAC SHA256.
 * Requires env var: RAZORPAY_KEY_SECRET
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error('[verify-payment] Missing RAZORPAY_KEY_SECRET env var');
    return res.status(500).json({ ok: false, error: 'Payment gateway not configured.' });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = (req.body || {}) as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      ok: false,
      error: 'Missing fields: razorpay_order_id, razorpay_payment_id, razorpay_signature',
    });
  }

  const payload  = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  const ok = expected === razorpay_signature;

  if (!ok) {
    console.warn('[verify-payment] Signature mismatch');
  }

  return res.status(200).json({ ok });
}
