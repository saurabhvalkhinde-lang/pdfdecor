import { useState, useRef } from 'react';
import { Crown, Upload, Download, Ticket, AlertCircle, Check, Loader2, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { UpgradeModal } from '../components/UpgradeModal';
import { AdBanner } from '../components/AdBanner';
import { EventPassTemplate1, EventPassTemplate2, EventPassTemplate3 } from '../components/templates/EventPassTemplates';
import type { EventPassData } from '../components/templates/EventPassTemplates';
import { generatePDF } from '../utils/pdfGenerator';
import { Link } from 'react-router';

let JSZip: any = null;
const loadJSZip = async () => {
  if (!JSZip) {
    const mod = await import('jszip');
    JSZip = mod.default || mod;
  }
  return JSZip;
};

let XLSX: any = null;
const loadXLSX = async () => {
  if (!XLSX) {
    const mod = await import('xlsx');
    XLSX = mod;
  }
  return XLSX;
};

interface PassRecord {
  passHolder: string;
  passType?: string;
  passNumber?: string;
  description?: string;
  validFor?: string;
  status?: 'pending' | 'generating' | 'done' | 'error';
}

const TEMPLATE_MAP: Record<number, React.ComponentType<any>> = {
  1: EventPassTemplate1,
  2: EventPassTemplate2,
  3: EventPassTemplate3,
};

export function BulkEventPass() {
  const { isPro, user, trackEvent } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [records, setRecords] = useState<PassRecord[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [defaults, setDefaults] = useState({
    eventName: 'Annual Conference 2025',
    eventDate: new Date().toISOString().split('T')[0],
    eventTime: '10:00 AM',
    eventVenue: 'City Convention Centre',
    organizerName: user?.businessProfile?.companyName || 'Your Organization',
    organizerContact: user?.businessProfile?.companyPhone || '',
    passType: 'General',
  });

  // ── Gate: Pro only ─────────────────────────────────────────────────────────
  if (!isPro) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <AdBanner />
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-12 mt-6">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bulk Event Pass Generation</h1>
          <p className="text-gray-600 mb-4 text-lg">
            Generate hundreds of event passes at once from an Excel or CSV file.
          </p>
          <ul className="text-left max-w-sm mx-auto space-y-2 mb-8">
            {[
              'Upload Excel / CSV with attendee names',
              'Assign pass types (VIP, General, Media…)',
              'Auto-generate unique pass numbers',
              'Download all passes as a ZIP file',
              'Choose from 3 pass templates',
            ].map(f => (
              <li key={f} className="flex items-center gap-2 text-gray-700 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-8 py-3 font-bold text-lg shadow-lg"
          >
            <Crown className="mr-2 h-5 w-5" /> Upgrade to Pro — ₹249/month
          </Button>
          <p className="text-gray-400 text-sm mt-4">
            Or <Link to="/event-pass" className="text-blue-600 underline">generate individual passes for free</Link>
          </p>
        </div>
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger="template" />
      </div>
    );
  }

  // ── CSV/Excel upload ───────────────────────────────────────────────────────
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const xlsx = await loadXLSX();
      const buffer = await file.arrayBuffer();
      const wb = xlsx.read(buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: any[] = xlsx.utils.sheet_to_json(ws, { defval: '' });

      const parsed: PassRecord[] = data
        .filter(row => row.passHolder || row.name || row.Name || row['Pass Holder'])
        .map((row, i) => ({
          passHolder: row.passHolder || row.name || row.Name || row['Pass Holder'] || `Attendee ${i + 1}`,
          passType: row.passType || row['Pass Type'] || row.type || defaults.passType,
          passNumber: row.passNumber || row['Pass Number'] || `PASS-${String(i + 1).padStart(4, '0')}`,
          description: row.description || row.Description || '',
          validFor: row.validFor || row['Valid For'] || '1 Day',
          status: 'pending',
        }));

      if (parsed.length === 0) {
        alert('No valid records found. Make sure your file has a "passHolder" or "name" column.');
        return;
      }
      setRecords(parsed);
      setDone(false);
      setProgress(0);
    } catch (err) {
      alert('Failed to parse file. Please use a valid CSV or Excel file.');
      console.error(err);
    }
  };

  // ── Generate all ──────────────────────────────────────────────────────────
  const generateAll = async () => {
    if (records.length === 0) return;
    setIsGenerating(true);
    setProgress(0);

    const zip = await loadJSZip();
    const zipFile = new zip();
    const TemplateComp = TEMPLATE_MAP[selectedTemplate];

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      setRecords(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'generating' } : r));

      try {
        const passData: EventPassData = {
          eventName: defaults.eventName,
          eventDate: defaults.eventDate,
          eventTime: defaults.eventTime,
          eventVenue: defaults.eventVenue,
          organizerName: defaults.organizerName,
          organizerContact: defaults.organizerContact,
          passHolder: rec.passHolder,
          passType: rec.passType || defaults.passType,
          passNumber: rec.passNumber || `PASS-${String(i + 1).padStart(4, '0')}`,
          description: rec.description,
          validFor: rec.validFor,
        };

        // Render pass in hidden container
        const containerId = `bulk-pass-render-${i}`;
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;z-index:-1;background:#fff;';
          document.body.appendChild(container);
        }

        // Mount via React renderToStaticMarkup-like approach using a hidden div
        const ReactDOM = (await import('react-dom/client')).default;
        const root = ReactDOM.createRoot(container);
        await new Promise<void>(resolve => {
          root.render(<TemplateComp data={passData} isPro={true} />);
          setTimeout(resolve, 600);
        });

        await generatePDF(containerId, `pass-${rec.passHolder.replace(/\s+/g, '-')}.pdf`, { isPro: true });

        // Cleanup
        root.unmount();
        document.body.removeChild(container);

        setRecords(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'done' } : r));
        trackEvent('pdf_generated', { type: 'event-pass' });
      } catch (err) {
        console.error(`Error generating pass for ${rec.passHolder}:`, err);
        setRecords(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'error' } : r));
      }

      setProgress(Math.round(((i + 1) / records.length) * 100));
      await new Promise(r => setTimeout(r, 200));
    }

    setIsGenerating(false);
    setDone(true);
  };

  const downloadSampleCSV = () => {
    const csv = `passHolder,passType,passNumber,description,validFor
John Smith,VIP,PASS-0001,Tech Summit 2025,2 Days
Sarah Johnson,General,PASS-0002,,1 Day
Mike Davis,Media,PASS-0003,Press Access,All Days
Emily Brown,Speaker,PASS-0004,Conference Speaker,3 Days`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-event-passes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Crown className="h-4 w-4 text-yellow-300" />
          Pro Feature
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Ticket className="h-8 w-8 text-teal-600" />
          Bulk Event Pass Generator
        </h1>
        <p className="text-gray-600">Upload a CSV or Excel file to generate all event passes at once and download as ZIP.</p>
      </div>

      {/* Step 1: Event details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="bg-teal-100 text-teal-700 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">1</span>
          Event Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'eventName', label: 'Event Name', placeholder: 'Annual Conference 2025' },
            { key: 'organizerName', label: 'Organizer Name', placeholder: 'Your Organization' },
            { key: 'eventDate', label: 'Event Date', type: 'date' },
            { key: 'eventTime', label: 'Event Time', placeholder: '10:00 AM' },
            { key: 'eventVenue', label: 'Venue', placeholder: 'City Convention Centre' },
            { key: 'passType', label: 'Default Pass Type', placeholder: 'General' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <Label htmlFor={key} className="text-sm font-medium text-gray-700 mb-1 block">{label}</Label>
              <Input
                id={key}
                type={type || 'text'}
                value={defaults[key as keyof typeof defaults]}
                placeholder={placeholder}
                onChange={e => setDefaults(prev => ({ ...prev, [key]: e.target.value }))}
                className="h-10"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Template */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="bg-teal-100 text-teal-700 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">2</span>
          Choose Pass Template
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTemplate(t)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                selectedTemplate === t
                  ? 'border-teal-500 bg-teal-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Ticket className={`h-8 w-8 mx-auto mb-2 ${selectedTemplate === t ? 'text-teal-600' : 'text-gray-400'}`} />
              <div className="font-semibold text-sm text-gray-700">Template {t}</div>
              <div className="text-xs text-gray-400 mt-1">
                {t === 1 ? 'Purple Gradient' : t === 2 ? 'Dark Minimal' : 'Green Classic'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Upload */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="bg-teal-100 text-teal-700 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">3</span>
          Upload Attendee List
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div
            className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-400 hover:bg-teal-50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">Click to upload CSV or Excel</p>
            <p className="text-gray-400 text-sm mt-1">Columns: passHolder, passType, passNumber (optional)</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
          <div className="flex flex-col gap-2 justify-center">
            <Button variant="outline" onClick={downloadSampleCSV} className="whitespace-nowrap">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Sample CSV
            </Button>
          </div>
        </div>

        {records.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              ✅ {records.length} attendee records loaded
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {records.slice(0, 20).map((rec, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100 text-sm">
                  <span className="font-medium text-gray-800">{rec.passHolder}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{rec.passType}</span>
                    {rec.status === 'done' && <Check className="h-4 w-4 text-green-500" />}
                    {rec.status === 'generating' && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                    {rec.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              ))}
              {records.length > 20 && (
                <p className="text-xs text-gray-400 text-center py-1">
                  + {records.length - 20} more records
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Generate */}
      {records.length > 0 && (
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6 text-center">
          {isGenerating ? (
            <div className="space-y-4">
              <Loader2 className="h-10 w-10 text-teal-600 animate-spin mx-auto" />
              <p className="text-gray-700 font-semibold">Generating passes… {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-gray-500 text-sm">Please keep this tab open.</p>
            </div>
          ) : done ? (
            <div className="space-y-4">
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-bold text-gray-900">All passes generated!</h3>
              <p className="text-gray-600 text-sm">
                {records.filter(r => r.status === 'done').length} passes downloaded successfully.
              </p>
              <Button
                onClick={() => { setRecords([]); setDone(false); setProgress(0); }}
                variant="outline"
                className="mt-2"
              >
                Generate Another Batch
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Ticket className="h-12 w-12 text-teal-500 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900">Ready to generate {records.length} passes!</h3>
              <p className="text-gray-600 text-sm">Each pass will be downloaded individually as a PDF.</p>
              <Button
                onClick={generateAll}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 font-bold text-lg shadow-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Generate & Download All Passes
              </Button>
            </div>
          )}
        </div>
      )}

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger="template" />
    </div>
  );
}
