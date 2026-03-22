import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import {
  InvoiceData,
  InvoiceTemplate1,
  InvoiceTemplate2,
  InvoiceTemplate3,
  InvoiceTemplate4,
  InvoiceTemplate5,
} from '../components/templates/InvoiceTemplates';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router';
import { DocumentPageWrapper, ItemTable } from '../components/DocumentPageWrapper';
import { SEOPageWrapper } from '../components/SEOPageWrapper';

type InvoiceFormData = InvoiceData & {
  bankName?: string;
  bankAccount?: string;
  bankIFSC?: string;
  bankBranch?: string;
};

export function Invoice() {
  const { isPro, user, getPDFFromHistory } = useAuth();
  const location = useLocation();

  const [historyItemId, setHistoryItemId] = useState<string | undefined>(undefined);
  const [historyMode, setHistoryMode] = useState<'create' | 'update'>('create');

  const bp = user?.businessProfile || {};

  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [taxRate, setTaxRate] = useState(bp.defaultTaxRate ?? 18);

  // Load from History if opened via ?edit=... or ?duplicate=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    const duplicateId = params.get('duplicate');

    const id = editId || duplicateId;
    if (!id) {
      setHistoryItemId(undefined);
      setHistoryMode('create');
      return;
    }

    const item = getPDFFromHistory(id);
    if (!item?.data) return;

    setSelectedTemplate(item.templateId || 1);

    // Try to infer taxRate from saved subtotal/tax
    try {
      const subtotal = Number(item.data.subtotal);
      const tax = Number(item.data.tax);
      if (subtotal > 0 && tax >= 0) {
        const inferred = Math.round((tax / subtotal) * 100 * 100) / 100;
        if (Number.isFinite(inferred)) setTaxRate(inferred);
      }
    } catch {
      // ignore
    }

    setFormData(prev => ({ ...prev, ...item.data }));

    if (editId) {
      setHistoryItemId(editId);
      setHistoryMode('update');
    } else {
      setHistoryItemId(undefined);
      setHistoryMode('create');
    }
  }, [location.search, getPDFFromHistory]);

  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: bp.invoicePrefix ? `${bp.invoicePrefix}001` : 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: bp.companyName || 'Your Company Name',
    companyAddress: bp.companyAddress || '123 Business St, City, State 12345',
    companyPhone: bp.companyPhone || '+91 98765 43210',
    companyEmail: bp.companyEmail || 'contact@yourcompany.com',
    companyGST: bp.companyGST || '',
    clientName: 'Client Name',
    clientAddress: '456 Client Ave, City, State 67890',
    clientPhone: '+91 98765 12345',
    clientEmail: 'client@email.com',
    clientGST: '',
    items: [
      { description: 'Service or Product 1', quantity: 1, rate: 1000, amount: 1000 },
      { description: 'Service or Product 2', quantity: 2, rate: 500, amount: 1000 },
    ],
    subtotal: 2000,
    tax: 2000 * (taxRate / 100),
    total: 2000 + 2000 * (taxRate / 100),
    notes: 'Thank you for your business! Payment is due within 30 days.',
    upiId: bp.upiId || '',
    bankName: bp.bankName || '',
    bankAccount: bp.bankAccount || '',
    bankIFSC: bp.bankIFSC || '',
    bankBranch: bp.bankBranch || '',
  });

  const set = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const recalc = (items: InvoiceFormData['items'], rate: number) => {
    const subtotal = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
    const tax = subtotal * (rate / 100);
    const total = subtotal + tax;
    setFormData(prev => ({ ...prev, items, subtotal, tax, total }));
  };

  const onItemChange = (index: number, field: string, value: any) => {
    const items = [...formData.items];
    const numValue = field === 'description' ? value : Number(value);
    items[index] = { ...items[index], [field]: numValue };

    if (field === 'quantity' || field === 'rate') {
      items[index].amount = (Number(items[index].quantity) || 0) * (Number(items[index].rate) || 0);
    }

    recalc(items, taxRate);
  };

  const onAddItem = () => {
    const items = [...formData.items, { description: 'New Item', quantity: 1, rate: 0, amount: 0 }];
    recalc(items, taxRate);
  };

  const onRemoveItem = (index: number) => {
    if (formData.items.length === 1) return;
    const items = formData.items.filter((_, i) => i !== index);
    recalc(items, taxRate);
  };

  const onTaxRateChange = (rate: number) => {
    setTaxRate(rate);
    recalc(formData.items, rate);
  };

  const templates = [
    { id: 1, name: 'Modern Blue', component: InvoiceTemplate1, locked: false, designIntent: 'Clean & modern' },
    { id: 2, name: 'Professional Green', component: InvoiceTemplate2, locked: false, designIntent: 'Business formal' },
    { id: 3, name: 'Elegant Purple', component: InvoiceTemplate3, locked: false, designIntent: 'Premium look' },
    { id: 4, name: 'Minimalist Black', component: InvoiceTemplate4, locked: !isPro, designIntent: 'Pro minimalist' },
    { id: 5, name: 'Orange Accent', component: InvoiceTemplate5, locked: !isPro, designIntent: 'Pro vibrant' },
  ];

  const faqs = [
    {
      q: 'Is this invoice generator GST compliant for India?',
      a: 'Yes. You can add GSTIN and apply a GST percentage. The PDF is A4 print-ready and suitable for sharing on WhatsApp or email.',
    },
    {
      q: 'Why do I see a watermark on the downloaded PDF?',
      a: 'Free plan downloads include a watermark. Upgrade to Pro to remove watermark + ads and unlock all templates.',
    },
    {
      q: 'Can I add a UPI QR code to the invoice?',
      a: 'Yes. Add your UPI ID and supported invoice templates will generate a payment QR automatically.',
    },
  ];

  const seoCopy = (
    <div className="space-y-3">
      <p>
        PDFDecor helps Indian freelancers, shop owners, agencies, and startups create professional invoices in seconds —
        with live preview and instant PDF download.
      </p>
      <p>
        Use it as a free invoice generator for India, add your GST number, include line items, and optionally add a UPI QR
        for faster payments.
      </p>
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Tip: Save your Business Profile (Pro) to auto-fill company details across all document types.
      </div>
    </div>
  );

  const formContent = (
    <>
      {/* Invoice details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Invoice Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Invoice Number</Label>
            <Input className="mt-1 h-8 text-sm" value={formData.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Invoice Date</Label>
            <Input className="mt-1 h-8 text-sm" type="date" value={formData.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Due Date</Label>
            <Input className="mt-1 h-8 text-sm" type="date" value={formData.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Company */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Your Business</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Company Name</Label>
            <Input className="mt-1 h-8 text-sm" value={formData.companyName} onChange={e => set('companyName', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Address</Label>
            <Input className="mt-1 h-8 text-sm" value={formData.companyAddress} onChange={e => set('companyAddress', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Phone</Label>
              <Input className="mt-1 h-8 text-sm" value={formData.companyPhone} onChange={e => set('companyPhone', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input className="mt-1 h-8 text-sm" type="email" value={formData.companyEmail} onChange={e => set('companyEmail', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">GSTIN (optional)</Label>
              <Input className="mt-1 h-8 text-sm" value={formData.companyGST || ''} onChange={e => set('companyGST', e.target.value)} placeholder="22AAAAA0000A1Z5" />
            </div>
            <div>
              <Label className="text-xs">UPI ID (optional — QR)</Label>
              <Input className="mt-1 h-8 text-sm" value={formData.upiId || ''} onChange={e => set('upiId', e.target.value)} placeholder="yourname@upi" />
            </div>
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Client Details</h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Client Name</Label>
            <Input className="mt-1 h-8 text-sm" value={formData.clientName} onChange={e => set('clientName', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Client Address</Label>
            <Input className="mt-1 h-8 text-sm" value={formData.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Client Phone</Label>
              <Input className="mt-1 h-8 text-sm" value={formData.clientPhone} onChange={e => set('clientPhone', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Client Email</Label>
              <Input className="mt-1 h-8 text-sm" type="email" value={formData.clientEmail} onChange={e => set('clientEmail', e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Client GSTIN (optional)</Label>
            <Input className="mt-1 h-8 text-sm" value={formData.clientGST || ''} onChange={e => set('clientGST', e.target.value)} placeholder="29BBBBB0000B1Z6" />
          </div>
        </div>
      </div>

      {/* Items */}
      <ItemTable
        items={formData.items}
        taxRate={taxRate}
        onItemChange={onItemChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
        onTaxRateChange={onTaxRateChange}
        subtotal={formData.subtotal}
        tax={formData.tax}
        total={formData.total}
      />

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
        <h3 className="font-semibold text-gray-800 text-sm">Notes / Terms</h3>
        <Textarea value={formData.notes} onChange={e => set('notes', e.target.value)} rows={3} className="text-sm" />
      </div>
    </>
  );

  return (
    <SEOPageWrapper
      docSlug="invoice"
      docTitle="Invoice"
      badge="Free Invoice Generator (India)"
      headline="Create Professional Invoices in Seconds"
      description="Live invoice preview + instant A4 PDF export. Add GST, line items, and optional UPI QR for faster payments."
      keywords={[
        'Free Invoice Generator India',
        'GST Invoice PDF',
        'UPI QR Invoice',
        'Invoice Template',
      ]}
      faqs={faqs}
      seoCopy={seoCopy}
    >
      <DocumentPageWrapper
        title="Invoice Generator"
        subtitle={`Fill details, select a template, and download your invoice PDF. ${isPro ? '5 templates unlocked.' : '3 templates free.'}`}
        previewId="invoice-preview"
        templates={templates}
        formContent={formContent}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
        formData={formData}
        onDownload={() => generatePDF('invoice-preview', `invoice-${formData.invoiceNumber}.pdf`, { isPro })}
        onWhatsApp={() => {
          const msg = `Invoice ${formData.invoiceNumber} from ${formData.companyName}. Total: ₹${formData.total.toFixed(2)}. Generated with PDFDecor.`;
          shareViaWhatsApp(msg);
        }}
        onEmail={() => {
          const subject = `Invoice ${formData.invoiceNumber} from ${formData.companyName}`;
          const body = `Dear ${formData.clientName},\n\nPlease find your invoice details:\n\nInvoice Number: ${formData.invoiceNumber}\nDate: ${formData.date}\nTotal Amount: ₹${formData.total.toFixed(2)}\n\nThank you for your business!\n\nBest regards,\n${formData.companyName}\n\nCreated with PDFDecor - https://pdfdecor.in`;
          shareViaEmail(subject, body);
        }}
        documentType="invoice"
        faqs={[]}
        seoContent={null}
        showAds={false}
      />
    </SEOPageWrapper>
  );
}
