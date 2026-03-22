import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import {
  Plus, Edit, Trash2, Eye, GripVertical, Crown, Star,
  ChevronUp, ChevronDown, X, Save, Copy, RefreshCw,
  Palette, Type, Layout, Settings2, Check,
  FileText, Award, CreditCard, Calendar, Receipt,
  FilePlus, Briefcase, PartyPopper, AlignLeft,
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { addLog } from '../utils/auditLog';

/* ── Doc type registry ─────────────────────────────────────────────────────── */
const DOC_TYPES = [
  { key: 'invoice',             label: 'Invoice',             icon: FileText,   count: 5 },
  { key: 'certificate',         label: 'Certificate',         icon: Award,      count: 3 },
  { key: 'id-card',             label: 'ID Card',             icon: CreditCard, count: 5 },
  { key: 'event-pass',          label: 'Event Pass',          icon: PartyPopper,count: 5 },
  { key: 'bill',                label: 'Bill',                icon: Receipt,    count: 3 },
  { key: 'receipt',             label: 'Receipt',             icon: Receipt,    count: 5 },
  { key: 'quotation',           label: 'Quotation',           icon: FilePlus,   count: 2 },
  { key: 'estimate',            label: 'Estimate',            icon: AlignLeft,  count: 5 },
  { key: 'offer-letter',        label: 'Offer Letter',        icon: Briefcase,  count: 5 },
  { key: 'appointment-letter',  label: 'Appt. Letter',        icon: Calendar,   count: 5 },
];

const FONTS = [
  'Inter','Roboto','Poppins','Montserrat','Open Sans',
  'Lato','Raleway','Playfair Display','Merriweather','Source Sans Pro',
];
const HEADER_STYLES  = ['modern','classic','minimal','bold','elegant','corporate'];
const TABLE_STYLES   = ['clean','striped','bordered','minimal','colorful'];
const SPACINGS       = ['compact','comfortable','spacious'];
const BORDER_RADII   = ['none','small','medium','large','pill'];

const PRESET_COLORS = [
  '#2563eb','#7c3aed','#dc2626','#059669','#d97706',
  '#0891b2','#db2777','#65a30d','#9333ea','#1d4ed8',
  '#0f172a','#374151','#6b7280','#78716c','#44403c',
];

const COLOR_THEMES = [
  { name: 'Ocean Blue',   primary:'#2563eb', secondary:'#eff6ff', accent:'#0ea5e9' },
  { name: 'Forest',       primary:'#059669', secondary:'#f0fdf4', accent:'#10b981' },
  { name: 'Royal Purple', primary:'#7c3aed', secondary:'#f5f3ff', accent:'#a78bfa' },
  { name: 'Sunset Red',   primary:'#dc2626', secondary:'#fef2f2', accent:'#f97316' },
  { name: 'Golden',       primary:'#d97706', secondary:'#fffbeb', accent:'#fbbf24' },
  { name: 'Slate Dark',   primary:'#1e293b', secondary:'#f8fafc', accent:'#64748b' },
];

const TEMPLATE_KEY  = 'pdfdecor_admin_templates';
const SEEDED_KEY    = 'pdfdecor_templates_seeded_v2';

const DEFAULT_CONFIG = {
  font: 'Inter',
  primaryColor: '#2563eb',
  secondaryColor: '#f1f5f9',
  accentColor: '#0ea5e9',
  headerStyle: 'modern',
  tableStyle: 'clean',
  spacing: 'comfortable',
  borderRadius: 'medium',
  showLogo: true,
  showWatermark: false,
  showBorder: true,
  customCSS: '',
};

/* ── Types ──────────────────────────────────────────────────────────────────── */
interface TemplateRow {
  id: string;
  name: string;
  slug: string;
  document_type: string;
  preview_image_url?: string;
  description?: string;
  is_pro: boolean;
  display_order: number;
  layout_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

type EditorTab = 'basic' | 'colors' | 'typography' | 'layout' | 'advanced';

interface FormState {
  name: string; slug: string; document_type: string;
  is_pro: boolean; preview_image_url: string; description: string;
  config: Record<string, any>;
}

/* ── Storage ────────────────────────────────────────────────────────────────── */
function loadTemplates(): TemplateRow[] {
  try {
    return (JSON.parse(localStorage.getItem(TEMPLATE_KEY) || '[]') as TemplateRow[])
      .sort((a, b) => a.display_order - b.display_order);
  } catch { return []; }
}
function saveTemplates(t: TemplateRow[]) { localStorage.setItem(TEMPLATE_KEY, JSON.stringify(t)); }

/* ── Seed built-in templates once ──────────────────────────────────────────── */
function seedBuiltIn() {
  if (localStorage.getItem(SEEDED_KEY) && loadTemplates().length > 0) return;
  const now = new Date().toISOString();
  const presets = [
    { primaryColor:'#2563eb', headerStyle:'modern',    tableStyle:'clean',    font:'Inter'          },
    { primaryColor:'#7c3aed', headerStyle:'elegant',   tableStyle:'striped',  font:'Poppins'        },
    { primaryColor:'#059669', headerStyle:'minimal',   tableStyle:'minimal',  font:'Roboto'         },
    { primaryColor:'#dc2626', headerStyle:'bold',      tableStyle:'bordered', font:'Montserrat'     },
    { primaryColor:'#d97706', headerStyle:'corporate', tableStyle:'colorful', font:'Lato'           },
  ];
  let order = 0;
  const rows: TemplateRow[] = [];
  DOC_TYPES.forEach(dt => {
    for (let i = 1; i <= dt.count; i++) {
      const p = presets[(i - 1) % presets.length];
      rows.push({
        id: `builtin_${dt.key}_${i}`,
        name: `${dt.label} Template ${i}`,
        slug: `${dt.key}-template-${i}`,
        document_type: dt.key,
        is_pro: i > 1,
        display_order: order++,
        description: `${i > 1 ? 'Pro' : 'Free'} ${dt.label.toLowerCase()} — ${p.headerStyle} style`,
        layout_config: { ...DEFAULT_CONFIG, ...p, secondaryColor:'#f8fafc', templateIndex: i },
        created_at: now,
        updated_at: now,
      });
    }
  });
  if (loadTemplates().length === 0) saveTemplates(rows);
  localStorage.setItem(SEEDED_KEY, '1');
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
        <input type="text" value={value}
          onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex flex-wrap gap-1">
        {PRESET_COLORS.map(c => (
          <button key={c} type="button" onClick={() => onChange(c)}
            style={{ backgroundColor: c }}
            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${value === c ? 'border-gray-800 scale-110' : 'border-white shadow-sm'}`} />
        ))}
      </div>
    </div>
  );
}

function LivePreview({ config, docType }: { config: Record<string, any>; docType: string }) {
  const {
    font = 'Inter', primaryColor = '#2563eb', secondaryColor = '#f1f5f9',
    accentColor = '#0ea5e9', headerStyle = 'modern', tableStyle = 'clean',
    spacing = 'comfortable', borderRadius = 'medium',
    showBorder = true, showLogo = true, showWatermark = false,
  } = config;

  const pad = spacing === 'compact' ? '8px' : spacing === 'spacious' ? '20px' : '12px';
  const br  = borderRadius === 'none' ? '0' : borderRadius === 'small' ? '4px'
            : borderRadius === 'large' ? '12px' : borderRadius === 'pill' ? '20px' : '8px';

  const hdrBg    = ['modern','bold'].includes(headerStyle) ? primaryColor : headerStyle === 'corporate' ? '#1e293b' : '#fff';
  const hdrColor = ['modern','bold','corporate'].includes(headerStyle) ? '#fff' : primaryColor;
  const tblHdrBg = tableStyle === 'colorful' ? primaryColor : ['striped','clean'].includes(tableStyle) ? secondaryColor : '#fff';
  const tblHdrFg = tableStyle === 'colorful' ? '#fff' : '#374151';
  const evenBg   = tableStyle === 'striped' ? '#f9fafb' : '#fff';

  const dtLabel = DOC_TYPES.find(d => d.key === docType)?.label || docType;

  return (
    <div style={{ fontFamily:`'${font}',sans-serif`, border: showBorder ? `2px solid ${primaryColor}` : '1px solid #e5e7eb',
        borderRadius: br, overflow:'hidden', fontSize:'11px', lineHeight:'1.4', position:'relative',
        backgroundColor:'#fff', minHeight:'300px' }}>

      {/* Header */}
      <div style={{ backgroundColor: hdrBg, color: hdrColor, padding: pad }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            {showLogo && (
              <div style={{ width:30, height:30, borderRadius: br, marginBottom:4, backgroundColor:
                  hdrColor === '#fff' ? 'rgba(255,255,255,.25)' : primaryColor,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:14 }}>📄</span>
              </div>
            )}
            <div style={{ fontWeight:700, fontSize:13 }}>Company Name</div>
            <div style={{ opacity:.75, fontSize:9 }}>company@email.com · +91 98765 43210</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontWeight:800, fontSize:14, textTransform:'uppercase', letterSpacing:1 }}>{dtLabel}</div>
            <div style={{ fontSize:9, opacity:.8 }}>#INV-001 · {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: pad }}>
        <div style={{ display:'flex', gap:'10px', marginBottom:10 }}>
          {['Bill To','Details'].map((h, i) => (
            <div key={h} style={{ flex:1, backgroundColor: secondaryColor, borderRadius: br, padding:'6px 8px' }}>
              <div style={{ fontSize:8, fontWeight:700, color: accentColor, marginBottom:3, textTransform:'uppercase' }}>{h}</div>
              {i === 0 ? (
                <>
                  <div style={{ fontWeight:600, color:'#111', fontSize:10 }}>Customer Name</div>
                  <div style={{ color:'#6b7280', fontSize:9 }}>customer@example.com</div>
                  <div style={{ color:'#6b7280', fontSize:9 }}>123 Street, City, State</div>
                </>
              ) : (
                <>
                  <div style={{ color:'#374151', fontSize:9 }}>Issue: {new Date().toLocaleDateString()}</div>
                  <div style={{ color:'#374151', fontSize:9 }}>Due: {new Date(Date.now()+30*864e5).toLocaleDateString()}</div>
                  <div style={{ color:'#059669', fontSize:9, fontWeight:700 }}>Status: Unpaid</div>
                </>
              )}
            </div>
          ))}
        </div>

        <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:10, fontSize:10 }}>
          <thead>
            <tr style={{ backgroundColor: tblHdrBg, color: tblHdrFg }}>
              {['Description','Qty','Rate','Amount'].map(h => (
                <th key={h} style={{ padding:'5px 6px', textAlign: h === 'Description' ? 'left' : 'right',
                    fontWeight:700, fontSize:9,
                    border: tableStyle === 'bordered' ? '1px solid #e5e7eb' : 'none' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[['Sample Service','2','₹500','₹1,000'],['Another Item','1','₹250','₹250']].map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 1 ? evenBg : '#fff' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding:'4px 6px', textAlign: j === 0 ? 'left' : 'right', color:'#374151',
                      border: tableStyle === 'bordered' ? '1px solid #e5e7eb' : 'none',
                      borderBottom:'1px solid #f3f4f6' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <div style={{ minWidth:160 }}>
            {[['Subtotal','₹1,250'],['Tax (18%)','₹225']].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'2px 0', color:'#6b7280', fontSize:9 }}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 6px', marginTop:3,
                backgroundColor: primaryColor, color:'#fff', borderRadius: br, fontWeight:700, fontSize:11 }}>
              <span>Total</span><span>₹1,475</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: secondaryColor, borderTop:`2px solid ${primaryColor}`,
          padding:`6px ${pad}`, textAlign:'center', color:'#6b7280', fontSize:8 }}>
        Thank you for your business! · PDFDecor
      </div>

      {showWatermark && (
        <div style={{ position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%) rotate(-30deg)', fontSize:36, fontWeight:900,
            color:'rgba(0,0,0,.06)', pointerEvents:'none', userSelect:'none', whiteSpace:'nowrap' }}>
          PDFDECOR
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function AdminTemplates() {
  const { session } = useAdminAuth();
  const [searchParams] = useSearchParams();

  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [search, setSearch]     = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editorTab, setEditorTab]   = useState<EditorTab>('basic');
  const [editing, setEditing]       = useState<TemplateRow | null>(null);
  const [form, setForm]             = useState<FormState>(emptyForm());
  const [saved, setSaved]           = useState(false);
  const [previewId, setPreviewId]   = useState<string | null>(null);

  /* sync URL param → filter */
  useEffect(() => { setTypeFilter(searchParams.get('type') || 'all'); }, [searchParams]);

  const load = useCallback(() => { seedBuiltIn(); setTemplates(loadTemplates()); }, []);
  useEffect(() => { load(); }, [load]);

  function log(action: string, id: string) {
    if (session) addLog(session.adminId, session.email, action, 'template', id);
  }

  /* ── form helpers ── */
  function emptyForm(): FormState {
    return { name:'', slug:'', document_type:'invoice', is_pro:false,
             preview_image_url:'', description:'', config:{ ...DEFAULT_CONFIG } };
  }
  function fromRow(t: TemplateRow): FormState {
    return { name:t.name, slug:t.slug, document_type:t.document_type, is_pro:t.is_pro,
             preview_image_url: t.preview_image_url || '', description: t.description || '',
             config:{ ...DEFAULT_CONFIG, ...t.layout_config } };
  }
  function patch(cfg: Record<string, any>) {
    setForm(f => ({ ...f, config:{ ...f.config, ...cfg } }));
  }

  /* ── CRUD ── */
  function openNew() {
    setEditing(null); setForm(emptyForm()); setEditorTab('basic'); setShowEditor(true);
  }
  function openEdit(t: TemplateRow) {
    setEditing(t); setForm(fromRow(t)); setEditorTab('basic'); setShowEditor(true);
  }

  function handleSave() {
    if (!form.name.trim()) { alert('Template name is required'); return; }
    const all  = loadTemplates();
    const now  = new Date().toISOString();
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');

    if (editing) {
      const idx = all.findIndex(t => t.id === editing.id);
      if (idx >= 0) all[idx] = { ...all[idx], name:form.name.trim(), slug,
        document_type:form.document_type, is_pro:form.is_pro,
        preview_image_url:form.preview_image_url, description:form.description,
        layout_config:form.config, updated_at:now };
      log('Template updated', editing.id);
    } else {
      const t: TemplateRow = {
        id:`tmpl_${Date.now()}`, name:form.name.trim(), slug,
        document_type:form.document_type, is_pro:form.is_pro,
        preview_image_url:form.preview_image_url, description:form.description,
        layout_config:form.config, display_order:all.length,
        created_at:now, updated_at:now,
      };
      all.push(t);
      log('Template created', t.id);
    }
    saveTemplates(all);
    load();
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowEditor(false); }, 1200);
  }

  function handleDelete(t: TemplateRow) {
    if (!confirm(`Delete "${t.name}"? This cannot be undone.`)) return;
    saveTemplates(loadTemplates().filter(x => x.id !== t.id));
    log('Template deleted', t.id);
    load();
  }

  function handleDuplicate(t: TemplateRow) {
    const all = loadTemplates();
    const now = new Date().toISOString();
    const copy: TemplateRow = { ...t, id:`tmpl_${Date.now()}`,
      name:`${t.name} (Copy)`, slug:`${t.slug}-copy`,
      display_order:all.length, created_at:now, updated_at:now };
    all.push(copy);
    saveTemplates(all);
    log('Template duplicated', copy.id);
    load();
  }

  function togglePro(t: TemplateRow) {
    const all = loadTemplates();
    const idx = all.findIndex(x => x.id === t.id);
    if (idx >= 0) { all[idx].is_pro = !all[idx].is_pro; all[idx].updated_at = new Date().toISOString(); }
    saveTemplates(all);
    log(`Template ${all[idx]?.is_pro ? 'set Pro' : 'set Free'}`, t.id);
    load();
  }

  function moveUp(idx: number) {
    const all = [...templates]; if (idx === 0) return;
    [all[idx-1], all[idx]] = [all[idx], all[idx-1]];
    all.forEach((t,i) => { t.display_order=i; t.updated_at=new Date().toISOString(); });
    saveTemplates(all); setTemplates(all);
  }
  function moveDown(idx: number) {
    const all = [...templates]; if (idx === all.length-1) return;
    [all[idx+1], all[idx]] = [all[idx], all[idx+1]];
    all.forEach((t,i) => { t.display_order=i; t.updated_at=new Date().toISOString(); });
    saveTemplates(all); setTemplates(all);
  }

  function resetToBuiltin() {
    if (!confirm('Reset ALL templates to built-in defaults? Custom templates will be lost.')) return;
    localStorage.removeItem(TEMPLATE_KEY);
    localStorage.removeItem(SEEDED_KEY);
    load();
  }

  const filtered = templates.filter(t => {
    const mt = typeFilter === 'all' || t.document_type === typeFilter;
    const ms = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.document_type.includes(search.toLowerCase());
    return mt && ms;
  });

  const previewTemplate = previewId ? templates.find(t => t.id === previewId) : null;

  /* ── Editor modal ─────────────────────────────────────────────────────────── */
  const EDITOR_TABS: { key: EditorTab; label: string; icon: any }[] = [
    { key:'basic',      label:'Basic',      icon: FileText   },
    { key:'colors',     label:'Colors',     icon: Palette    },
    { key:'typography', label:'Typography', icon: Type       },
    { key:'layout',     label:'Layout',     icon: Layout     },
    { key:'advanced',   label:'Advanced',   icon: Settings2  },
  ];

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-500 text-sm">
            {templates.length} templates · {DOC_TYPES.length} document types
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetToBuiltin}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm">
            <Plus className="h-4 w-4" /> New Template
          </button>
        </div>
      </div>

      {/* ── Doc-type stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {DOC_TYPES.map(dt => {
          const Icon = dt.icon;
          const total = templates.filter(t => t.document_type === dt.key).length;
          const pro   = templates.filter(t => t.document_type === dt.key && t.is_pro).length;
          const active = typeFilter === dt.key;
          return (
            <button key={dt.key}
              onClick={() => setTypeFilter(active ? 'all' : dt.key)}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                active ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                       : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50'}`}>
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-blue-500'}`} />
              <div className="min-w-0">
                <div className={`text-xs font-bold truncate ${active ? 'text-white' : 'text-gray-700'}`}>{dt.label}</div>
                <div className={`text-[10px] ${active ? 'text-blue-100' : 'text-gray-400'}`}>{total} · {pro} Pro</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Search / filter bar ── */}
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <input type="search" placeholder="Search templates…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">All Types ({templates.length})</option>
          {DOC_TYPES.map(dt => (
            <option key={dt.key} value={dt.key}>
              {dt.label} ({templates.filter(t => t.document_type === dt.key).length})
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-400 whitespace-nowrap">{filtered.length} shown</span>
      </div>

      {/* ── Templates table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 w-16">Order</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Template</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Type</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Style</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Tier</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Updated</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-gray-200" />
                      <span className="text-sm">No templates found.</span>
                      <button onClick={openNew} className="text-blue-600 text-sm font-semibold hover:underline">
                        + Create your first template
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((t, idx) => {
                const dt = DOC_TYPES.find(d => d.key === t.document_type);
                const Icon = dt?.icon || FileText;
                return (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    {/* Order */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <GripVertical className="h-4 w-4 text-gray-200" />
                        <span className="text-gray-400 text-xs font-mono">#{t.display_order+1}</span>
                        <div className="flex flex-col ml-0.5">
                          <button onClick={() => moveUp(idx)} className="text-gray-300 hover:text-gray-600 leading-none">
                            <ChevronUp className="h-3 w-3" /></button>
                          <button onClick={() => moveDown(idx)} className="text-gray-300 hover:text-gray-600 leading-none">
                            <ChevronDown className="h-3 w-3" /></button>
                        </div>
                      </div>
                    </td>
                    {/* Name */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div style={{ backgroundColor: t.layout_config?.primaryColor || '#2563eb' }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                          <div className="text-xs text-gray-400">{t.slug}</div>
                          {t.description && (
                            <div className="text-xs text-gray-400 truncate max-w-[200px]">{t.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Type */}
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {dt?.label || t.document_type}
                      </span>
                    </td>
                    {/* Style */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: t.layout_config?.primaryColor || '#2563eb' }} />
                        <span className="text-xs text-gray-500 capitalize">
                          {t.layout_config?.headerStyle || 'modern'}
                        </span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{t.layout_config?.font || 'Inter'}</span>
                      </div>
                    </td>
                    {/* Tier */}
                    <td className="px-3 py-3">
                      <button onClick={() => togglePro(t)} title="Click to toggle"
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                          t.is_pro ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {t.is_pro ? <><Crown className="h-3 w-3" />Pro</> : <><Star className="h-3 w-3" />Free</>}
                      </button>
                    </td>
                    {/* Date */}
                    <td className="px-3 py-3 text-xs text-gray-400">
                      {new Date(t.updated_at).toLocaleDateString()}
                    </td>
                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPreviewId(previewId === t.id ? null : t.id)}
                          className={`p-1.5 rounded-lg transition-colors ${previewId === t.id ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 text-green-500'}`}
                          title="Preview"><Eye className="h-3.5 w-3.5" /></button>
                        <button onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                          title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDuplicate(t)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"
                          title="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(t)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                          title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Inline preview panel ── */}
      {previewTemplate && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Preview — {previewTemplate.name}</h3>
            <button onClick={() => setPreviewId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="max-w-sm">
              <LivePreview config={previewTemplate.layout_config} docType={previewTemplate.document_type} />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-700">Layout Config JSON</h4>
              <pre className="bg-gray-50 rounded-xl p-4 text-xs font-mono text-gray-600 overflow-auto max-h-64">
                {JSON.stringify(previewTemplate.layout_config, null, 2)}
              </pre>
              <button onClick={() => { setPreviewId(null); openEdit(previewTemplate); }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700">
                <Edit className="h-4 w-4" /> Edit This Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          EDITOR MODAL
         ══════════════════════════════════════════════════════════════════════ */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl my-8">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editing ? `Edit: ${editing.name}` : 'Create New Template'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editing ? 'Modify template settings and style' : 'Configure a new template for any document type'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowEditor(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-sm ${
                    saved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {saved ? <><Check className="h-4 w-4" />Saved!</> : <><Save className="h-4 w-4" />Save Template</>}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 divide-x divide-gray-100">

              {/* LEFT — Editor tabs */}
              <div>
                {/* Tab strip */}
                <div className="flex border-b border-gray-100">
                  {EDITOR_TABS.map(et => {
                    const Icon = et.icon;
                    return (
                      <button key={et.key} onClick={() => setEditorTab(et.key)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                          editorTab === et.key ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Icon className="h-4 w-4" />{et.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">

                  {/* ── BASIC ── */}
                  {editorTab === 'basic' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Template Name *</label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))}
                          placeholder="e.g. Classic Blue Invoice"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Slug <span className="font-normal text-gray-400">(auto-generated if blank)</span>
                        </label>
                        <input type="text" value={form.slug} onChange={e => setForm(f => ({...f, slug:e.target.value}))}
                          placeholder="classic-blue-invoice"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))}
                          placeholder="Brief description…" rows={2} resize-none
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Document Type</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {DOC_TYPES.map(dt => {
                            const Icon = dt.icon;
                            return (
                              <button key={dt.key} type="button"
                                onClick={() => setForm(f => ({...f, document_type:dt.key}))}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                                  form.document_type === dt.key ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}>
                                <Icon className="h-3.5 w-3.5" />{dt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Preview Image URL</label>
                        <input type="url" value={form.preview_image_url}
                          onChange={e => setForm(f => ({...f, preview_image_url:e.target.value}))}
                          placeholder="https://example.com/preview.png"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50">
                        <input type="checkbox" checked={form.is_pro}
                          onChange={e => setForm(f => ({...f, is_pro:e.target.checked}))}
                          className="w-4 h-4 rounded accent-purple-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            <Crown className="h-4 w-4 text-purple-500" /> Pro-only Template
                          </div>
                          <div className="text-xs text-gray-400">Only Pro subscribers can access this template</div>
                        </div>
                      </label>
                    </>
                  )}

                  {/* ── COLORS ── */}
                  {editorTab === 'colors' && (
                    <div className="space-y-5">
                      <ColorPicker label="Primary Color" value={form.config.primaryColor || '#2563eb'} onChange={v => patch({ primaryColor:v })} />
                      <ColorPicker label="Secondary / Background" value={form.config.secondaryColor || '#f1f5f9'} onChange={v => patch({ secondaryColor:v })} />
                      <ColorPicker label="Accent / Highlight" value={form.config.accentColor || '#0ea5e9'} onChange={v => patch({ accentColor:v })} />
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-2">Color Themes</p>
                        <div className="grid grid-cols-3 gap-2">
                          {COLOR_THEMES.map(ct => (
                            <button key={ct.name} type="button"
                              onClick={() => patch({ primaryColor:ct.primary, secondaryColor:ct.secondary, accentColor:ct.accent })}
                              className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                              <div className="flex gap-1">
                                {[ct.primary, ct.secondary, ct.accent].map(c => (
                                  <div key={c} className="w-5 h-5 rounded-full border border-gray-100" style={{ backgroundColor:c }} />
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-500 text-center leading-tight">{ct.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TYPOGRAPHY ── */}
                  {editorTab === 'typography' && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-2">Font Family</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {FONTS.map(f => (
                            <button key={f} type="button" onClick={() => patch({ font:f })}
                              style={{ fontFamily: f }}
                              className={`px-3 py-2 rounded-xl border text-sm transition-all ${
                                form.config.font === f ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-200'}`}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-2">Spacing</p>
                        <div className="flex gap-2">
                          {SPACINGS.map(s => (
                            <button key={s} type="button" onClick={() => patch({ spacing:s })}
                              className={`flex-1 py-2 rounded-xl border text-sm capitalize font-medium transition-all ${
                                form.config.spacing === s ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── LAYOUT ── */}
                  {editorTab === 'layout' && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-2">Header Style</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {HEADER_STYLES.map(s => (
                            <button key={s} type="button" onClick={() => patch({ headerStyle:s })}
                              className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                                form.config.headerStyle === s ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-2">Table Style</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {TABLE_STYLES.map(s => (
                            <button key={s} type="button" onClick={() => patch({ tableStyle:s })}
                              className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                                form.config.tableStyle === s ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700 mb-2">Border Radius</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {BORDER_RADII.map(r => (
                            <button key={r} type="button" onClick={() => patch({ borderRadius:r })}
                              className={`flex-1 min-w-[60px] py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                                form.config.borderRadius === r ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200'}`}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { k:'showLogo',      l:'Show Logo',       d:'Logo placeholder in header' },
                          { k:'showBorder',    l:'Outer Border',    d:'Border around the document' },
                          { k:'showWatermark', l:'Watermark',       d:'PDFDECOR watermark overlay' },
                        ].map(o => (
                          <label key={o.k} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={!!form.config[o.k]}
                              onChange={e => patch({ [o.k]:e.target.checked })}
                              className="w-4 h-4 rounded accent-blue-600" />
                            <div>
                              <div className="text-sm font-semibold text-gray-700">{o.l}</div>
                              <div className="text-xs text-gray-400">{o.d}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── ADVANCED ── */}
                  {editorTab === 'advanced' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Custom CSS Overrides</label>
                        <textarea value={form.config.customCSS || ''}
                          onChange={e => patch({ customCSS:e.target.value })}
                          placeholder={`.pdf-header {\n  background: linear-gradient(135deg,#667eea,#764ba2);\n}`}
                          rows={6}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Raw JSON Config</label>
                        <textarea value={JSON.stringify(form.config, null, 2)}
                          onChange={e => { try { setForm(f => ({...f, config:JSON.parse(e.target.value)})); } catch { /* invalid */ }}}
                          rows={10}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        <p className="text-xs text-gray-400 mt-1">Edit JSON directly — changes reflect instantly in preview.</p>
                      </div>
                      <button type="button" onClick={() => setForm(f => ({...f, config:{...DEFAULT_CONFIG}}))}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50">
                        <RefreshCw className="h-4 w-4" /> Reset to Defaults
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — Live preview */}
              <div className="p-5 space-y-4 bg-gray-50/50 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" /> Live Preview
                  </h3>
                  <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full capitalize">
                    {DOC_TYPES.find(d => d.key === form.document_type)?.label || form.document_type}
                  </span>
                </div>

                <LivePreview config={form.config} docType={form.document_type} />

                {/* Summary chips */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l:'Font',    v: form.config.font || 'Inter' },
                    { l:'Header',  v: form.config.headerStyle || 'modern' },
                    { l:'Table',   v: form.config.tableStyle || 'clean' },
                    { l:'Spacing', v: form.config.spacing || 'comfortable' },
                    { l:'Radius',  v: form.config.borderRadius || 'medium' },
                    { l:'Tier',    v: form.is_pro ? '★ Pro' : '◇ Free' },
                  ].map(i => (
                    <div key={i.l} className="bg-white rounded-lg p-2 text-center border border-gray-100">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{i.l}</div>
                      <div className="text-xs text-gray-700 font-semibold capitalize truncate">{i.v}</div>
                    </div>
                  ))}
                </div>

                {/* Color swatches */}
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Palette</p>
                  <div className="flex gap-3">
                    {[
                      { l:'Primary',   c: form.config.primaryColor   || '#2563eb' },
                      { l:'Secondary', c: form.config.secondaryColor || '#f1f5f9' },
                      { l:'Accent',    c: form.config.accentColor    || '#0ea5e9' },
                    ].map(s => (
                      <div key={s.l} className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md border border-gray-200 shadow-sm"
                          style={{ backgroundColor: s.c }} />
                        <div>
                          <div className="text-[10px] font-semibold text-gray-600">{s.l}</div>
                          <div className="text-[10px] font-mono text-gray-400">{s.c}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
