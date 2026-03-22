import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { BillData, BillTemplate1, BillTemplate2, BillTemplate3 } from '../components/templates/BillTemplates';
import { generatePDF } from '../utils/pdfGenerator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';

export function Bill() {
  const { isPro } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState<BillData>({
    billNumber: 'BILL-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: 'Your Company Name',
    companyAddress: '123 Business St, City, State 12345',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'contact@yourcompany.com',
    clientName: 'Client Name',
    clientAddress: '456 Client Ave, City, State 67890',
    items: [
      { description: 'Product or Service 1', quantity: 1, rate: 50, amount: 50 },
      { description: 'Product or Service 2', quantity: 3, rate: 25, amount: 75 },
    ],
    subtotal: 125,
    tax: 12.5,
    total: 137.5,
    paymentMethod: 'Cash',
  });

  const handleInputChange = (field: keyof BillData, value: any) => {
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
    if (!document.getElementById('bill-preview')) { setShowPreview(true); await new Promise(r => setTimeout(r, 300)); }
    await generatePDF('bill-preview', `bill-${formData.billNumber}.pdf`, { isPro });
  };

  const templates = [
    { id: 1, name: 'Simple Orange', component: BillTemplate1 },
    { id: 2, name: 'Modern Amber', component: BillTemplate2 },
    { id: 3, name: 'Bold Red', component: BillTemplate3 },
  ];

  const SelectedTemplate = templates.find((t) => t.id === selectedTemplate)?.component || BillTemplate1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Bill</h2>
          <p className="text-gray-600">Generate itemized bills instantly</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Select Template</h3>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-orange-600 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">{template.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-lg">Bill Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billNumber">Bill Number</Label>
              <Input
                id="billNumber"
                value={formData.billNumber}
                onChange={(e) => handleInputChange('billNumber', e.target.value)}
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
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
          <h3 className="font-semibold text-lg">Payment Method</h3>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => handleInputChange('paymentMethod', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="Debit Card">Debit Card</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
              <SelectItem value="Digital Wallet">Digital Wallet</SelectItem>
            </SelectContent>
          </Select>
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
            <div id="bill-preview">
              <SelectedTemplate data={formData} isPro={isPro} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
