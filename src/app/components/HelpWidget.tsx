/**
 * HelpWidget.tsx
 * ─────────────────────────────────────────────────────────────
 * Floating help button (bottom-right) that opens a full Help Center
 * drawer with:
 *  • FAQ accordion
 *  • Quick links to all document types
 *  • Contact options (WhatsApp, Email)
 *  • Razorpay billing FAQ
 *  • Keyboard shortcut (? or H)
 * ─────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from 'react';
import {
  HelpCircle, X, ChevronDown, ChevronUp, MessageCircle,
  Mail, ExternalLink, Crown, FileText, Search,
  Book, CreditCard, Download, Shield, Zap,
} from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

// ── FAQ Data ──────────────────────────────────────────────────
const FAQ_SECTIONS = [
  {
    icon: '📄',
    title: 'PDF Generation',
    faqs: [
      {
        q: 'Why is my PDF not downloading?',
        a: 'Make sure the preview is visible before clicking Download. The PDF is generated from the preview — if it is hidden, click the eye icon to show it first, then download.',
      },
      {
        q: 'My PDF has a watermark. How do I remove it?',
        a: 'Watermarks are added for Free plan users. Upgrade to Pro to remove all watermarks, PDFDecor branding, and footer text from your PDFs.',
      },
      {
        q: 'Can I generate unlimited PDFs?',
        a: 'Yes! Both Free and Pro users can generate unlimited PDFs. There are no generation limits.',
      },
      {
        q: 'What is the PDF quality like?',
        a: 'PDFs are generated at 2× resolution for crisp, print-ready output. Pro users get priority rendering for faster generation.',
      },
      {
        q: 'Can I download PDFs on mobile?',
        a: 'Yes, PDFDecor is fully mobile-responsive. Tap Download and the PDF will save to your device.',
      },
    ],
  },
  {
    icon: '💳',
    title: 'Billing & Subscription',
    faqs: [
      {
        q: 'How does payment work?',
        a: 'We use Razorpay — India\'s most trusted payment gateway. You can pay via UPI, Credit/Debit Card, Net Banking, or Wallets. All transactions are secured with 256-bit SSL encryption.',
      },
      {
        q: 'What are the Pro plan prices?',
        a: 'Pro costs ₹249/month or ₹2,390/year (save 20%). Annual plan saves you ₹598 compared to monthly billing.',
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes, you can cancel anytime. Your Pro benefits remain active until the end of your billing period. After expiry, your account automatically downgrades to Free (watermarks re-apply, ads return).',
      },
      {
        q: 'Is my payment information stored?',
        a: 'No. PDFDecor never stores your card details. All payment data is handled securely by Razorpay and encrypted using industry-standard PCI-DSS compliance.',
      },
      {
        q: 'I paid but my account is still Free. What do I do?',
        a: 'Please refresh the page and log in again. If the issue persists, contact us via WhatsApp or email with your Razorpay Payment ID.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'We offer a 7-day refund policy if you are not satisfied. Contact us within 7 days of payment with your payment ID.',
      },
    ],
  },
  {
    icon: '🏢',
    title: 'Business Profile & Templates',
    faqs: [
      {
        q: 'What is the Business Profile?',
        a: 'Pro users can save their company name, GST, address, logo, UPI ID, bank details and more. This auto-fills all document types — saving you time every time you create a document.',
      },
      {
        q: 'Can I use Pro templates on Free plan?',
        a: 'You can preview Pro templates (Templates 4 & 5) but cannot download them without upgrading. The download will prompt you to upgrade to Pro.',
      },
      {
        q: 'How many templates are available?',
        a: 'Each document type has 5 templates — 3 free and 2 exclusive Pro designs. That\'s 50 templates across 10 document types.',
      },
      {
        q: 'Can I add my company logo?',
        a: 'Yes! Pro users can upload a logo in the Business Profile. It auto-fills into all document templates that support logo display.',
      },
    ],
  },
  {
    icon: '📦',
    title: 'Bulk Generation (Pro)',
    faqs: [
      {
        q: 'How does Bulk Certificate Generation work?',
        a: 'Upload a CSV or Excel file with recipient names and details. The system generates a PDF certificate for each row and downloads them. Go to Documents → Bulk Certificates.',
      },
      {
        q: 'How does Bulk Event Pass Generation work?',
        a: 'Same as bulk certificates — upload your attendee list via CSV/Excel, choose a template and event details, and all passes are generated and downloaded. Go to Documents → Bulk Event Passes.',
      },
      {
        q: 'What CSV format should I use?',
        a: 'Download the sample CSV from the bulk generation page. Key columns: "recipientName" (certificates) or "passHolder" (passes). Optional columns: description, date, serialNumber, passType.',
      },
      {
        q: 'Is there a limit on bulk generation?',
        a: 'There is no hard limit. However, very large batches (500+) may take longer. We recommend batches of up to 200 for best performance.',
      },
    ],
  },
  {
    icon: '🔒',
    title: 'Account & Security',
    faqs: [
      {
        q: 'Do I need an account to use PDFDecor?',
        a: 'No! Free plan features are available without any account. You only need to create an account to upgrade to Pro and access features like Business Profile, PDF History, and Analytics.',
      },
      {
        q: 'Where is my data stored?',
        a: 'All data (business profile, PDF history, preferences) is stored locally in your browser\'s localStorage. PDFDecor does not upload your document data to any server.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Currently, password reset is handled manually. Contact us via email with your registered email address and we\'ll help you regain access.',
      },
      {
        q: 'Is PDFDecor GDPR compliant?',
        a: 'Yes. We do not collect or transmit your document content. Analytics data is anonymous and aggregated. Payment data is handled by Razorpay under PCI-DSS standards.',
      },
    ],
  },
];

// ── Quick Links ───────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'Invoice Generator', path: '/invoice', emoji: '🧾' },
  { label: 'Bill Generator', path: '/bill', emoji: '📃' },
  { label: 'Receipt', path: '/receipt', emoji: '🧾' },
  { label: 'Certificate', path: '/certificate', emoji: '🏆' },
  { label: 'Quotation', path: '/quotation', emoji: '💼' },
  { label: 'Offer Letter', path: '/offer-letter', emoji: '📨' },
  { label: 'Event Pass', path: '/event-pass', emoji: '🎫' },
  { label: 'ID Card', path: '/id-card', emoji: '🪪' },
  { label: 'Pricing', path: '/pricing', emoji: '💎' },
];

// ── Component ─────────────────────────────────────────────────
export function HelpWidget() {
  const { isPro, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(0);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'faq' | 'contact' | 'links'>('faq');

  // Keyboard shortcut: ? opens help
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === '?' || e.key === 'h') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setOpen(v => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Filter FAQs by search
  const filteredSections = FAQ_SECTIONS.map(section => ({
    ...section,
    faqs: section.faqs.filter(
      f =>
        !search ||
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter(s => s.faqs.length > 0);

  const faqKey = (si: number, fi: number) => `${si}-${fi}`;

  return (
    <>
      {/* ── Floating Button ──────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Tooltip */}
        {!open && (
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none select-none animate-bounce hidden md:block">
            Help & Support
          </div>
        )}

        <button
          onClick={() => setOpen(v => !v)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            open
              ? 'bg-red-500 hover:bg-red-600 rotate-90'
              : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-110'
          }`}
          aria-label={open ? 'Close help' : 'Open help center'}
          title="Help Center (press ?)"
        >
          {open ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <HelpCircle className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* ── Help Drawer ──────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end pointer-events-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full sm:w-[420px] h-[90vh] sm:h-[85vh] sm:mr-6 sm:mb-6 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden border border-gray-200">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-xl p-2">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Help Center</h2>
                    <p className="text-blue-100 text-xs">How can we help you today?</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-white/20 hover:bg-white/30 rounded-lg p-1.5 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setTab('faq'); }}
                  className="w-full bg-white/20 border border-white/30 rounded-xl pl-9 pr-4 py-2 text-white placeholder-blue-200 text-sm focus:outline-none focus:bg-white/30"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 flex-shrink-0">
              {[
                { key: 'faq', label: 'FAQ', icon: Book },
                { key: 'links', label: 'Quick Links', icon: ExternalLink },
                { key: 'contact', label: 'Contact', icon: MessageCircle },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors border-b-2 ${
                    tab === key
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">

              {/* ── FAQ Tab ─────────────────────────────────── */}
              {tab === 'faq' && (
                <div className="p-4 space-y-3">
                  {filteredSections.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No results for "{search}"</p>
                      <button
                        onClick={() => setSearch('')}
                        className="text-blue-600 text-xs underline mt-2"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    filteredSections.map((section, si) => (
                      <div key={si} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setActiveSection(activeSection === si ? null : si)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
                            <span className="text-base">{section.icon}</span>
                            {section.title}
                            <span className="text-xs text-gray-400 font-normal">({section.faqs.length})</span>
                          </span>
                          {activeSection === si
                            ? <ChevronUp className="h-4 w-4 text-gray-500" />
                            : <ChevronDown className="h-4 w-4 text-gray-500" />
                          }
                        </button>

                        {activeSection === si && (
                          <div className="divide-y divide-gray-100">
                            {section.faqs.map((faq, fi) => {
                              const key = faqKey(si, fi);
                              return (
                                <div key={fi}>
                                  <button
                                    onClick={() => setActiveFaq(activeFaq === key ? null : key)}
                                    className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                  >
                                    <span className="text-sm text-gray-700 font-medium pr-3 leading-snug">
                                      {faq.q}
                                    </span>
                                    {activeFaq === key
                                      ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                      : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                    }
                                  </button>
                                  {activeFaq === key && (
                                    <div className="px-4 pb-4">
                                      <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-lg p-3">
                                        {faq.a}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── Quick Links Tab ──────────────────────────── */}
              {tab === 'links' && (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Document Generators</p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_LINKS.filter(l => l.path !== '/pricing').map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all group"
                      >
                        <span className="text-lg">{link.emoji}</span>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 leading-tight">{link.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Pro tools */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Pro Bulk Tools</p>
                    <div className="space-y-2">
                      {[
                        { path: '/bulk-certificate', label: 'Bulk Certificate Generator', emoji: '🎓' },
                        { path: '/bulk-event-pass', label: 'Bulk Event Pass Generator', emoji: '🎫' },
                      ].map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 hover:border-amber-300 transition-all"
                        >
                          <span className="text-lg">{link.emoji}</span>
                          <span className="text-xs font-semibold text-amber-800">{link.label}</span>
                          <Crown className="h-3 w-3 text-amber-500 ml-auto" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Pricing CTA */}
                  {!isPro && (
                    <Link
                      to="/pricing"
                      onClick={() => setOpen(false)}
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      <Crown className="h-4 w-4 inline mr-2" />
                      Upgrade to Pro — ₹249/month
                    </Link>
                  )}
                </div>
              )}

              {/* ── Contact Tab ──────────────────────────────── */}
              {tab === 'contact' && (
                <div className="p-4 space-y-4">
                  {/* Status */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">Support is online</p>
                      <p className="text-xs text-green-600">Typical reply time: within 24 hours (Pro: within 4 hours)</p>
                    </div>
                  </div>

                  {/* Contact options */}
                  <div className="space-y-3">
                    <a
                      href="https://wa.me/918236868703?text=Hi%20PDFDecor%20Support%2C%20I%20need%20help%20with..."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 hover:border-green-400 rounded-xl transition-all group"
                    >
                      <div className="bg-green-500 rounded-xl p-2.5">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">WhatsApp Support</p>
                        <p className="text-xs text-gray-500">Fastest response • Chat now</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-green-500 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    <a
                      href={`mailto:support@pdfdecor.in?subject=PDFDecor Support${user?.email ? ` - ${user.email}` : ''}&body=Hi PDFDecor team,%0A%0AI need help with:%0A%0A`}
                      className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-xl transition-all group"
                    >
                      <div className="bg-blue-500 rounded-xl p-2.5">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">Email Support</p>
                        <p className="text-xs text-gray-500">support@pdfdecor.in</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* Razorpay payment issue */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-amber-600" />
                      <p className="font-semibold text-amber-800 text-sm">Payment Issue?</p>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      If your payment went through but account is still Free, please share your{' '}
                      <strong>Razorpay Payment ID</strong> (starts with <code>pay_</code>) via WhatsApp or email.
                      We'll activate your Pro plan within 1 hour.
                    </p>
                  </div>

                  {/* Feature request */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <p className="font-semibold text-purple-800 text-sm">Feature Request</p>
                    </div>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      Have an idea? We love user feedback! Drop us a message on WhatsApp or email with your suggestion.
                    </p>
                  </div>

                  {/* Pro support badge */}
                  {isPro && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="h-4 w-4 text-yellow-300" />
                        <p className="font-bold text-sm">Pro Priority Support</p>
                      </div>
                      <p className="text-xs text-blue-100">
                        As a Pro member, your support requests are prioritised. Average response: 4 hours.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-3 flex-shrink-0 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">PDFDecor v3.0 · <kbd className="bg-gray-200 px-1 py-0.5 rounded text-gray-600 font-mono">?</kbd> to toggle</p>
                <div className="flex items-center gap-3">
                  <Link to="/privacy" onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">Privacy</Link>
                  <Link to="/terms" onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">Terms</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
