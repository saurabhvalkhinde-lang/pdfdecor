/**
 * razorpay.ts — PDFDecor
 * Client-side Razorpay integration.
 * Order creation + payment verification are handled by
 * Vercel Serverless Functions in /api/razorpay/.
 *
 * Required Vercel env vars (set in Vercel Dashboard → Project → Settings → Env Vars):
 *   RAZORPAY_KEY_ID     = rzp_test_SQCQwcV9oZv024
 *   RAZORPAY_KEY_SECRET = <your test secret>
 */

// ── Public Key (safe to expose in frontend) ───────────────────
export const RAZORPAY_KEY_ID = 'rzp_test_SQCQwcV9oZv024';

export const PLANS = {
  monthly: {
    id: 'plan_monthly_249',
    amount: 24900,
    currency: 'INR',
    label: '₹249 / month',
    description: 'PDFDecor Pro – Monthly',
    period: 'monthly' as const,
  },
  yearly: {
    id: 'plan_yearly_2390',
    amount: 239000,
    currency: 'INR',
    label: '₹2,390 / year',
    description: 'PDFDecor Pro – Yearly (Save 20%)',
    period: 'yearly' as const,
  },
};

// ── Types ─────────────────────────────────────────────────────
export interface RazorpayOrderResponse {
  id: string;        // real order_XXXXXXXXXXXXXXXX from Razorpay
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayPaymentResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayPaymentResult) => void;
  modal?: { ondismiss?: () => void };
  notes?: Record<string, string>;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (data?: any) => void) => void;
    };
  }
}

// ── Load Razorpay SDK ─────────────────────────────────────────
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (typeof window.Razorpay !== 'undefined') { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

// ── Create Order via Vercel Serverless ────────────────────────
export async function createRazorpayOrder(
  plan: 'monthly' | 'yearly',
  userEmail: string,
): Promise<RazorpayOrderResponse> {
  const res = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, userEmail }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to create payment order');
  }
  return data as RazorpayOrderResponse;
}

// ── Verify Payment via Vercel Serverless ──────────────────────
export async function verifyRazorpayPayment(
  result: RazorpayPaymentResult,
): Promise<boolean> {
  const res = await fetch('/api/razorpay/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return !!data.ok;
}

// ── Open Razorpay Checkout ────────────────────────────────────
export interface CheckoutOptions {
  plan: 'monthly' | 'yearly';
  userEmail: string;
  userName?: string;
  userPhone?: string;
  onSuccess: (paymentId: string, plan: 'monthly' | 'yearly') => void;
  onFailure: (reason: string) => void;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout(opts: CheckoutOptions): Promise<void> {
  const { plan, userEmail, userName, userPhone, onSuccess, onFailure, onDismiss } = opts;
  const p = PLANS[plan];

  // 1. Load Razorpay SDK
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure('Failed to load Razorpay SDK. Please check your internet connection.');
    return;
  }

  // 2. Create real Order via Vercel serverless → Razorpay Orders API
  let order: RazorpayOrderResponse;
  try {
    order = await createRazorpayOrder(plan, userEmail);
  } catch (e: any) {
    onFailure(e?.message || 'Could not initiate payment. Please try again.');
    return;
  }

  // 3. Open Razorpay Checkout with real order_id
  const rzpOptions: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'PDFDecor',
    description: p.description,
    order_id: order.id,   // ← real Razorpay order_id (order_XXXXXXXX)
    prefill: {
      email: userEmail,
      name: userName || '',
      contact: userPhone || '',
    },
    theme: { color: '#2563eb' },
    notes: { plan, userEmail },
    handler: async (response: RazorpayPaymentResult) => {
      const verified = await verifyRazorpayPayment(response);
      if (verified) {
        onSuccess(response.razorpay_payment_id, plan);
      } else {
        onFailure('Payment verification failed. Please contact support@pdfdecor.in');
      }
    },
    modal: {
      ondismiss: () => { onDismiss?.(); },
    },
  };

  const rzp = new window.Razorpay(rzpOptions);
  rzp.on('payment.failed', (data: any) => {
    onFailure(
      data?.error?.description
        || 'Payment failed. Please try a different payment method.',
    );
  });
  rzp.open();
}
