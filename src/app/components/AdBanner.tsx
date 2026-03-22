import { useAuth } from '../contexts/AuthContext';
import { Crown, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'inline';
  /** Force show (useful in previews); defaults to auto */
  force?: boolean;
}

export function AdBanner({ position = 'top', force = false }: AdBannerProps) {
  const { isPro } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Pro users never see ads
  if (isPro && !force) return null;
  if (dismissed) return null;

  return (
    <div
      className={`relative w-full ${position === 'top' ? 'mb-4' : position === 'bottom' ? 'mt-6' : 'my-4'}`}
      role="complementary"
      aria-label="Upgrade promotion"
    >
      {/* Realistic-looking ad container */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Ad label */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-200">
          <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Free plan notice</span>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            aria-label="Close ad"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* Ad content area (728×90 standard banner) */}
        <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Mock ad copy */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Crown className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">PDFDecor Pro — No Ads, No Watermarks</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Get professional PDFs with your branding. Just ₹249/month.
              </p>
            </div>
          </div>
          {/* Right: CTA */}
          <Link
            to="/pricing"
            className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md whitespace-nowrap"
          >
            Try Pro Free →
          </Link>
        </div>

        {/* Note: AdSense placeholders removed to keep the site policy-compliant.
            We only show an in-product upgrade promotion for Free users. */}
      </div>
    </div>
  );
}
