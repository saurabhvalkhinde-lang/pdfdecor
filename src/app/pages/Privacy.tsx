import { Shield, Cookie, ExternalLink, Mail } from 'lucide-react';
import { Link } from 'react-router';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8 mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
          <Shield className="h-3.5 w-3.5" />
          Privacy Policy
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PDFDecor Privacy Policy</h1>
        <p className="text-gray-600">
          This policy explains what data PDFDecor collects, how it is used, and what choices you have.
        </p>
        <p className="text-xs text-gray-500 mt-3">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">1) Overview</h2>
          <p>
            PDFDecor is a client-side document generator. Most document content you type (invoice details, certificate text,
            etc.) is processed in your browser to render a preview and export a PDF.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">2) Data we store</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <b>Account data</b> (if you sign up): email and basic profile fields.
            </li>
            <li>
              <b>Business Profile</b> (Pro): company name, GSTIN, address, logo, UPI ID, bank fields and preferences.
            </li>
            <li>
              <b>PDF History</b> (Pro): saved document data to help you re-download and reuse later.
            </li>
            <li>
              <b>Analytics (local)</b>: aggregated counts (e.g., total PDFs generated) to power the Analytics dashboard.
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            In the current version of PDFDecor, the above data is stored in your browser storage (localStorage).
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">3) Cookies & advertising</h2>
          <div className="flex items-start gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mt-0.5">
              <Cookie className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p>
                Free-plan pages may display advertising. Ad networks may use cookies or device identifiers to serve ads and
                measure performance.
              </p>
              <p className="mt-2">
                You can learn more about Googles publisher privacy requirements here:
                {' '}
                <a
                  href="https://support.google.com/adsense/answer/1348695?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Required content (AdSense)
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">4) Your choices</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Do not sign up (you can use most free generators without an account).</li>
            <li>Clear your browser storage to remove saved profile/history data on this device.</li>
            <li>Upgrade to Pro to remove ads and watermark from PDFs.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">5) Contact</h2>
          <p>If you have questions about privacy, contact:</p>
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
