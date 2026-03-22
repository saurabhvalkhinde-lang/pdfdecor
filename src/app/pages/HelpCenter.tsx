/**
 * Help Center page — /help
 * Full SEO-optimised help page with:
 *  • Hero search
 *  • Category cards
 *  • Full FAQ accordion
 *  • Razorpay billing guide
 *  • Contact section
 */
import { useState } from 'react';
import {
  Search, ChevronDown, ChevronUp, MessageCircle, Mail,
  Crown, FileText, Zap, Shield, Download, CreditCard,
  HelpCircle, ExternalLink, Check, Book,
} from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = [
  { icon: '📄', title: 'PDF Generation', desc: 'Download issues, quality, formats', color: 'blue' },
  { icon: '💳', title: 'Billing & Payment', desc: 'Razorpay, subscription, refunds', color: 'green' },
  { icon: '🏢', title: 'Business Profile', desc: 'Auto-fill, logo, templates', color: 'purple' },
  { icon: '📦', title: 'Bulk Generation', desc: 'CSV, Excel, ZIP download', color: 'amber' },
  { icon: '🔒', title: 'Account & Security', desc: 'Login, password, data privacy', color: 'red' },
  { icon: '⚡', title: 'Pro Features', desc: 'Upgrade, Pro benefits, comparison', color: 'indigo' },
];

const ALL_FAQS = [
  // PDF
  { cat: 'PDF Generation', q: 'Why is my PDF not downloading?', a: 'Ensure the document preview is visible (click the eye icon if hidden). The PDF engine captures the preview element. If the issue persists, try a different browser — Chrome/Edge work best.' },
  { cat: 'PDF Generation', q: 'My PDF shows a watermark. How do I remove it?', a: 'Watermarks appear on Free plan. Upgrade to Pro (₹249/month) to permanently remove all watermarks, PDFDecor footer branding, and ads from every PDF you generate.' },
  { cat: 'PDF Generation', q: 'Can I generate unlimited PDFs?', a: 'Yes — both Free and Pro plans offer unlimited PDF generation with no daily or monthly caps.' },
  { cat: 'PDF Generation', q: 'What PDF quality / resolution do I get?', a: 'PDFs are captured at 2× retina resolution, making them print-ready at 300 DPI equivalent. Pro users benefit from priority rendering for faster generation.' },
  { cat: 'PDF Generation', q: 'Which browsers are supported?', a: 'Chrome 90+, Edge 90+, Firefox 88+, and Safari 14+. Chrome gives the best rendering results for complex templates.' },
  { cat: 'PDF Generation', q: 'Can I download PDFs on mobile / tablet?', a: 'Yes. PDFDecor is fully responsive. On iOS, PDFs open in Safari\'s built-in viewer — tap the Share icon to save to Files.' },
  // Billing
  { cat: 'Billing & Payment', q: 'How does the Razorpay payment work?', a: 'Click Upgrade to Pro, choose Monthly (₹249) or Yearly (₹2,390), then Razorpay\'s secure checkout opens. Pay via UPI, Credit/Debit Card, Net Banking, or Wallets. Your account is upgraded instantly on successful payment.' },
  { cat: 'Billing & Payment', q: 'What are the Pro plan prices?', a: 'Monthly plan: ₹249/month. Annual plan: ₹2,390/year (equivalent to ₹199/month — save 20%). Both plans include all Pro features.' },
  { cat: 'Billing & Payment', q: 'Is my card/UPI info stored?', a: 'No. PDFDecor never stores payment details. All transactions are processed by Razorpay (PCI-DSS Level 1 certified), the same gateway used by thousands of Indian businesses.' },
  { cat: 'Billing & Payment', q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your profile. Pro features stay active until the billing period ends, then your account auto-downgrades to Free.' },
  { cat: 'Billing & Payment', q: 'What if I paid but my account is still Free?', a: 'Refresh the page and re-login. If still not upgraded, contact support via WhatsApp with your Razorpay Payment ID (starts with "pay_"). We resolve this within 1 hour for Pro users.' },
  { cat: 'Billing & Payment', q: 'Do you offer refunds?', a: 'Yes — 7-day no-questions-asked refund policy. Email support@pdfdecor.in with your payment ID within 7 days of purchase.' },
  { cat: 'Billing & Payment', q: 'Can I switch from monthly to yearly?', a: 'Yes. After your monthly period expires, select the yearly plan during renewal. Contact support if you want to switch mid-cycle.' },
  // Profile / Templates
  { cat: 'Business Profile', q: 'What is the Business Profile feature?', a: 'Pro users can save company name, GST, address, logo, UPI ID, bank details, invoice prefix, and default tax rate. These auto-fill into every document type you create.' },
  { cat: 'Business Profile', q: 'Can Free users try Pro templates?', a: 'You can preview Pro templates (4 & 5) but downloading requires Pro. A free watermarked download is available to help you evaluate before upgrading.' },
  { cat: 'Business Profile', q: 'How do I upload my company logo?', a: 'Go to Profile → Business Profile → click the Logo field → upload a JPG/PNG up to 2MB. It auto-fills into supported templates immediately.' },
  { cat: 'Business Profile', q: 'What happens to my data when I downgrade?', a: 'Your business profile and PDF history are preserved for 90 days after downgrade. Upgrade again to regain full access. Your documents remain downloadable (with watermark) on Free plan.' },
  // Bulk
  { cat: 'Bulk Generation', q: 'How does Bulk Certificate Generation work?', a: 'Navigate to Documents → Bulk Certificates. Upload a CSV/Excel with a "recipientName" column (plus optional fields like date, description). Choose a template, click Generate — a PDF is created for each row.' },
  { cat: 'Bulk Generation', q: 'How does Bulk Event Pass Generation work?', a: 'Navigate to Documents → Bulk Event Passes. Upload a CSV with a "passHolder" column. Fill in event details once (name, date, venue), then generate all passes at once.' },
  { cat: 'Bulk Generation', q: 'What CSV columns are supported?', a: 'Certificates: recipientName, certificateTitle, description, date, signatureName, signatureTitle, organizationName, serialNumber. Event Passes: passHolder, passType, passNumber, description, validFor. Download the sample CSV from each page for the exact format.' },
  { cat: 'Bulk Generation', q: 'Is there a limit on bulk generation?', a: 'No hard limit. Batches of up to 200 work smoothly. For 500+ records, split into multiple batches for best performance.' },
  // Account
  { cat: 'Account & Security', q: 'Do I need an account?', a: 'No. Free features work without an account. You need an account only to upgrade to Pro and use features like Business Profile, PDF History, and Analytics.' },
  { cat: 'Account & Security', q: 'Where is my data stored?', a: 'All document data, business profiles, and history are stored in your browser\'s localStorage — never uploaded to a server. PDFDecor processes PDFs entirely client-side.' },
  { cat: 'Account & Security', q: 'How do I reset my password?', a: 'Email support@pdfdecor.in from your registered email address. We\'ll verify your identity and send a temporary password within 24 hours.' },
  { cat: 'Account & Security', q: 'Is PDFDecor GDPR / DPDP compliant?', a: 'Yes. No document content is transmitted to our servers. Payment data is handled by Razorpay (PCI-DSS). Analytics are anonymous aggregates only.' },
  // Pro
  { cat: 'Pro Features', q: 'What\'s included in the Pro plan?', a: 'No watermarks, no ads, no PDFDecor branding, 5 templates per document type (2 exclusive), Business Profile auto-fill, PDF history (save/edit/re-download), bulk certificate & event pass generation, custom invoice numbering, brand color, logo upload, custom footer, analytics dashboard, and priority support.' },
  { cat: 'Pro Features', q: 'How many templates are there in total?', a: '5 templates × 10 document types = 50 templates. Free plan gives 3/type (30 templates). Pro gives all 5/type (50 templates), including 2 exclusive Pro-only designs per type.' },
  { cat: 'Pro Features', q: 'Does Pro include bulk certificate generation?', a: 'Yes! Bulk Certificate and Bulk Event Pass generation are exclusive Pro features. Upload CSV/Excel files and generate hundreds of documents in one go.' },
];

export function HelpCenter() {
  const { isPro } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filtered = ALL_FAQS.filter(f => {
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || f.cat === activeCategory;
    return matchSearch && matchCat;
  });

  const groupedFiltered: Record<string, typeof ALL_FAQS> = {};
  filtered.forEach(f => {
    if (!groupedFiltered[f.cat]) groupedFiltered[f.cat] = [];
    groupedFiltered[f.cat].push(f);
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-8 px-6">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
          <HelpCircle className="h-3.5 w-3.5" />
          Help Center
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">How can we help you?</h1>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Find answers to common questions about PDF generation, billing, Pro features, and more.
        </p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles…"
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveCategory(null); }}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-base"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category cards */}
      {!search && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(activeCategory === cat.title ? null : cat.title)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                activeCategory === cat.title
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-2">{cat.icon}</span>
              <p className="font-semibold text-gray-800 text-sm">{cat.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{cat.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(search || activeCategory) && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
            {search ? ` for "${search}"` : ''}
            {activeCategory ? ` in ${activeCategory}` : ''}
          </p>
          <button
            onClick={() => { setSearch(''); setActiveCategory(null); }}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* FAQ accordion */}
      <div className="space-y-4 mb-12">
        {Object.entries(groupedFiltered).map(([cat, faqs]) => (
          <div key={cat} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <span>{CATEGORIES.find(c => c.title === cat)?.icon}</span>
                {cat}
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {faqs.map((faq, i) => {
                const key = `${cat}-${i}`;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === key ? null : key)}
                      className="w-full flex items-start justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-800 text-sm pr-4 leading-snug">{faq.q}</span>
                      {openFaq === key
                        ? <ChevronUp className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      }
                    </button>
                    {openFaq === key && (
                      <div className="px-5 pb-5">
                        <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-xl p-4 border border-blue-100">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-700 font-semibold mb-1">No results found</p>
            <p className="text-gray-500 text-sm">Try a different search term or browse categories above.</p>
          </div>
        )}
      </div>

      {/* Razorpay Payment Guide */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 rounded-xl p-3">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Razorpay Payment Guide</h2>
            <p className="text-gray-600 text-sm">How to upgrade to PDFDecor Pro safely</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
              Accepted Payment Methods
            </h3>
            <ul className="space-y-2">
              {['UPI (GPay, PhonePe, Paytm, BHIM)', 'Credit Card (Visa, Mastercard, Amex)', 'Debit Card (all Indian banks)', 'Net Banking (200+ banks)', 'Wallets (Paytm, Mobikwik, etc.)', 'EMI (on qualifying cards)'].map(m => (
                <li key={m} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
              Security & Trust
            </h3>
            <ul className="space-y-2">
              {[
                'PCI-DSS Level 1 certified payment gateway',
                '256-bit SSL encryption on all transactions',
                'No card details stored by PDFDecor',
                '3D Secure authentication supported',
                'RBI regulated payment gateway',
                'Instant payment confirmation & receipt',
              ].map(s => (
                <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                  <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Step-by-Step: How to Upgrade</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Click "Upgrade to Pro" from any page or go to /pricing' },
              { step: '2', text: 'Log in or create a free account (required for Pro)' },
              { step: '3', text: 'Choose Monthly (₹249) or Yearly (₹2,390) plan' },
              { step: '4', text: 'Razorpay checkout opens — choose your payment method' },
              { step: '5', text: 'Complete payment — your account upgrades instantly' },
              { step: '6', text: 'Reload the page if needed — all Pro features activate immediately' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">{step}</span>
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
        <p className="text-gray-600 mb-6">Our support team is here to help. Reach out via any of these channels:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://wa.me/918236868703?text=Hi%20PDFDecor%20Support%2C%20I%20need%20help%20with..."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-green-50 border-2 border-green-200 hover:border-green-400 rounded-xl transition-all group"
          >
            <div className="bg-green-500 rounded-xl p-3">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800">WhatsApp Support</p>
              <p className="text-green-700 text-sm font-medium">+91 82368 68703</p>
              <p className="text-gray-500 text-xs mt-0.5">Fastest • Usually replies in &lt;2 hours</p>
            </div>
            <ExternalLink className="h-5 w-5 text-green-500 ml-auto group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="mailto:support@pdfdecor.in"
            className="flex items-center gap-4 p-5 bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all group"
          >
            <div className="bg-blue-500 rounded-xl p-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800">Email Support</p>
              <p className="text-blue-700 text-sm font-medium">support@pdfdecor.in</p>
              <p className="text-gray-500 text-xs mt-0.5">Response within 24 hours</p>
            </div>
            <ExternalLink className="h-5 w-5 text-blue-500 ml-auto group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {!isPro && (
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 text-white flex items-center justify-between gap-4">
            <div>
              <p className="font-bold mb-1">Upgrade to Pro for priority support</p>
              <p className="text-blue-100 text-sm">Pro users get responses within 4 hours, dedicated support channel, and direct WhatsApp priority queue.</p>
            </div>
            <Link
              to="/pricing"
              className="bg-white text-blue-600 hover:bg-gray-100 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors"
            >
              <Crown className="h-4 w-4 inline mr-1.5" />
              Upgrade
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
