import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DocumentPageWrapper } from '../components/DocumentPageWrapper';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import {
  OfferLetterData, OfferLetterTemplate1, OfferLetterTemplate2, OfferLetterTemplate3,
  OfferLetterTemplate4, OfferLetterTemplate5,
} from '../components/templates/OfferLetterTemplates';

export function OfferLetter() {
  const { isPro, user } = useAuth();
  const bp = user?.businessProfile || {};
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const [formData, setFormData] = useState<OfferLetterData>({
    candidateName: 'Rahul Sharma',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: '₹8,00,000 per annum',
    joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: bp.companyName || 'Your Company Name',
    companyAddress: bp.companyAddress || '123 Business Park, City',
    companyPhone: bp.companyPhone || '+91 98765 43210',
    companyEmail: bp.companyEmail || 'hr@company.com',
    hrName: 'HR Manager',
    hrTitle: 'Head of Human Resources',
    letterDate: new Date().toISOString().split('T')[0],
    probationPeriod: '3 months',
    workHours: '9:00 AM – 6:00 PM, Monday to Friday',
    terms: 'This offer is subject to satisfactory completion of background verification and medical examination. The employment is at-will and either party may terminate with 30 days notice.',
  });

  const set = (field: keyof OfferLetterData, value: string) => setFormData(p => ({ ...p, [field]: value }));

  const templates = [
    { id: 1, name: 'Corporate Blue', component: OfferLetterTemplate1, locked: false, designIntent: 'Professional' },
    { id: 2, name: 'Classic Serif', component: OfferLetterTemplate2, locked: false, designIntent: 'Traditional' },
    { id: 3, name: 'Modern Indigo', component: OfferLetterTemplate3, locked: false, designIntent: 'Contemporary' },
    { id: 4, name: 'Sky Clean', component: OfferLetterTemplate4, locked: !isPro, designIntent: 'Pro' },
    { id: 5, name: 'Dark Premium', component: OfferLetterTemplate5, locked: !isPro, designIntent: 'Pro' },
  ];

  const formContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Candidate Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Candidate Full Name</Label><Input value={formData.candidateName} onChange={e => set('candidateName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Position Offered</Label><Input value={formData.position} onChange={e => set('position', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Department</Label><Input value={formData.department} onChange={e => set('department', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Salary / CTC</Label><Input value={formData.salary} onChange={e => set('salary', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Date of Joining</Label><Input type="date" value={formData.joiningDate} onChange={e => set('joiningDate', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Probation Period</Label><Input value={formData.probationPeriod || ''} onChange={e => set('probationPeriod', e.target.value)} placeholder="e.g. 3 months" className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Work Hours</Label><Input value={formData.workHours || ''} onChange={e => set('workHours', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Company Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Company Name</Label><Input value={formData.companyName} onChange={e => set('companyName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Company Address</Label><Input value={formData.companyAddress} onChange={e => set('companyAddress', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={formData.companyPhone} onChange={e => set('companyPhone', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Email</Label><Input value={formData.companyEmail} onChange={e => set('companyEmail', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">HR Signatory Name</Label><Input value={formData.hrName} onChange={e => set('hrName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">HR Title</Label><Input value={formData.hrTitle} onChange={e => set('hrTitle', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Letter Date</Label><Input type="date" value={formData.letterDate} onChange={e => set('letterDate', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <Label className="text-xs">Terms & Conditions</Label>
        <Textarea value={formData.terms || ''} onChange={e => set('terms', e.target.value)} rows={4} className="mt-1 text-sm" />
      </div>
    </div>
  );

  return (
    <DocumentPageWrapper
      title="Create Offer Letter"
      subtitle="Professional job offer letters for candidates — ready to print and sign"
      previewId="offer-letter-preview"
      templates={templates}
      formContent={formContent}
      selectedTemplate={selectedTemplate}
      onTemplateSelect={setSelectedTemplate}
      formData={formData}
      onDownload={async () => { await generatePDF('offer-letter-preview', `offer-letter-${formData.candidateName.replace(/\s+/g, '-')}.pdf`, { isPro }); }}
      onWhatsApp={() => shareViaWhatsApp(`Offer Letter for ${formData.position} at ${formData.companyName}. Joining: ${formData.joiningDate}`)}
      onEmail={() => shareViaEmail(`Offer Letter — ${formData.position}`, `Dear ${formData.candidateName},\n\nPlease find attached your offer letter for the position of ${formData.position} at ${formData.companyName}.\n\nJoining Date: ${formData.joiningDate}\nCTC: ${formData.salary}\n\nRegards,\n${formData.hrName}\n${formData.companyName}`)}
      documentType="offer-letter"
      faqs={[
        { q: 'What should an offer letter include?', a: 'An offer letter should include the position, department, salary, joining date, probation period, and key terms of employment. Our templates cover all these fields.' },
        { q: 'Is an offer letter legally binding?', a: 'An offer letter is generally not a legally binding employment contract unless both parties sign it. However, it signals the employer\'s intent and should be treated professionally.' },
      ]}
    />
  );
}
