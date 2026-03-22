import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DocumentPageWrapper } from '../components/DocumentPageWrapper';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import {
  AppointmentLetterData, AppointmentLetterTemplate1, AppointmentLetterTemplate2, AppointmentLetterTemplate3,
  AppointmentLetterTemplate4, AppointmentLetterTemplate5,
} from '../components/templates/AppointmentLetterTemplates';

export function AppointmentLetter() {
  const { isPro, user } = useAuth();
  const bp = user?.businessProfile || {};
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  const [formData, setFormData] = useState<AppointmentLetterData>({
    candidateName: 'Priya Patel',
    position: 'Marketing Manager',
    department: 'Marketing',
    salary: '₹6,00,000 per annum',
    joiningDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: bp.companyName || 'Your Company Name',
    companyAddress: bp.companyAddress || '456 Corporate Hub, City',
    companyPhone: bp.companyPhone || '+91 98765 43210',
    companyEmail: bp.companyEmail || 'hr@company.com',
    hrName: 'HR Director',
    hrTitle: 'Director — Human Resources',
    letterDate: new Date().toISOString().split('T')[0],
    employeeId: `EMP-${Date.now().toString().slice(-4)}`,
    reportingManager: 'General Manager',
    workLocation: 'Head Office, Mumbai',
    terms: 'You will be subject to the rules and regulations of the company as applicable. Any breach of company policies may result in disciplinary action.',
  });

  const set = (field: keyof AppointmentLetterData, value: string) => setFormData(p => ({ ...p, [field]: value }));

  const templates = [
    { id: 1, name: 'Green Official', component: AppointmentLetterTemplate1, locked: false, designIntent: 'Official' },
    { id: 2, name: 'Navy Classic', component: AppointmentLetterTemplate2, locked: false, designIntent: 'Corporate' },
    { id: 3, name: 'Gold Formal', component: AppointmentLetterTemplate3, locked: false, designIntent: 'Formal' },
    { id: 4, name: 'Pink Gradient', component: AppointmentLetterTemplate4, locked: !isPro, designIntent: 'Pro' },
    { id: 5, name: 'Dark Navy', component: AppointmentLetterTemplate5, locked: !isPro, designIntent: 'Pro' },
  ];

  const formContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Employee Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Employee Full Name</Label><Input value={formData.candidateName} onChange={e => set('candidateName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Designation</Label><Input value={formData.position} onChange={e => set('position', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Department</Label><Input value={formData.department} onChange={e => set('department', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Salary / CTC</Label><Input value={formData.salary} onChange={e => set('salary', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Date of Joining</Label><Input type="date" value={formData.joiningDate} onChange={e => set('joiningDate', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Employee ID</Label><Input value={formData.employeeId || ''} onChange={e => set('employeeId', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Reporting Manager</Label><Input value={formData.reportingManager || ''} onChange={e => set('reportingManager', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Work Location</Label><Input value={formData.workLocation || ''} onChange={e => set('workLocation', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Company Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Company Name</Label><Input value={formData.companyName} onChange={e => set('companyName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Company Address</Label><Input value={formData.companyAddress} onChange={e => set('companyAddress', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={formData.companyPhone} onChange={e => set('companyPhone', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Email</Label><Input value={formData.companyEmail} onChange={e => set('companyEmail', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">HR Name</Label><Input value={formData.hrName} onChange={e => set('hrName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
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
      title="Create Appointment Letter"
      subtitle="Official employee appointment letters — legally-formatted and print-ready"
      previewId="appointment-letter-preview"
      templates={templates}
      formContent={formContent}
      selectedTemplate={selectedTemplate}
      onTemplateSelect={setSelectedTemplate}
      formData={formData}
      onDownload={async () => { await generatePDF('appointment-letter-preview', `appointment-${formData.candidateName.replace(/\s+/g, '-')}.pdf`, { isPro }); }}
      onWhatsApp={() => shareViaWhatsApp(`Appointment Letter for ${formData.position} — ${formData.candidateName}. Joining: ${formData.joiningDate}`)}
      onEmail={() => shareViaEmail(`Appointment Letter`, `Dear ${formData.candidateName},\n\nYou are appointed as ${formData.position} at ${formData.companyName}.\n\nJoining: ${formData.joiningDate}\nCTC: ${formData.salary}`)}
      documentType="appointment-letter"
      faqs={[
        { q: 'Difference between offer letter and appointment letter?', a: 'An offer letter is issued before the candidate accepts. An appointment letter is a formal confirmation after acceptance, often more detailed with T&Cs.' },
      ]}
    />
  );
}
