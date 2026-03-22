import { useState, useRef } from 'react';
import { Crown, Upload, Download, FileText, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { UpgradeModal } from '../components/UpgradeModal';
import { AdBanner } from '../components/AdBanner';
import { CertificateTemplate1, CertificateTemplate2, CertificateTemplate3 } from '../components/templates/CertificateTemplates';
import { generatePDF } from '../utils/pdfGenerator';
import { Link } from 'react-router';

// We need JSZip for bulk download
let JSZip: any = null;
const loadJSZip = async () => {
  if (!JSZip) {
    const mod = await import('jszip');
    JSZip = mod.default || mod;
  }
  return JSZip;
};

// We need xlsx for CSV parsing
let XLSX: any = null;
const loadXLSX = async () => {
  if (!XLSX) {
    const mod = await import('xlsx');
    XLSX = mod;
  }
  return XLSX;
};

interface CertificateRecord {
  recipientName: string;
  certificateTitle?: string;
  description?: string;
  date?: string;
  signatureName?: string;
  signatureTitle?: string;
  organizationName?: string;
  serialNumber?: string;
  status?: 'pending' | 'generating' | 'done' | 'error';
}

const TEMPLATE_MAP: Record<number, React.ComponentType<any>> = {
  1: CertificateTemplate1,
  2: CertificateTemplate2,
  3: CertificateTemplate3,
};

export function BulkCertificate() {
  const { isPro, user, trackEvent } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [records, setRecords] = useState<CertificateRecord[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default certificate fields
  const [defaults, setDefaults] = useState({
    certificateTitle: 'Certificate of Completion',
    description: 'Has successfully completed the required coursework and demonstrated excellence.',
    date: new Date().toISOString().split('T')[0],
    signatureName: user?.businessProfile?.companyName ? 'Director' : 'Authorized Signatory',
    signatureTitle: 'Director',
    organizationName: user?.businessProfile?.companyName || 'Your Organization',
  });

  if (!isPro) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-12">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bulk Certificate Generation</h1>
          <p className="text-gray-600 mb-4 text-lg">Generate hundreds of certificates at once from an Excel or CSV file.</p>
          <ul className="text-left max-w-sm mx-auto space-y-2 mb-8">
            {['Upload Excel / CSV with recipient names', 'Map columns to certificate fields', 'Generate all certificates at once', 'Download as a single ZIP file', 'Auto serial numbering'].map(f => (
              <li key={f} className="flex items-center gap-2 text-gray-700 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-8 py-3 text-lg font-bold">
            <Crown className="mr-2 h-5 w-5" /> Upgrade to Pro
          </Button>
          <p className="text-sm text-gray-400 mt-4">Pro plan: Starting from ₹249/month</p>
        </div>
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger="bulk" />
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const xlsx = await loadXLSX();
      const arrayBuffer = await file.arrayBuffer();
      const workbook = xlsx.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json<any>(sheet, { header: 1 });
      if (data.length < 2) { alert('File appears to be empty or has no data rows.'); return; }
      
      const headers: string[] = data[0].map((h: any) => String(h).toLowerCase().trim());
      const rows = data.slice(1).filter((row: any) => row.some((cell: any) => cell !== undefined && cell !== ''));
      
      const findCol = (...keys: string[]) => {
        for (const k of keys) {
          const idx = headers.findIndex(h => h.includes(k));
          if (idx >= 0) return idx;
        }
        return -1;
      };
      
      const nameIdx = findCol('name', 'recipient', 'student', 'employee', 'person');
      const titleIdx = findCol('title', 'certificate');
      const descIdx = findCol('desc', 'description', 'course', 'subject');
      const dateIdx = findCol('date');
      const signIdx = findCol('sign', 'signatory', 'authority');
      const orgIdx = findCol('org', 'organization', 'company', 'institution');
      
      if (nameIdx === -1) { alert('Could not find a "Name" column. Please ensure your file has a column with "name", "recipient", "student" or "employee" in the header.'); return; }
      
      const parsed: CertificateRecord[] = rows.map((row: any, i: number) => ({
        recipientName: String(row[nameIdx] || '').trim(),
        certificateTitle: titleIdx >= 0 ? String(row[titleIdx] || defaults.certificateTitle) : defaults.certificateTitle,
        description: descIdx >= 0 ? String(row[descIdx] || defaults.description) : defaults.description,
        date: dateIdx >= 0 ? String(row[dateIdx] || defaults.date) : defaults.date,
        signatureName: signIdx >= 0 ? String(row[signIdx] || defaults.signatureName) : defaults.signatureName,
        signatureTitle: defaults.signatureTitle,
        organizationName: orgIdx >= 0 ? String(row[orgIdx] || defaults.organizationName) : defaults.organizationName,
        serialNumber: `CERT-${String(i + 1).padStart(4, '0')}`,
        status: 'pending',
      })).filter(r => r.recipientName);
      
      setRecords(parsed);
      setDone(false);
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert('Failed to parse file. Please ensure it is a valid .xlsx or .csv file.');
    }
    e.target.value = '';
  };

  const generateBulk = async () => {
    if (!records.length) return;
    setIsGenerating(true);
    setDone(false);
    setProgress(0);
    
    try {
      const zip = await loadJSZip();
      const zipFile = new zip();
      const Template = TEMPLATE_MAP[selectedTemplate] || CertificateTemplate1;
      
      for (let i = 0; i < records.length; i++) {
        const rec = records[i];
        setRecords(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'generating' } : r));
        
        try {
          // Create a temp div, render certificate, capture as canvas
          const tempDiv = document.createElement('div');
          tempDiv.id = `cert-render-${i}`;
          tempDiv.style.cssText = 'position: absolute; left: -9999px; top: 0;';
          document.body.appendChild(tempDiv);
          
          // We'll use a simpler approach: create React element and render
          const { createRoot } = await import('react-dom/client');
          const root = createRoot(tempDiv);
          const { flushSync } = await import('react-dom');
          
          flushSync(() => {
            root.render(<Template data={{ ...rec }} isPro={true} />);
          });
          
          await new Promise(r => setTimeout(r, 200));
          
          // Capture with html2canvas
          const { default: html2canvas } = await import('html2canvas');
          const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, backgroundColor: '#fff' });
          
          const { default: jsPDF } = await import('jspdf');
          const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
          const imgData = canvas.toDataURL('image/png');
          const w = pdf.internal.pageSize.getWidth();
          const h = pdf.internal.pageSize.getHeight();
          const ratio = Math.min(w / canvas.width, h / canvas.height);
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
          
          const pdfBytes = pdf.output('arraybuffer');
          zipFile.file(`certificate-${rec.serialNumber}-${rec.recipientName.replace(/\s+/g, '_')}.pdf`, pdfBytes);
          
          root.unmount();
          document.body.removeChild(tempDiv);
          
          setRecords(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'done' } : r));
        } catch (err) {
          console.error(`Error generating certificate for ${rec.recipientName}:`, err);
          setRecords(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'error' } : r));
        }
        
        setProgress(Math.round(((i + 1) / records.length) * 100));
      }
      
      // Generate ZIP
      const zipBlob = await zipFile.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificates-bulk-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      setDone(true);
      trackEvent('pdf_generated', { type: 'bulk-certificate' });
    } catch (err) {
      console.error('Bulk generation failed:', err);
      alert('Bulk generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadSample = () => {
    setRecords([
      { recipientName: 'Rahul Sharma', certificateTitle: 'Certificate of Excellence', description: 'For outstanding performance in the Annual Training Program 2025.', date: new Date().toISOString().split('T')[0], signatureName: defaults.signatureName, signatureTitle: defaults.signatureTitle, organizationName: defaults.organizationName, serialNumber: 'CERT-0001', status: 'pending' },
      { recipientName: 'Priya Patel', certificateTitle: 'Certificate of Completion', description: 'Has successfully completed the Digital Marketing Workshop.', date: new Date().toISOString().split('T')[0], signatureName: defaults.signatureName, signatureTitle: defaults.signatureTitle, organizationName: defaults.organizationName, serialNumber: 'CERT-0002', status: 'pending' },
      { recipientName: 'Amit Kumar', certificateTitle: 'Certificate of Participation', description: 'Participated in the Annual Sports Meet 2025.', date: new Date().toISOString().split('T')[0], signatureName: defaults.signatureName, signatureTitle: defaults.signatureTitle, organizationName: defaults.organizationName, serialNumber: 'CERT-0003', status: 'pending' },
    ]);
  };

  const downloadTemplate = () => {
    const csvContent = 'Name,Title,Description,Date\nJohn Doe,Certificate of Excellence,For outstanding performance,2025-01-01\nJane Smith,Certificate of Completion,Has completed the course,2025-01-01';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-certificate-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <AdBanner position="top" />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="h-7 w-7 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">Bulk Certificate Generator</h1>
          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">PRO</span>
        </div>
        <p className="text-gray-500 text-sm">Upload an Excel or CSV file to generate hundreds of certificates at once and download as ZIP.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="space-y-5">
          {/* Template Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Certificate Template</h3>
            <div className="space-y-2">
              {[{ id: 1, name: 'Classic Blue' }, { id: 2, name: 'Modern Gradient' }, { id: 3, name: 'Elegant Gold' }].map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${selectedTemplate === t.id ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Defaults */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Default Values</h3>
            <p className="text-xs text-gray-400">Used when not specified in CSV columns</p>
            {[
              { label: 'Certificate Title', key: 'certificateTitle' },
              { label: 'Organization', key: 'organizationName' },
              { label: 'Signatory Name', key: 'signatureName' },
              { label: 'Signatory Title', key: 'signatureTitle' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <input value={(defaults as any)[key]} onChange={e => setDefaults(d => ({ ...d, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 block mb-1">Default Date</label>
              <input type="date" value={defaults.date} onChange={e => setDefaults(d => ({ ...d, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Upload & Generate Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Upload Section */}
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">Upload Excel or CSV File</h3>
            <p className="text-sm text-gray-500 mb-4">Required column: <strong>Name</strong> (or Recipient / Student)<br />Optional: Title, Description, Date, Signatory, Organization</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="mr-2 h-4 w-4" /> Choose File (.xlsx / .csv)
              </Button>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" /> Download Sample CSV
              </Button>
              <Button variant="outline" onClick={handleLoadSample}>
                <FileText className="mr-2 h-4 w-4" /> Load Sample Data
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
          </div>

          {/* Records Preview */}
          {records.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">{records.length} Records Loaded</h3>
                <Button onClick={generateBulk} disabled={isGenerating}
                  className="bg-green-600 hover:bg-green-700 text-sm">
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating ({progress}%)...</> : <><Download className="mr-2 h-4 w-4" /> Generate All & Download ZIP</>}
                </Button>
              </div>

              {isGenerating && (
                <div className="mb-4">
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">Generating certificate {Math.round(progress * records.length / 100)} of {records.length}...</p>
                </div>
              )}

              {done && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-700 font-medium">All certificates generated! ZIP downloaded successfully.</p>
                </div>
              )}

              <div className="overflow-auto max-h-64">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 font-medium text-gray-500">#</th>
                      <th className="text-left p-2 font-medium text-gray-500">Name</th>
                      <th className="text-left p-2 font-medium text-gray-500">Title</th>
                      <th className="text-left p-2 font-medium text-gray-500">Date</th>
                      <th className="p-2 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="p-2 text-gray-400">{r.serialNumber}</td>
                        <td className="p-2 font-medium text-gray-800">{r.recipientName}</td>
                        <td className="p-2 text-gray-600">{r.certificateTitle}</td>
                        <td className="p-2 text-gray-400">{r.date}</td>
                        <td className="p-2 text-center">
                          {r.status === 'done' && <span className="text-green-500">✓</span>}
                          {r.status === 'generating' && <Loader2 className="h-3 w-3 animate-spin text-blue-500 inline" />}
                          {r.status === 'error' && <span className="text-red-500">✗</span>}
                          {r.status === 'pending' && <span className="text-gray-300">○</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CSV Format Help */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
            <h3 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> CSV Format Guide</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Your file should have a header row with column names. Supported headers:</p>
              <p className="font-mono bg-white rounded px-2 py-1 text-xs mt-2">Name, Title, Description, Date, Signatory, Organization</p>
              <p className="mt-2">Only the <strong>Name</strong> column is required. Others are optional and will use default values.</p>
              <p className="mt-2">Tip: Download our sample CSV template above to see the exact format.</p>
            </div>
          </div>
        </div>
      </div>
      
      <AdBanner position="bottom" />
    </div>
  );
}
