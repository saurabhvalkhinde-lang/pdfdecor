import { ScrollText, ExternalLink, Mail } from 'lucide-react';
import { Link } from 'react-router';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8 mb-8">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
          <ScrollText className="h-3.5 w-3.5" />
          Terms of Service
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PDFDecor Terms of Service</h1>
        <p className="text-gray-600">By using PDFDecor, you agree to the terms below.</p>
        <p className="text-xs text-gray-500 mt-3">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">1) Service description</h2>
          <p>
            PDFDecor provides web-based tools to create documents (invoices, receipts, certificates, letters, ID cards and
            event passes) and export them as PDF.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">2) Free plan vs Pro plan</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Free plan may include ads and PDF watermark/branding.</li>
            <li>Pro plan is a paid subscription that removes ads/watermark and unlocks extra templates & tools.</li>
          </ul>
          <p className="mt-3">
            Pricing and plan details are shown on the{' '}
            <Link to="/pricing" className="text-blue-600 font-semibold hover:underline">Pricing</Link> page.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">3) Acceptable use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Do not misuse the service, attempt to disrupt it, or access it in an unauthorized way.</li>
            <li>You are responsible for the accuracy and legality of documents you generate.</li>
            <li>Do not upload content you do not have rights to use (logos, trademarks, copyrighted material).</li>
          </ul>
          <p className="mt-3">
            For advertising-related rules, refer to the AdSense Program Policies:
            {' '}
            <a
              href="https://support.google.com/adsense/answer/48182?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              AdSense Program policies
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">4) Disclaimer</h2>
          <p>
            PDFDecor is provided "as is". We do not provide legal, tax, or accounting advice. You should consult a
            professional for compliance requirements.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">5) Contact</h2>
          <p>Questions about terms can be sent to:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="mailto:support@pdfdecor.in"
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-xl font-semibold"
            >
              <Mail className="h-4 w-4" /> support@pdfdecor.in
            </a>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl font-semibold"
            >
              Help Center
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
