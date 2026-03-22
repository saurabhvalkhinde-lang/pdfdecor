/**
 * UpgradeModal.tsx
 * Full Razorpay checkout integration.
 */
import { useState } from 'react';
import { X, Check, Zap, Crown, Shield, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { openRazorpayCheckout, PLANS } from '../utils/razorpay';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
}

type PaymentState = 'idle' | 'loading' | 'success' | 'error';

export function UpgradeModal({ isOpen, onClose, trigger }: UpgradeModalProps) {
  const { isPro, isAuthenticated, user, upgradeToPro, trackEvent } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    // Not logged in → go to login
    if (!isAuthenticated || !user) {
      trackEvent('upgrade_click');
      navigate('/login');
      onClose();
      return;
    }

    setPaymentState('loading');
    setErrorMsg('');

    await openRazorpayCheckout({
      plan: selectedPlan,
      userEmail: user.email,
      userName: user.name || '',
      onSuccess: async (paymentId, plan) => {
        // Activate Pro in AuthContext
        const ok = await upgradeToPro(plan);
        if (ok) {
          setPaymentState('success');
          trackEvent('pdf_generated', { type: 'upgrade_success' });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2200);
        } else {
          setPaymentState('error');
          setErrorMsg('Payment received but activation failed. Contact support with Payment ID: ' + paymentId);
        }
      },
      onFailure: (reason) => {
        setPaymentState('error');
        setErrorMsg(reason);
      },
      onDismiss: () => {
        setPaymentState('idle');
      },
    });
  };

  const triggerMessages: Record<string, string> = {
    template: 'Unlock all 5 premium templates per document type',
    watermark: 'Remove watermarks from all your PDFs forever',
    history: 'Save, edit & re-download your PDF history',
    autofill: 'Auto-fill business details across all documents',
    ads: 'Enjoy a clean, ad-free experience',
    bulk: 'Generate bulk certificates & event passes',
    branding: 'Use your own logo & remove PDFDecor branding',
  };

  const freeLimitations = [
    'Watermark on every PDF',
    'Only 3 templates per document type',
    'Ads shown on all pages',
    'No PDF history',
    'No Business Profile auto-fill',
    'PDFDecor footer branding',
    'No bulk generation',
  ];

  const proFeaturesList = [
    '✅ No watermark on any PDF',
    '✅ All 5 templates + 2 exclusive designs',
    '✅ Zero ads anywhere',
    '✅ Business Profile & auto-fill',
    '✅ PDF history — save, edit, re-download',
    '✅ Bulk certificate & pass generation',
    '✅ Custom logo & brand color',
    '✅ Custom invoice numbering',
    '✅ Analytics dashboard',
    '✅ Priority support',
  ];

  // Success screen
  if (paymentState === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Pro! 🎉</h2>
          <p className="text-gray-600 mb-1">Welcome to PDFDecor Pro.</p>
          <p className="text-gray-500 text-sm">All Pro features are now active. Reloading…</p>
          <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse rounded-full w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <Crown className="h-7 w-7 text-yellow-500" />
              Upgrade to Pro
            </h2>
            {trigger && triggerMessages[trigger] && (
              <p className="text-gray-500 text-sm mt-1">{triggerMessages[trigger]}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Plan Picker */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-black text-gray-900">₹249</div>
              <div className="text-gray-500 text-sm">per month</div>
              <div className="text-gray-400 text-xs mt-1">Cancel anytime</div>
            </button>

            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                selectedPlan === 'yearly'
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="absolute -top-3 left-4">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                  BEST VALUE 🔥
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900">₹2,390</div>
              <div className="text-gray-500 text-sm">per year</div>
              <div className="text-green-600 text-xs font-semibold mt-1">Save ₹598 (20% off)</div>
            </button>
          </div>

          {/* Feature comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5">
                <X className="h-4 w-4 text-red-500" /> Free Plan
              </h4>
              <ul className="space-y-1.5">
                {freeLimitations.map((l, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="text-red-400 flex-shrink-0">✗</span> {l}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-300 rounded-2xl p-4">
              <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-yellow-500" /> Pro Plan
              </h4>
              <ul className="space-y-1.5">
                {proFeaturesList.map((f, i) => (
                  <li key={i} className="text-xs text-gray-700 font-medium leading-snug">{f}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Error message */}
          {paymentState === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold text-sm">Payment failed</p>
                <p className="text-red-600 text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={paymentState === 'loading'}
              className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
            >
              {paymentState === 'loading' ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Opening Razorpay…</>
              ) : !isAuthenticated ? (
                <><Crown className="mr-2 h-5 w-5" /> Login to Upgrade</>
              ) : (
                <><Crown className="mr-2 h-5 w-5" /> Pay ₹{selectedPlan === 'monthly' ? '249' : '2,390'} via Razorpay</>
              )}
            </Button>

            <Button onClick={onClose} variant="outline" className="w-full py-4 rounded-xl font-semibold text-gray-600">
              Continue with Free
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              Secured by Razorpay
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Check className="h-3.5 w-3.5 text-blue-500" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Check className="h-3.5 w-3.5 text-blue-500" />
              7-day refund
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
