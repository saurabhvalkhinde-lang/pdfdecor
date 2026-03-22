/**
 * Pricing page — /pricing
 * Razorpay-powered upgrade flow with full feature comparison.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import {
  Check, X, Crown, Zap, Star, Shield, Loader2,
  AlertCircle, CheckCircle, CreditCard, HelpCircle,
} from 'lucide-react';
import { openRazorpayCheckout } from '../utils/razorpay';

type PaymentState = 'idle' | 'loading' | 'success' | 'error';

export function Pricing() {
  const { isAuthenticated, isPro, user, upgradeToPro, trackEvent } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    trackEvent('upgrade_click');

    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (isPro) {
      alert('You are already a Pro member! 🎉');
      return;
    }

    setPaymentState('loading');
    setErrorMsg('');

    await openRazorpayCheckout({
      plan: selectedPlan,
      userEmail: user.email,
      userName: user.name || '',
      onSuccess: async (paymentId, plan) => {
        const ok = await upgradeToPro(plan);
        if (ok) {
          setPaymentState('success');
          setTimeout(() => navigate('/'), 2500);
        } else {
          setPaymentState('error');
          setErrorMsg(`Payment received (${paymentId}) but activation failed. Contact support@pdfdecor.in.`);
        }
      },
      onFailure: reason => {
        setPaymentState('error');
        setErrorMsg(reason);
      },
      onDismiss: () => setPaymentState('idle'),
    });
  };

  // ── Success Screen ─────────────────────────────────────────
  if (paymentState === 'success') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Pro! 🎉</h1>
          <p className="text-gray-600 mb-1">Your account has been upgraded successfully.</p>
          <p className="text-gray-500 text-sm mb-6">All Pro features are now active. Redirecting you home…</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // ── Feature data ───────────────────────────────────────────
  const freeFeatures = [
    { text: 'All 10 PDF types', ok: true },
    { text: 'Unlimited PDF generation', ok: true },
    { text: '3 templates per document type', ok: true },
    { text: 'UPI QR code generation', ok: true },
    { text: 'Basic GST calculation', ok: true },
    { text: 'WhatsApp & Email sharing', ok: true },
    { text: 'Multi-language (EN, HI, MR)', ok: true },
    { text: 'Watermark on every PDF', ok: false },
    { text: 'Ads on all pages', ok: false },
    { text: 'PDFDecor footer branding', ok: false },
    { text: 'PDF history / Business Profile', ok: false },
  ];

  const proFeatures = [
    { text: 'Everything in Free', ok: true },
    { text: 'No watermark on any PDF', ok: true },
    { text: 'Zero ads — clean experience', ok: true },
    { text: 'No PDFDecor branding', ok: true },
    { text: '5 templates per type (2 exclusive)', ok: true },
    { text: 'Business Profile & auto-fill', ok: true },
    { text: 'Bank details on invoices/quotations', ok: true },
    { text: 'PDF History — save, edit, re-download', ok: true },
    { text: 'Custom invoice numbering', ok: true },
    { text: 'Custom brand color & logo upload', ok: true },
    { text: 'Custom footer text', ok: true },
    { text: 'Bulk certificate generation (CSV → ZIP)', ok: true },
    { text: 'Bulk event pass generation', ok: true },
    { text: 'Analytics dashboard', ok: true },
    { text: 'Priority support (≤4 hour response)', ok: true },
  ];

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Crown className="h-4 w-4 text-yellow-500" />
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free and upgrade when you need professional features.
          All payments secured by <strong>Razorpay</strong>.
        </p>
      </div>

      {/* ── Plan Toggle ─────────────────────────────────────── */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 rounded-full p-1 inline-flex gap-0.5">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-6 py-3 rounded-full font-semibold transition-all text-sm ${
              selectedPlan === 'monthly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-6 py-3 rounded-full font-semibold transition-all text-sm flex items-center gap-2 ${
              selectedPlan === 'yearly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Yearly
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* ── Plan Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">

        {/* Free */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Plan</h3>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-gray-900">₹0</span>
              <span className="text-gray-500 text-sm">forever</span>
            </div>
            <p className="text-gray-500 text-sm">Perfect for personal use</p>
          </div>
          <ul className="space-y-3 mb-8">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                {f.ok
                  ? <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  : <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                }
                <span className={f.ok ? 'text-gray-700 text-sm' : 'text-gray-400 text-sm'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => navigate('/')} variant="outline" className="w-full py-5 font-semibold">
            Start Free
          </Button>
        </div>

        {/* Pro */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/5 rounded-full" />

          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current" /> MOST POPULAR
            </span>
          </div>

          <div className="mb-6 relative z-10">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-300" /> Pro Plan
            </h3>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black">
                ₹{selectedPlan === 'monthly' ? '249' : '2,390'}
              </span>
              <span className="text-blue-200 text-sm">/{selectedPlan === 'monthly' ? 'month' : 'year'}</span>
            </div>
            {selectedPlan === 'yearly' && (
              <div className="bg-green-500/30 border border-green-400/50 rounded-lg px-3 py-1.5 inline-block">
                <p className="text-green-300 font-bold text-sm">💰 You save ₹598/year vs monthly</p>
              </div>
            )}
            {selectedPlan === 'monthly' && (
              <p className="text-blue-200 text-sm mt-1">≈ ₹8.30/day — less than a cup of chai ☕</p>
            )}
          </div>

          <ul className="space-y-2.5 mb-8 relative z-10">
            {proFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">{f.text}</span>
              </li>
            ))}
          </ul>

          {/* Error */}
          {paymentState === 'error' && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3 mb-4 flex items-start gap-2 relative z-10">
              <AlertCircle className="h-4 w-4 text-red-200 flex-shrink-0 mt-0.5" />
              <p className="text-red-100 text-xs">{errorMsg}</p>
            </div>
          )}

          <Button
            onClick={handleUpgrade}
            disabled={paymentState === 'loading' || isPro}
            className="w-full py-5 text-base font-bold bg-white text-blue-700 hover:bg-gray-50 shadow-xl relative z-10 rounded-xl"
          >
            {paymentState === 'loading' ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Opening Razorpay…</>
            ) : isPro ? (
              <><CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Current Plan</>
            ) : !isAuthenticated ? (
              <><Crown className="mr-2 h-5 w-5" /> Login to Upgrade</>
            ) : (
              <><CreditCard className="mr-2 h-5 w-5" /> Pay ₹{selectedPlan === 'monthly' ? '249' : '2,390'} via Razorpay</>
            )}
          </Button>

          <p className="text-center text-blue-200 text-xs mt-4 relative z-10">
            🔒 Secured by Razorpay · Cancel anytime · 7-day refund
          </p>

          {!isAuthenticated && (
            <p className="text-center text-blue-200 text-xs mt-2 relative z-10">
              No account?{' '}
              <Link to="/login" className="text-white font-bold underline">Sign up free →</Link>
            </p>
          )}
        </div>
      </div>

      {/* ── Payment Methods ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-10 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="h-6 w-6 text-green-500" />
          Secure Payment via Razorpay
        </h2>
        <p className="text-gray-500 text-sm mb-6">India's most trusted payment gateway — PCI-DSS Level 1 certified</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { icon: '📱', label: 'UPI', sub: 'GPay, PhonePe, Paytm' },
            { icon: '💳', label: 'Credit Card', sub: 'Visa, Mastercard, Amex' },
            { icon: '🏧', label: 'Debit Card', sub: 'All Indian banks' },
            { icon: '🏦', label: 'Net Banking', sub: '200+ banks' },
            { icon: '👛', label: 'Wallets', sub: 'Paytm, Mobikwik' },
            { icon: '📅', label: 'EMI', sub: 'Qualifying cards' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="font-semibold text-gray-800 text-xs">{label}</p>
              <p className="text-gray-400 text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Upgrade ─────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-blue-100 p-10 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
          <Zap className="h-7 w-7 text-blue-600" /> Why Businesses Choose Pro
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🎨', title: 'Professional Branding', desc: 'Remove watermarks, add your logo. Present your business with confidence.' },
            { icon: '⚡', title: 'Save Hours Every Week', desc: 'Auto-fill business details, reuse saved PDFs, custom invoice numbering.' },
            { icon: '📊', title: 'Business Insights', desc: 'Analytics dashboard shows which documents you generate most and more.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is Razorpay safe for Indian payments?', a: 'Absolutely. Razorpay is India\'s most trusted payment gateway, used by 10 lakh+ businesses. It is PCI-DSS Level 1 certified, RBI regulated, and supports 3D Secure authentication. Your card/UPI details are never stored by PDFDecor.' },
            { q: 'What happens when my subscription expires?', a: 'Your account automatically downgrades to the Free plan. Watermarks re-apply, ads return, and Pro-only features are disabled. Your saved data (business profile, PDF history) is preserved for 90 days.' },
            { q: 'Can I use PDFDecor for free forever?', a: 'Yes! The Free plan has no time limit. You can generate unlimited PDFs with all 10 document types. Upgrade only if you need watermark-free, ad-free, or Business Profile features.' },
            { q: 'Do you offer GST invoice for the subscription?', a: 'Yes. A GST invoice is automatically emailed to you by Razorpay upon successful payment. Contact support if you need a revised invoice with your GSTIN.' },
            { q: 'Can teams share a single Pro account?', a: 'Currently Pro is per-user. Team/agency pricing is on our roadmap. Contact us for custom enterprise pricing if you need multiple seats.' },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/help" className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline text-sm">
            <HelpCircle className="h-4 w-4" />
            More questions? Visit our Help Center
          </Link>
        </div>
      </div>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-10 text-white text-center mb-6">
        <h2 className="text-3xl font-bold mb-3">Ready to go Pro?</h2>
        <p className="text-blue-100 text-lg mb-8">Join thousands of Indian businesses using PDFDecor Pro</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-8 py-5 font-bold"
          >
            Continue Free
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={paymentState === 'loading' || isPro}
            className="bg-white text-blue-700 hover:bg-gray-50 px-8 py-5 font-bold shadow-xl"
          >
            {paymentState === 'loading' ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Opening…</>
            ) : isPro ? (
              '✅ You\'re Pro!'
            ) : (
              <><Crown className="mr-2 h-5 w-5 text-yellow-500" /> Upgrade to Pro — ₹{selectedPlan === 'monthly' ? '249/mo' : '2,390/yr'}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
