import { useState, useCallback } from 'react';
import { Download, Eye, EyeOff, MessageCircle, Mail, Lock, Crown, RefreshCw, Save, Plus, Trash2 } from 'lucide-react';
import { generatePDF, shareViaWhatsApp, shareViaEmail } from '../utils/pdfGenerator';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { UpgradeModal } from './UpgradeModal';
import { AdBanner } from './AdBanner';

export interface TemplateConfig {
  id: number;
  name: string;
  component: React.ComponentType<any>;
  locked: boolean;
  designIntent?: string;
}

interface DocumentPageWrapperProps {
  title: string;
  subtitle: string;
  previewId: string;
  templates: TemplateConfig[];
  formContent: React.ReactNode;
  selectedTemplate: number;
  onTemplateSelect: (id: number) => void;
  formData: any;
  onDownload: () => Promise<void>;
  onWhatsApp?: () => void;
  onEmail?: () => void;
  onSave?: () => void;
  showSave?: boolean;
  documentType: string;
  accentColor?: string;
  faqs?: Array<{ q: string; a: string }>;
  seoContent?: React.ReactNode;
  /**
   * Controls AdBanner rendering inside the wrapper.
   * Useful when this page is wrapped by an SEO shell that already has ads.
   */
  showAds?: boolean;

  /**
   * If you opened a saved History item via ?edit=..., pass the id here so we update
   * the existing History record instead of creating a new one.
   */
  historyItemId?: string;

  /** Defaults to 'create'. Use 'update' for edit flows. */
  historyMode?: 'create' | 'update';
}

export function DocumentPageWrapper({
  title, subtitle, previewId, templates, formContent,
  selectedTemplate, onTemplateSelect, formData,
  onDownload, onWhatsApp, onEmail, onSave, showSave,
  documentType, accentColor = 'blue', faqs, seoContent,
  showAds = true,
  historyItemId,
  historyMode = 'create',
}: DocumentPageWrapperProps) {
  const { isPro, trackEvent, savePDFToHistory, updatePDFInHistory } = useAuth();
  const [showPreview, setShowPreview] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const SelectedTemplate = templates.find(t => t.id === selectedTemplate)?.component || templates[0].component;

  const deriveHistoryTitle = () => {
    try {
      if (!formData) return title;
      if (documentType === 'invoice' && formData.invoiceNumber) return `Invoice ${formData.invoiceNumber}`;
      if (documentType === 'bill' && formData.billNumber) return `Bill ${formData.billNumber}`;
      if (documentType === 'receipt' && formData.receiptNumber) return `Receipt ${formData.receiptNumber}`;
      if (documentType === 'quotation' && formData.quotationNumber) return `Quotation ${formData.quotationNumber}`;
      if (documentType === 'estimate' && formData.estimateNumber) return `Estimate ${formData.estimateNumber}`;
      if (documentType === 'certificate' && formData.recipientName) return `Certificate — ${formData.recipientName}`;
      if (documentType === 'offer-letter' && formData.candidateName) return `Offer Letter — ${formData.candidateName}`;
      if (documentType === 'appointment-letter' && formData.candidateName) return `Appointment Letter — ${formData.candidateName}`;
      if (documentType === 'id-card' && formData.employeeName) return `ID Card — ${formData.employeeName}`;
      if (documentType === 'event-pass' && formData.passHolder) return `Event Pass — ${formData.passHolder}`;
      return title;
    } catch {
      return title;
    }
  };

  const handleTemplateClick = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (!isPro && template?.locked) {
      setUpgradeTrigger('template');
      setShowUpgradeModal(true);
      trackEvent('upgrade_click', { source: 'template_lock' });
      return;
    }
    onTemplateSelect(templateId);
    trackEvent('template_selected', { template: `${documentType}_${templateId}` });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    // Ensure preview element is in DOM before capturing
    if (!showPreview) {
      setShowPreview(true);
      await new Promise(r => setTimeout(r, 350));
    }
    try {
      await onDownload();
      trackEvent('pdf_generated', { type: documentType });

      // Pro: auto-save to History (client-side) after successful generation
      if (isPro) {
        if (historyMode === 'update' && historyItemId) {
          updatePDFInHistory(historyItemId, {
            data: formData,
            templateId: selectedTemplate,
            title: deriveHistoryTitle(),
          });
        } else {
          savePDFToHistory({
            type: documentType as any,
            templateId: selectedTemplate,
            data: formData,
            title: deriveHistoryTitle(),
          });
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto">
      {showAds && <AdBanner position="top" />}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
            <p className="text-gray-500 text-sm">{subtitle}</p>
            {!isPro && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Crown className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-amber-900">Free Plan: </span>
                  <span className="text-amber-700">PDFs include watermark. </span>
                  <button onClick={() => { setUpgradeTrigger('watermark'); setShowUpgradeModal(true); }}
                    className="text-amber-600 font-semibold hover:underline">Upgrade to Pro →</button>
                </div>
              </div>
            )}
          </div>

          {/* Template Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Select Template ({isPro ? '5' : '3 free'} available)</h3>
            <div className="grid grid-cols-5 gap-2">
              {templates.map(template => (
                <button key={template.id} onClick={() => handleTemplateClick(template.id)}
                  className={`relative p-2.5 rounded-lg border-2 transition-all text-xs ${
                    selectedTemplate === template.id && !template.locked
                      ? 'border-blue-600 bg-blue-50 shadow-sm'
                      : template.locked
                      ? 'border-gray-200 bg-gray-50 hover:border-yellow-400 cursor-pointer'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {template.locked && (
                    <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                      <Crown className="h-2.5 w-2.5" />
                    </div>
                  )}
                  <div className={`font-medium text-center leading-tight ${template.locked ? 'text-gray-400' : 'text-gray-700'}`}>
                    {template.name}
                  </div>
                  {template.designIntent && !template.locked && (
                    <div className="text-gray-400 text-center mt-0.5" style={{ fontSize: '9px' }}>{template.designIntent}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          {formContent}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload} disabled={isDownloading} className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="px-3">
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {onWhatsApp && (
                <Button variant="outline" onClick={onWhatsApp} className="px-3 text-green-600 border-green-200 hover:bg-green-50">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              {onEmail && (
                <Button variant="outline" onClick={onEmail} className="px-3">
                  <Mail className="h-4 w-4" />
                </Button>
              )}
              {showSave && isPro && onSave && (
                <Button variant="outline" onClick={onSave} className="px-3 text-purple-600 border-purple-200 hover:bg-purple-50">
                  <Save className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Preview — always in DOM so PDF capture works */}
        <div className={`sticky top-20 self-start ${showPreview ? '' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">Live Preview</h3>
              {!isPro && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Watermark in download</span>}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-auto max-h-[85vh] shadow-sm">
              <div id={previewId} className="transform-gpu" style={{ minWidth: '600px' }}>
                <SelectedTemplate data={formData} isPro={isPro} />
              </div>
            </div>
          </div>
      </div>

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-3xl">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      {seoContent && (
        <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6">
          {seoContent}
        </div>
      )}

      {showAds && <AdBanner position="bottom" />}
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger={upgradeTrigger} />
    </div>
  );
}

// Item Table Component (reusable for invoice, bill, receipt, quotation, estimate)
interface Item { description: string; quantity: number; rate: number; amount: number; }

interface ItemTableProps {
  items: Item[];
  taxRate: number;
  onItemChange: (index: number, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onTaxRateChange: (rate: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  showTaxRate?: boolean;
}

export function ItemTable({ items, taxRate, onItemChange, onAddItem, onRemoveItem, onTaxRateChange, subtotal, tax, total, showTaxRate = true }: ItemTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">Line Items</h3>
        <Button variant="outline" size="sm" onClick={onAddItem} className="text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 font-medium text-gray-600">Description</th>
              <th className="text-right p-2 font-medium text-gray-600 w-16">Qty</th>
              <th className="text-right p-2 font-medium text-gray-600 w-24">Rate (₹)</th>
              <th className="text-right p-2 font-medium text-gray-600 w-24">Amount</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="p-1">
                  <input value={item.description} onChange={e => onItemChange(index, 'description', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="p-1">
                  <input type="number" value={item.quantity} onChange={e => onItemChange(index, 'quantity', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="p-1">
                  <input type="number" value={item.rate} onChange={e => onItemChange(index, 'rate', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="p-1 text-right font-medium text-gray-700">₹{item.amount.toFixed(2)}</td>
                <td className="p-1">
                  <button onClick={() => onRemoveItem(index)} className="text-red-400 hover:text-red-600 p-0.5">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        {showTaxRate && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">GST %</label>
            <input type="number" value={taxRate} onChange={e => onTaxRateChange(Number(e.target.value))} min={0} max={100}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        <div className="space-y-1 text-right text-sm">
          <p className="text-gray-500">Subtotal: <span className="font-medium text-gray-700">₹{subtotal.toFixed(2)}</span></p>
          <p className="text-gray-500">GST ({taxRate}%): <span className="font-medium text-gray-700">₹{tax.toFixed(2)}</span></p>
          <p className="font-bold text-gray-900 text-base">Total: ₹{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
