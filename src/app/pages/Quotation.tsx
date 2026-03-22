import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { QuotationData, QuotationTemplate1, QuotationTemplate2 } from '../components/templates/QuotationTemplates';
import { generatePDF } from '../utils/pdfGenerator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';

export function Quotation() {
  const { isPro } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState<QuotationData>({
    quotationNumber: 'QT-001',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: 'Your Company Name',
    companyAddress: '123 Business St, City, State 12345',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'contact@yourcompany.com',
    clientName: 'Client Name',
    clientAddress: '456 Client Ave, City, State 67890',
    clientPhone: '+1 (555) 987-6543',
    clientEmail: 'client@email.com',
    items: [
      { description: 'Service or Product 1', quantity: 1, rate: 100, amount: 100 },
      { description: 'Service or Product 2', quantity: 2, rate: 50, amount: 100 },
    ],
    subtotal: 200,
    tax: 20,
    total: 220,
    terms: 'Payment due within 30 days. Prices are valid for 30 days from the date of quotation.',
    notes: 'Thank you for considering our services!',
  });

  const handleInputChange = (field: keyof QuotationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    const numValue = field === 'description' ? value : Number(value);
    newItems[index] = { ...newItems[index], [field]: numValue };
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: 'New Item', quantity: 1, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total,
    }));
  };

  const handleDownload = async () => {
    if (!document.getElementById('quotation-preview')) { setShowPreview(true); await new Promise(r => setTimeout(r, 300)); }
    await generatePDF('quotation-preview', `quotation-${formData.quotationNumber}.pdf`, { isPro });
  };

  const templates = [
    { id: 1, name: 'Professional Green', component: QuotationTemplate1 },
    { id: 2, name: 'Modern Teal', component: QuotationTemplate2 },
  ];

  const SelectedTemplate = templates.find((t) => t.id === selectedTemplate)?.component || QuotationTemplate1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Quotation</h2>
          <p className="text-gray-600">Generate detailed quotations for your clients</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Select Template</h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{template.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Quotation Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quotationNumber">Quotation Number</Label>
              <Input
                id="quotationNumber"
                value={formData.quotationNumber}
                onChange={(e) => handleInputChange('quotationNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Your Company</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyAddress">Address</Label>
              <Input
                id="companyAddress"
                value={formData.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  value={formData.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Client Details</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="clientAddress">Address</Label>
              <Input
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => handleInputChange('clientAddress', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="clientPhone">Phone</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Line Items</h3>
            <Button onClick={addItem} size="sm">Add Item</Button>
          </div>
          {formData.items.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-medium">Item {index + 1}</span>
                <Button
                  onClick={() => removeItem(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Rate</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={item.amount}
                    disabled
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Terms & Conditions</h3>
          <Textarea
            value={formData.terms}
            onChange={(e) => handleInputChange('terms', e.target.value)}
            rows={3}
            placeholder="Add terms and conditions..."
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Additional Notes</h3>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={2}
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button onClick={handleDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className={`lg:sticky lg:top-24 h-fit ${showPreview ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-lg mb-4">Preview</h3>
          <div className="border border-gray-200 rounded overflow-hidden" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: 'fit-content' }}>
            <div id="quotation-preview">
              <SelectedTemplate data={formData} isPro={isPro} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
