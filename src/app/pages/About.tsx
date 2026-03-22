import { Sparkles, Shield, FileText, Crown, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';

export function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8 mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          About PDFDecor
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create professional documents in seconds</h1>
        <p className="text-gray-600">
          PDFDecor is a fast, mobile-friendly document generator built for Indian businesses.
          Generate invoices, receipts, quotations, certificates, ID cards, and more — with live preview and instant PDF export.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: FileText, title: '10+ Document Types', desc: 'Invoices, receipts, quotations, certificates, letters, ID cards, event passes.' },
          { icon: Shield, title: 'Privacy-first', desc: 'Documents are rendered in your browser. No server upload needed for most workflows.' },
          { icon: Crown, title: 'Pro for teams', desc: 'No watermark, no ads, bulk generators, history, analytics, branding & autofill.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
              <f.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="font-bold text-gray-900 mb-1">{f.title}</h2>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Contact</h2>
        <p className="text-sm text-gray-600 mb-4">Need help with billing, downloads, or templates?</p>
        <div className="flex flex-wrap gap-2">
          <a
            href="mailto:support@pdfdecor.in"
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-xl font-semibold"
          >
            <Mail className="h-4 w-4" /> support@pdfdecor.in
          </a>
          <a
            href="https://wa.me/918236868703?text=Hi%20PDFDecor%20Support%2C%20I%20need%20help%20with..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl font-semibold"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Support
          </a>
          <Link
            to="/help"
            className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl font-semibold"
          >
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
