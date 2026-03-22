import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DocumentPageWrapper, ItemTable } from '../components/DocumentPageWrapper';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';
import {
  ReceiptData, ReceiptTemplate1, ReceiptTemplate2, ReceiptTemplate3,
  ReceiptTemplate4, ReceiptTemplate5,
} from '../components/templates/ReceiptTemplates';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Cheque', 'Other'];

export function Receipt() {
  const { isPro, user } = useAuth();
  const bp = user?.businessProfile || {};
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [taxRate, setTaxRate] = useState(bp.defaultTaxRate ?? 18);

  const [formData, setFormData] = useState<ReceiptData>({
    receiptNumber: 'RCP-001',
    date: new Date().toISOString().split('T')[0],
    companyName: bp.companyName || 'Your Business Name',
    companyAddress: bp.companyAddress || '123 Business Street, City',
    companyPhone: bp.companyPhone || '+91 98765 43210',
    companyEmail: bp.companyEmail || 'info@business.com',
    companyGST: bp.companyGST || '',
    clientName: 'Customer Name',
    clientPhone: '+91 99999 12345',
    clientEmail: '',
    items: [{ description: 'Product / Service', quantity: 1, rate: 500, amount: 500 }],
    subtotal: 500, taxRate: 18, tax: 90, total: 590,
    paymentMethod: 'UPI',
    notes: 'Thank you for your payment!',
    upiId: bp.upiId || '',
  });

  const set = (field: keyof ReceiptData, value: any) => setFormData(p => ({ ...p, [field]: value }));

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
    const tax = subtotal * (rate / 100);
    setFormData(p => ({ ...p, taxRate: rate, tax, total: subtotal + tax }));
  };

  const addItem = () => {
    const items = [...formData.items, { description: 'New Item', quantity: 1, rate: 0, amount: 0 }];
    setFormData(p => ({ ...p, items }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const items = formData.items.filter((_, i) => i !== index);
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const tax = subtotal * (taxRate / 100);
    setFormData(p => ({ ...p, items, subtotal, tax, total: subtotal + tax }));
  };

  const templates = [
    { id: 1, name: 'Modern Green', component: ReceiptTemplate1, locked: false, designIntent: 'Vibrant' },
    { id: 2, name: 'Classic B&W', component: ReceiptTemplate2, locked: false, designIntent: 'Formal' },
    { id: 3, name: 'Purple Card', component: ReceiptTemplate3, locked: false, designIntent: 'Bold' },
    { id: 4, name: 'Dark Elite', component: ReceiptTemplate4, locked: !isPro, designIntent: 'Pro' },
    { id: 5, name: 'Warm Orange', component: ReceiptTemplate5, locked: !isPro, designIntent: 'Pro' },
  ];

  const formContent = (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Receipt Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Receipt #</Label><Input value={formData.receiptNumber} onChange={e => set('receiptNumber', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Date</Label><Input type="date" value={formData.date} onChange={e => set('date', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
        <div><Label className="text-xs">Payment Method</Label>
          <select value={formData.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Your Business</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Business Name</Label><Input value={formData.companyName} onChange={e => set('companyName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div className="col-span-2"><Label className="text-xs">Address</Label><Input value={formData.companyAddress} onChange={e => set('companyAddress', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={formData.companyPhone} onChange={e => set('companyPhone', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Email</Label><Input value={formData.companyEmail} onChange={e => set('companyEmail', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">GST Number</Label><Input value={formData.companyGST || ''} onChange={e => set('companyGST', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">UPI ID (for QR)</Label><Input value={formData.upiId || ''} onChange={e => set('upiId', e.target.value)} placeholder="yourname@upi" className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Customer Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs">Customer Name</Label><Input value={formData.clientName} onChange={e => set('clientName', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={formData.clientPhone} onChange={e => set('clientPhone', e.target.value)} className="mt-1 h-8 text-sm" /></div>
          <div><Label className="text-xs">Email</Label><Input value={formData.clientEmail || ''} onChange={e => set('clientEmail', e.target.value)} className="mt-1 h-8 text-sm" /></div>
        </div>
      </div>
      <ItemTable items={formData.items} taxRate={taxRate} onItemChange={handleItemChange} onAddItem={addItem} onRemoveItem={removeItem} onTaxRateChange={handleTaxRateChange} subtotal={formData.subtotal} tax={formData.tax} total={formData.total} />
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <Label className="text-xs">Notes</Label>
        <Textarea value={formData.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} className="mt-1 text-sm" />
      </div>
    </div>
  );

  const faqs = [
    { q: 'What is a payment receipt?', a: 'A receipt is a document confirming that payment has been received for goods or services. It serves as proof of payment for both parties.' },
    { q: 'Should a receipt include GST?', a: 'Yes, if you are GST registered, your receipts must show the GST amount separately with your GSTIN for compliance.' },
    { q: 'Can I add UPI QR code to receipt?', a: 'Yes! Enter your UPI ID and a payment QR code will be auto-generated in templates that support it.' },
  ];

  return (
    <DocumentPageWrapper
      title="Create Payment Receipt"
      subtitle="Generate professional receipts for completed payments — with UPI QR and GST support"
      previewId="receipt-preview"
      templates={templates}
      formContent={formContent}
      selectedTemplate={selectedTemplate}
      onTemplateSelect={setSelectedTemplate}
      formData={formData}
      onDownload={async () => { await generatePDF('receipt-preview', `receipt-${formData.receiptNumber}.pdf`, { isPro }); }}
      onWhatsApp={() => shareViaWhatsApp(`Receipt ${formData.receiptNumber} from ${formData.companyName}. Amount Paid: ₹${formData.total.toFixed(2)}`)}
      onEmail={() => shareViaEmail(`Receipt ${formData.receiptNumber}`, `Dear ${formData.clientName},\n\nReceipt for ₹${formData.total.toFixed(2)} via ${formData.paymentMethod}.\n\nThank you!\n${formData.companyName}`)}
      documentType="receipt"
      faqs={faqs}
      seoContent={<div><h2 className="text-xl font-bold text-gray-900 mb-3">Free Online Payment Receipt Generator</h2><p className="text-sm text-gray-600">Create professional GST-compliant payment receipts instantly. Perfect for businesses, shopkeepers, and freelancers in India. Supports UPI QR codes, multiple payment methods, and itemized lists.</p></div>}
    />
  );
}
