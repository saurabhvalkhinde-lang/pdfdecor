import { useState, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { DocumentPageWrapper } from '../components/DocumentPageWrapper';
import { generatePDF } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import {
  IDCardData, IDCardTemplate1, IDCardTemplate2, IDCardTemplate3,
  IDCardTemplate4, IDCardTemplate5,
} from '../components/templates/IDCardTemplates';

export function IDCard() {
  const { isPro, user } = useAuth();
  const bp = user?.businessProfile || {};
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<IDCardData>({
    name: 'Rajesh Kumar',
    designation: 'Senior Developer',
    department: 'Engineering',
    employeeId: 'EMP-2024-001',
    organization: bp.companyName || 'Your Organization',
    orgAddress: bp.companyAddress || '123 Business Park, Mumbai',
    orgPhone: bp.companyPhone || '+91 98765 43210',
    orgEmail: bp.companyEmail || 'info@org.com',
    bloodGroup: 'B+',
    dob: '1990-01-15',
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    logo: bp.logo || '',
    photo: '',
    qrData: '',
  });

  const set = (field: keyof IDCardData, value: string) => setFormData(p => ({ ...p, [field]: value }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const templates = [
    { id: 1, name: 'Blue Corp', component: IDCardTemplate1, locked: false, designIntent: 'Corporate' },
    { id: 2, name: 'Clean White', component: IDCardTemplate2, locked: false, designIntent: 'Minimal' },
    { id: 3, name: 'Purple Bold', component: IDCardTemplate3, locked: false, designIntent: 'Bold' },
    { id: 4, name: 'Dark Elite', component: IDCardTemplate4, locked: !isPro, designIntent: 'Pro' },
    { id: 5, name: 'Warm Vibrant', component: IDCardTemplate5, locked: !isPro, designIntent: 'Pro' },
  ];

  const formContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Employee Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Full Name</Label><Input value={formData.name} onChange={e => set('name', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Designation</Label><Input value={formData.designation} onChange={e => set('designation', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Department</Label><Input value={formData.department} onChange={e => set('department', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Employee ID</Label><Input value={formData.employeeId} onChange={e => set('employeeId', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Blood Group</Label>
            <select value={formData.bloodGroup || ''} onChange={e => set('bloodGroup', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Date of Birth</Label><Input type="date" value={formData.dob || ''} onChange={e => set('dob', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Valid Until</Label><Input type="date" value={formData.validUntil || ''} onChange={e => set('validUntil', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
        {/* Photo Upload */}
        <div>
          <Label className="text-xs">Employee Photo</Label>
          <div className="mt-1 flex items-center gap-3">
            {formData.photo ? (
              <img src={formData.photo} alt="Employee" className="w-12 h-14 object-cover rounded-lg border border-gray-200" />
            ) : (
              <div className="w-12 h-14 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl">👤</div>
            )}
            <button onClick={() => photoInputRef.current?.click()}
              className="text-xs text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50">
              Upload Photo
            </button>
            {formData.photo && <button onClick={() => set('photo', '')} className="text-xs text-red-500 hover:underline">Remove</button>}
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Organization Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Organization Name</Label><Input value={formData.organization} onChange={e => set('organization', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Address</Label><Input value={formData.orgAddress || ''} onChange={e => set('orgAddress', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={formData.orgPhone || ''} onChange={e => set('orgPhone', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Email</Label><Input value={formData.orgEmail || ''} onChange={e => set('orgEmail', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">QR Code Data (optional — leave blank for auto)</Label><Input value={formData.qrData || ''} onChange={e => set('qrData', e.target.value)} placeholder="Custom QR data or leave blank" className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
    </div>
  );

  return (
    <DocumentPageWrapper
      title="Create Employee ID Card"
      subtitle="Professional ID cards with photo, QR code, and organization branding"
      previewId="idcard-preview"
      templates={templates}
      formContent={formContent}
      selectedTemplate={selectedTemplate}
      onTemplateSelect={setSelectedTemplate}
      formData={formData}
      onDownload={async () => { await generatePDF('idcard-preview', `id-card-${formData.name.replace(/\s+/g, '-')}.pdf`, { isPro }); }}
      documentType="id-card"
      faqs={[
        { q: 'Can I upload a photo for the ID card?', a: 'Yes! Click "Upload Photo" to add the employee\'s photo. It will appear on the ID card front. Supported formats: JPG, PNG.' },
        { q: 'Does the ID card have a QR code?', a: 'Yes, all templates include a QR code on the back. It encodes the employee ID, name, and organization. You can also enter custom QR data.' },
      ]}
    />
  );
}
