import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DocumentPageWrapper, ItemTable } from '../components/DocumentPageWrapper';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import {
  EstimateData, EstimateTemplate1, EstimateTemplate2, EstimateTemplate3,
  EstimateTemplate4, EstimateTemplate5,
} from '../components/templates/EstimateTemplates';

export function Estimate() {
  const { isPro, user } = useAuth();
  const bp = user?.businessProfile || {};
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [taxRate, setTaxRate] = useState(bp.defaultTaxRate ?? 18);

  const [formData, setFormData] = useState<EstimateData>({
    estimateNumber: 'EST-001',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: bp.companyName || 'Your Business Name',
    companyAddress: bp.companyAddress || '123 Business Street, City',
    companyPhone: bp.companyPhone || '+91 98765 43210',
    companyEmail: bp.companyEmail || 'info@business.com',
    companyGST: bp.companyGST || '',
    clientName: 'Client Name',
    clientAddress: 'Client Address, City',
    clientPhone: '+91 99999 12345',
    clientEmail: '',
    items: [
      { description: 'Service / Product 1', quantity: 1, rate: 2000, amount: 2000 },
      { description: 'Service / Product 2', quantity: 2, rate: 500, amount: 1000 },
    ],
    subtotal: 3000, taxRate: 18, tax: 540, total: 3540,
    notes: 'This is an estimate. Final pricing may vary based on project requirements.',
    paymentTerms: '50% advance, 50% on completion',
  });

  const set = (field: keyof EstimateData, value: any) => setFormData(p => ({ ...p, [field]: value }));

  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...formData.items];
    items[index] = { ...items[index], [field]: field === 'description' ? value : Number(value) };
    if (field === 'quantity' || field === 'rate') items[index].amount = items[index].quantity * items[index].rate;
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const tax = subtotal * (taxRate / 100);
    setFormData(p => ({ ...p, items, subtotal, tax, total: subtotal + tax, taxRate }));
  };

  const handleTaxRateChange = (rate: number) => {
    setTaxRate(rate);
    const subtotal = formData.subtotal;
    setFormData(p => ({ ...p, taxRate: rate, tax: subtotal * (rate / 100), total: subtotal + subtotal * (rate / 100) }));
  };

  const addItem = () => setFormData(p => ({ ...p, items: [...p.items, { description: 'New Item', quantity: 1, rate: 0, amount: 0 }] }));

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const items = formData.items.filter((_, i) => i !== index);
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    setFormData(p => ({ ...p, items, subtotal, tax: subtotal * (taxRate / 100), total: subtotal + subtotal * (taxRate / 100) }));
  };

  const templates = [
    { id: 1, name: 'Warm Gold', component: EstimateTemplate1, locked: false, designIntent: 'Bold' },
    { id: 2, name: 'Sky Blue', component: EstimateTemplate2, locked: false, designIntent: 'Modern' },
    { id: 3, name: 'Classic', component: EstimateTemplate3, locked: false, designIntent: 'Formal' },
    { id: 4, name: 'Fresh Green', component: EstimateTemplate4, locked: !isPro, designIntent: 'Pro' },
    { id: 5, name: 'Dark Mode', component: EstimateTemplate5, locked: !isPro, designIntent: 'Pro' },
  ];

  const formContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Estimate Details</h3>
        <div className="grid grid-cols-3 gap-3">
          <div><Label className="text-xs">Estimate #</Label><Input value={formData.estimateNumber} onChange={e => set('estimateNumber', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Date</Label><Input type="date" value={formData.date} onChange={e => set('date', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Valid Until</Label><Input type="date" value={formData.validUntil} onChange={e => set('validUntil', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Your Business</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Business Name</Label><Input value={formData.companyName} onChange={e => set('companyName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Address</Label><Input value={formData.companyAddress} onChange={e => set('companyAddress', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={formData.companyPhone} onChange={e => set('companyPhone', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">GST Number</Label><Input value={formData.companyGST || ''} onChange={e => set('companyGST', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Client Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Client Name</Label><Input value={formData.clientName} onChange={e => set('clientName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Client Address</Label><Input value={formData.clientAddress} onChange={e => set('clientAddress', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={formData.clientPhone} onChange={e => set('clientPhone', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Email</Label><Input value={formData.clientEmail || ''} onChange={e => set('clientEmail', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <ItemTable items={formData.items} taxRate={taxRate} onItemChange={handleItemChange} onAddItem={addItem} onRemoveItem={removeItem} onTaxRateChange={handleTaxRateChange} subtotal={formData.subtotal} tax={formData.tax} total={formData.total} />
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div><Label className="text-xs">Notes</Label><Textarea value={formData.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} className="mt-1 text-sm" /></div>
        <div><Label className="text-xs">Payment Terms</Label><Input value={formData.paymentTerms || ''} onChange={e => set('paymentTerms', e.target.value)} className="mt-1 h-8 text-sm" /></div>
      </div>
    </div>
  );

  return (
    <DocumentPageWrapper
      title="Create Project Estimate"
      subtitle="Professional cost estimates and project quotations for your clients"
      previewId="estimate-preview"
      templates={templates}
      formContent={formContent}
      selectedTemplate={selectedTemplate}
      onTemplateSelect={setSelectedTemplate}
      formData={formData}
      onDownload={async () => { await generatePDF('estimate-preview', `estimate-${formData.estimateNumber}.pdf`, { isPro }); }}
      onWhatsApp={() => shareViaWhatsApp(`Estimate ${formData.estimateNumber} from ${formData.companyName}. Total: ₹${formData.total.toFixed(2)}`)}
      onEmail={() => shareViaEmail(`Estimate ${formData.estimateNumber}`, `Dear ${formData.clientName},\n\nPlease find your estimate for ₹${formData.total.toFixed(2)}.\n\nValid until: ${formData.validUntil}\n\n${formData.companyName}`)}
      documentType="estimate"
      faqs={[
        { q: 'What is the difference between estimate and quotation?', a: 'An estimate is an approximate calculation of costs and may change. A quotation is a fixed-price offer. Use estimates for projects where scope is uncertain.' },
        { q: 'How long should an estimate be valid?', a: 'Typically 15-30 days. Always specify the validity date to manage client expectations. Our system includes a "Valid Until" field for this purpose.' },
      ]}
    />
  );
}
