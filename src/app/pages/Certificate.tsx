import { useState } from 'react';
import { Download, Eye, EyeOff, MessageCircle, Mail, Lock, Crown, Award, FileSpreadsheet } from 'lucide-react';
import { CertificateData, CertificateTemplate1, CertificateTemplate2, CertificateTemplate3 } from '../components/templates/CertificateTemplates';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { UpgradeModal } from '../components/UpgradeModal';
import { AdBanner } from '../components/AdBanner';
import { Link } from 'react-router';

const templates = [
  { id: 1, name: 'Classic Blue', component: CertificateTemplate1, locked: false },
  { id: 2, name: 'Modern Gradient', component: CertificateTemplate2, locked: false },
  { id: 3, name: 'Elegant Gold', component: CertificateTemplate3, locked: false },
];

export function Certificate() {
  const { isPro, user, trackEvent } = useAuth();
  const bp = user?.businessProfile || {};
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState('');

  const [formData, setFormData] = useState<CertificateData>({
    recipientName: 'John Doe',
    certificateTitle: 'Certificate of Achievement',
    description: 'Has successfully completed the required coursework and demonstrated excellence in their field of study.',
    date: new Date().toISOString().split('T')[0],
    signatureName: 'Jane Smith',
    signatureTitle: 'Director',
    organizationName: bp.companyName || 'ABC Institute',
    serialNumber: `CERT-${Date.now().toString().slice(-6)}`,
    courseName: 'Advanced Excellence Program',
  });

  const set = (field: keyof CertificateData, v: string) => setFormData(p => ({ ...p, [field]: v }));
  const SelectedTemplate = templates.find(t => t.id === selectedTemplate)?.component || CertificateTemplate1;

  const handleDownload = async () => {
    if (!document.getElementById('certificate-preview')) {
      setShowPreview(true);
      await new Promise(r => setTimeout(r, 300));
    }
    await generatePDF('certificate-preview', `certificate-${formData.recipientName.replace(/\s+/g, '-')}.pdf`, { isPro });
    trackEvent('pdf_generated', { type: 'certificate' });
  };

  const faqs = [
    { q: 'Can I generate certificates in bulk?', a: 'Yes! Pro users can upload a CSV/Excel file and generate hundreds of certificates at once.' },
    { q: 'What formats can I download?', a: 'Certificates are downloaded as PDF files, print-ready in A4 landscape format.' },
  ];

  return (
    <div className="max-w-[1800px] mx-auto">
      <AdBanner position="top" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Certificate</h1>
            <p className="text-gray-500 text-sm">Design beautiful certificates for any achievement, course completion, or event</p>
            {!isPro && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Crown className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-amber-900">Free Plan: </span>
                  <span className="text-amber-700">PDFs include watermark. </span>
                  <button onClick={() => { setUpgradeTrigger('watermark'); setShowUpgradeModal(true); }} className="text-amber-600 font-semibold hover:underline">Upgrade to Pro →</button>
                </div>
              </div>
            )}
            {isPro && (
              <div className="mt-3">
                <Link to="/bulk-certificate" className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors">
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Bulk Certificate Generation (CSV/Excel) →
                </Link>
              </div>
            )}
          </div>

          {/* Templates */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Select Template</h3>
            <div className="grid grid-cols-3 gap-3">
              {templates.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${selectedTemplate === t.id ? 'border-purple-600 bg-purple-50 font-semibold' : 'border-gray-200 hover:border-gray-300'}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Certificate Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label className="text-xs">Recipient Name</Label><Input value={formData.recipientName} onChange={e => set('recipientName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Certificate Title</Label><Input value={formData.certificateTitle} onChange={e => set('certificateTitle', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Course / Event Name</Label><Input value={formData.courseName || ''} onChange={e => set('courseName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Date</Label><Input type="date" value={formData.date} onChange={e => set('date', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Serial Number</Label><Input value={formData.serialNumber || ''} onChange={e => set('serialNumber', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Organization</Label><Input value={formData.organizationName} onChange={e => set('organizationName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Signatory Name</Label><Input value={formData.signatureName} onChange={e => set('signatureName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div><Label className="text-xs">Signatory Title</Label><Input value={formData.signatureTitle} onChange={e => set('signatureTitle', e.target.value)} className="mt-1 h-8 text-sm" /></div>
              <div className="col-span-2"><Label className="text-xs">Description</Label><Textarea value={formData.description} onChange={e => set('description', e.target.value)} rows={3} className="mt-1 text-sm" /></div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-2">
            <Button onClick={handleDownload} className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(p => !p)} className="px-3">
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={() => shareViaWhatsApp(`Certificate for ${formData.recipientName} — ${formData.certificateTitle} from ${formData.organizationName}`)} className="px-3 text-green-600 border-green-200">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => shareViaEmail(`Certificate of ${formData.certificateTitle}`, `Dear ${formData.recipientName},\n\nCongratulations on receiving the ${formData.certificateTitle} from ${formData.organizationName}!`)} className="px-3">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview — always in DOM */}
        <div className={`sticky top-20 self-start ${showPreview ? '' : 'hidden'}`}>
            <h3 className="font-semibold text-gray-700 text-sm mb-3">Live Preview</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-auto max-h-[85vh] shadow-sm">
              <div id="certificate-preview">
                <SelectedTemplate data={formData} isPro={isPro} />
              </div>
            </div>
          </div>
      </div>

      {/* FAQs */}
      <div className="mt-10 space-y-3 max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900">Certificate Generator FAQs</h2>
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-1">{f.q}</h3>
            <p className="text-sm text-gray-600">{f.a}</p>
          </div>
        ))}
      </div>

      <AdBanner position="bottom" />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger={upgradeTrigger} />
    </div>
  );
}
