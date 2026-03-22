import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Crown,
  FileText,
  Award,
  Receipt,
  FileSpreadsheet,
  Trash2,
  Copy,
  Clock,
  MoreVertical,
  Pencil,
  Layers,
  Search,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router';

const TYPE_META: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  invoice: { label: 'Invoice', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  bill: { label: 'Bill', icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50' },
  receipt: { label: 'Receipt', icon: Receipt, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  quotation: { label: 'Quotation', icon: FileSpreadsheet, color: 'text-purple-600', bg: 'bg-purple-50' },
  estimate: { label: 'Estimate', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  certificate: { label: 'Certificate', icon: Award, color: 'text-pink-600', bg: 'bg-pink-50' },
  'offer-letter': { label: 'Offer Letter', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'appointment-letter': { label: 'Appointment Letter', icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  'id-card': { label: 'ID Card', icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
  'event-pass': { label: 'Event Pass', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
};

export function History() {
  const { user, isPro, isAuthenticated, deletePDFFromHistory } = useAuth();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'updated'>('newest');
  const [query, setQuery] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="mb-4">Login Required</h1>
        <p className="text-gray-600 mb-8">Please login to access your PDF history</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="mb-4">Pro Feature</h1>
        <p className="text-gray-600 mb-8">
          PDF History is a Pro-only feature. Upgrade to save, edit, and reuse your PDFs across all document types.
        </p>
        <Button onClick={() => navigate('/pricing')}>
          <Crown className="mr-2 h-4 w-4" />
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  const history = user?.pdfHistory || [];

  const { filtered, totalsByType } = useMemo(() => {
    const totals: Record<string, number> = {};
    history.forEach((h) => {
      totals[h.type] = (totals[h.type] || 0) + 1;
    });

    const q = query.trim().toLowerCase();
    const matchQuery = (h: any) => {
      if (!q) return true;
      const hay = [
        h.title,
        h.type,
        String(h.templateId),
        h.data?.invoiceNumber,
        h.data?.billNumber,
        h.data?.receiptNumber,
        h.data?.quotationNumber,
        h.data?.estimateNumber,
        h.data?.companyName,
        h.data?.clientName,
        h.data?.recipientName,
        h.data?.passHolder,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    };

    let list = history
      .filter((h) => (typeFilter === 'all' ? true : h.type === typeFilter))
      .filter(matchQuery);

    list = list.sort((a, b) => {
      if (sort === 'oldest') return +new Date(a.createdAt) - +new Date(b.createdAt);
      if (sort === 'updated') return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      // newest
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

    return { filtered: list, totalsByType: totals };
  }, [history, typeFilter, sort, query]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const onDelete = (id: string) => {
    if (confirm('Delete this item from history?')) deletePDFFromHistory(id);
  };

  const onClearAll = () => {
    if (history.length === 0) return;
    if (!confirm(`Clear all history items (${history.length})? This cannot be undone.`)) return;
    history.forEach((h) => deletePDFFromHistory(h.id));
  };

  const onEdit = (item: any) => {
    navigate(`/${item.type}?edit=${item.id}`);
  };

  const onDuplicate = (item: any) => {
    navigate(`/${item.type}?duplicate=${item.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDF History</h1>
                <p className="text-sm text-gray-500">
                  Saved documents are stored on this device (browser storage) for fast re-use.
                </p>
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Crown className="h-3 w-3" /> PRO
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/')} className="text-xs">
              Create New <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
            <Button variant="outline" onClick={onClearAll} className="text-xs text-red-600 hover:text-red-700">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear all
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[{
            label: 'Total saved',
            value: history.length,
            icon: Layers,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          }, {
            label: 'Invoices',
            value: totalsByType.invoice || 0,
            icon: FileText,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
          }, {
            label: 'Certificates',
            value: totalsByType.certificate || 0,
            icon: Award,
            color: 'text-pink-600',
            bg: 'bg-pink-50',
          }, {
            label: 'Quotations',
            value: totalsByType.quotation || 0,
            icon: FileSpreadsheet,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          }].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className={`${s.bg} ${s.color} p-2.5 rounded-xl w-fit mb-2`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by invoice number, company, recipient, template…"
              className="pl-9"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All document types</SelectItem>
              {Object.keys(TYPE_META).map((k) => (
                <SelectItem key={k} value={k}>{TYPE_META[k].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="updated">Recently updated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Showing <b className="text-gray-900">{filtered.length}</b> of {history.length} items</span>
          <button
            onClick={() => { setQuery(''); setTypeFilter('all'); setSort('newest'); }}
            className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved PDFs yet</h3>
          <p className="text-gray-600 mb-6">
            Generate a document and download it — PDFDecor will automatically save it to history (Pro).
          </p>
          <Button onClick={() => navigate('/')}>
            Create your first PDF <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const meta = TYPE_META[item.type] || TYPE_META.invoice;
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`${meta.bg} ${meta.color} p-3 rounded-xl flex-shrink-0`}> 
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900 truncate">
                          {item.title || `${meta.label} — Template ${item.templateId}`}
                        </h3>
                        <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          {meta.label}
                        </span>
                        <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          Template {item.templateId}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Created: <b className="text-gray-700">{formatDate(item.createdAt)}</b></span>
                        {item.updatedAt && item.updatedAt !== item.createdAt && (
                          <span>Updated: <b className="text-gray-700">{formatDate(item.updatedAt)}</b></span>
                        )}
                        {item.data?.total !== undefined && (
                          <span className="text-blue-700 font-semibold">Total: ₹{Number(item.data.total).toFixed(2)}</span>
                        )}
                      </div>

                      {/* Secondary details */}
                      <div className="mt-2 text-sm text-gray-700 space-y-0.5">
                        {item.data?.invoiceNumber && <div className="text-xs">Invoice #: <b>{item.data.invoiceNumber}</b></div>}
                        {item.data?.companyName && <div className="text-xs">From: <b>{item.data.companyName}</b></div>}
                        {item.data?.recipientName && <div className="text-xs">Recipient: <b>{item.data.recipientName}</b></div>}
                        {item.data?.passHolder && <div className="text-xs">Pass holder: <b>{item.data.passHolder}</b></div>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button onClick={() => onEdit(item)} variant="outline" size="sm" className="text-xs">
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button onClick={() => onDuplicate(item)} variant="outline" size="sm" className="text-xs">
                      <Copy className="h-3.5 w-3.5 mr-1" /> Duplicate
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="px-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(item)}>
                          <Copy className="h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => onDelete(item.id)}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-600" /> Pro History Tips
        </h3>
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>• Use Search to find invoices by number, company name, or recipient.</li>
          <li>• Edit regenerates the PDF using the latest template engine (quality improvements apply automatically).</li>
          <li>• Duplicate is best for recurring clients—change only date/amount and download again.</li>
        </ul>
      </div>
    </div>
  );
}
