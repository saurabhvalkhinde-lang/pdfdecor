/**
 * SEOPageWrapper.tsx
 * ─────────────────────────────────────────────────────────────
 * Reusable SEO-optimised page shell for each document generator.
 * Provides: H1, meta description block, example PDF preview,
 * template gallery, FAQ accordion, trust signals, and CTA.
 * ─────────────────────────────────────────────────────────────
 */
import { useState, ReactNode } from 'react';
import { Link } from 'react-router';
import {
  ChevronRight, Crown, Download, Share2, MessageCircle,
  CheckCircle2, Layers, Star, Shield, HelpCircle, ArrowRight,
} from 'lucide-react';
import { AdBanner } from './AdBanner';
import { useAuth } from '../contexts/AuthContext';

interface FAQItem {
  q: string;
  a: string;
}

interface TrustBadge {
  icon: string;
  text: string;
}

interface SEOPageWrapperProps {
  /** Page headline — used as <h1> */
  headline: string;
  /** Sub-headline / meta description */
  description: string;
  /** Keywords block (comma separated, shown as chips) */
  keywords?: string[];
  /** Hero badge label (e.g. "Free Invoice Generator") */
  badge?: string;
  /** Section FAQs */
  faqs?: FAQItem[];
  /** Trust badges below the stats */
  trustBadges?: TrustBadge[];
  /** Stats row */
  stats?: Array<{ value: string; label: string }>;
  /** Template gallery content rendered inline */
  children: ReactNode;
  /** SEO body copy */
  seoCopy?: ReactNode;
  /** Current document slug for breadcrumb */
  docSlug?: string;
  /** Current document title for breadcrumb */
  docTitle?: string;
}

export function SEOPageWrapper({
  headline, description, keywords = [], badge, faqs = [], trustBadges = [],
  stats = [], children, seoCopy, docSlug, docTitle,
}: SEOPageWrapperProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isPro } = useAuth();

  const defaultStats = stats.length > 0 ? stats : [
    { value: '5L+', label: 'PDFs Generated' },
    { value: '50K+', label: 'Happy Users' },
    { value: '100%', label: 'GST Compliant' },
    { value: '₹0', label: 'To Start' },
  ];

  const defaultTrust: TrustBadge[] = trustBadges.length > 0 ? trustBadges : [
    { icon: '✅', text: 'No signup required' },
    { icon: '🔒', text: 'Data stays on device' },
    { icon: '📱', text: 'Mobile friendly' },
    { icon: '🚀', text: 'Instant download' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      {docTitle && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/" className="hover:text-blue-600">Documents</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 font-medium">{docTitle}</span>
        </nav>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl p-6 mb-6">
        {badge && (
          <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs px-3 py-1 rounded-full font-medium mb-3">
            <Star className="h-3 w-3 text-yellow-300" />
            {badge}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{headline}</h1>
        <p className="text-blue-100/90 text-sm md:text-base leading-relaxed max-w-2xl mb-4">
          {description}
        </p>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map(kw => (
              <span key={kw} className="text-[11px] bg-white/10 border border-white/20 text-white/80 px-2 py-0.5 rounded-full">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {defaultStats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        {defaultTrust.map(b => (
          <div key={b.text} className="flex items-center gap-1.5 text-sm text-gray-600 bg-white rounded-lg px-3 py-1.5 border border-gray-100 shadow-sm">
            <span>{b.icon}</span> {b.text}
          </div>
        ))}
        {!isPro && (
          <Link
            to="/pricing"
            className="flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-100 shadow-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Crown className="h-3.5 w-3.5 text-yellow-500" />
            Upgrade to Pro — remove watermark
          </Link>
        )}
      </div>

      {/* Main content (form + preview) */}
      <div className="mb-6">
        {children}
      </div>

      {/* How to use */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-100 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          How to Use This Generator
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', icon: Layers, title: 'Select Template', desc: 'Choose from 5 designs. Free users get 3.' },
            { step: '2', icon: CheckCircle2, title: 'Fill Details', desc: 'Enter your business and client information.' },
            { step: '3', icon: Share2, title: 'Preview Live', desc: 'See real-time preview as you type.' },
            { step: '4', icon: Download, title: 'Download PDF', desc: 'High-resolution A4 PDF ready to print or share.' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro upsell (free users) */}
      {!isPro && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white mb-6 flex flex-col sm:flex-row items-center gap-4">
          <Crown className="h-10 w-10 text-yellow-300 flex-shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-lg">Remove Watermark with Pro</p>
            <p className="text-blue-100 text-sm">
              Unlock all 5 templates, remove watermark & ads, enable business autofill, PDF history, and bulk generation.
            </p>
          </div>
          <Link
            to="/pricing"
            className="flex-shrink-0 bg-white text-blue-600 hover:bg-gray-100 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg flex items-center gap-2"
          >
            <Crown className="h-4 w-4 text-yellow-500" />
            Get Pro — ₹249/mo
          </Link>
        </div>
      )}

      <AdBanner position="inline" />

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  <ChevronRight
                    className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trust section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Shield, color: 'text-green-500', title: 'Secure & Private', desc: 'Data never leaves your browser. Zero server storage for free users.' },
          { icon: CheckCircle2, color: 'text-blue-500', title: 'GST Compliant', desc: 'GSTIN, CGST/SGST/IGST split, Indian number formatting built-in.' },
          { icon: MessageCircle, color: 'text-purple-500', title: 'WhatsApp Ready', desc: 'Share PDFs directly via WhatsApp with one click — clients love it.' },
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <t.icon className={`h-6 w-6 ${t.color} flex-shrink-0 mt-0.5`} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SEO copy */}
      {seoCopy && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6 text-sm text-gray-600 leading-relaxed">
          {seoCopy}
        </div>
      )}

      <AdBanner position="bottom" />
    </div>
  );
}
