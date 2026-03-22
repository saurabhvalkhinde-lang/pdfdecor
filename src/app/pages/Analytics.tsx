/**
 * Analytics.tsx — Pro Analytics Dashboard v2
 * Full analytics with visual bar charts, document type breakdown,
 * template usage, activity timeline, and business insights.
 */
import { useState } from 'react';
import {
  BarChart2, TrendingUp, FileText, Crown, Download, Star,
  Award, Receipt, FileSpreadsheet, Briefcase, Users, CreditCard,
  Ticket, FileCheck, Clock, Zap, PieChart, Calendar,
  ChevronUp, ChevronDown, Info,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';

const DOC_TYPE_META: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  invoice: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Invoice' },
  bill: { icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Bill' },
  receipt: { icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50', label: 'Receipt' },
  quotation: { icon: FileSpreadsheet, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Quotation' },
  estimate: { icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Estimate' },
  certificate: { icon: Award, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Certificate' },
  'offer-letter': { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Offer Letter' },
  'appointment-letter': { icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Appt. Letter' },
  'id-card': { icon: CreditCard, color: 'text-red-600', bg: 'bg-red-50', label: 'ID Card' },
  'event-pass': { icon: Ticket, color: 'text-teal-600', bg: 'bg-teal-50', label: 'Event Pass' },
  'bulk-certificate': { icon: Award, color: 'text-rose-600', bg: 'bg-rose-50', label: 'Bulk Cert.' },
  'bulk-event-pass': { icon: Ticket, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Bulk Pass' },
};

// Simple inline bar chart
function BarChartInline({ data, maxVal }: { data: Array<{ label: string; value: number; color: string }>; maxVal: number }) {
  return (
    <div className="space-y-2.5">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 font-medium">{d.label}</span>
            <span className="text-xs font-bold text-gray-900">{d.value}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: maxVal > 0 ? `${Math.max(2, (d.value / maxVal) * 100)}%` : '2%',
                background: d.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Donut chart SVG
function DonutChart({ data }: { data: Array<{ value: number; color: string; label: string }> }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-center text-gray-400 text-sm py-4">No data yet</div>;

  const size = 120;
  const strokeWidth = 20;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const dashLen = (d.value / total) * circumference;
          const dashOffset = circumference - offset;
          offset += dashLen;
          return (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          );
        })}
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="18" fontWeight="bold" fill="#1f2937">
          {total}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1 text-xs text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Analytics() {
  const { analytics, isPro, user } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');

  // Gate: Pro only
  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-3xl p-12">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Analytics Dashboard</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Track PDF generation stats, template usage, most-used document types, and business activity — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-3 text-left max-w-xs mx-auto mb-8">
            {[
              'Total PDFs generated', 'Document type breakdown',
              'Template usage stats', 'Daily/weekly activity',
              'Top document types', 'Business insights',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <BarChart2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" /> {f}
              </div>
            ))}
          </div>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Crown className="h-5 w-5" /> Upgrade to Pro — ₹249/month
          </Link>
        </div>
      </div>
    );
  }

  const {
    pdfTypeCounts = {}, templateCounts = {},
    totalGenerated = 0, upgradeClicks = 0, lastActivity = '',
  } = analytics || {};

  const docTypeLabels: Record<string, string> = {
    invoice: 'Invoice', bill: 'Bill', receipt: 'Receipt', quotation: 'Quotation',
    estimate: 'Estimate', certificate: 'Certificate', 'offer-letter': 'Offer Letter',
    'appointment-letter': 'Appointment Letter', 'id-card': 'ID Card', 'event-pass': 'Event Pass',
    'bulk-certificate': 'Bulk Certificate', 'bulk-event-pass': 'Bulk Event Pass',
  };

  const sortedTypes = Object.entries(pdfTypeCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number));

  const topType = sortedTypes[0]?.[0] || 'invoice';
  const topTypeCount = (sortedTypes[0]?.[1] as number) || 0;
  const topTypeMeta = DOC_TYPE_META[topType];

  const sortedTemplates = Object.entries(templateCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number));

  const maxDocCount = sortedTypes[0]?.[1] as number || 1;
  const maxTplCount = sortedTemplates[0]?.[1] as number || 1;

  // Colors for donut
  const COLORS = ['#3b82f6','#8b5cf6','#ec4899','#10b981','#f59e0b','#6366f1','#14b8a6','#ef4444','#f97316','#06b6d4'];

  const donutData = sortedTypes.slice(0, 6).map(([k, v], i) => ({
    value: v as number,
    color: COLORS[i % COLORS.length],
    label: docTypeLabels[k] || k,
  }));

  const barDataDocs = sortedTypes.slice(0, 8).map(([k, v], i) => ({
    label: docTypeLabels[k] || k,
    value: v as number,
    color: COLORS[i % COLORS.length],
  }));

  const barDataTpl = sortedTemplates.slice(0, 8).map(([k, v], i) => ({
    label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: v as number,
    color: COLORS[(i + 3) % COLORS.length],
  }));

  // Business profile completeness
  const bp = user?.businessProfile || {};
  const bpFields = ['companyName','companyAddress','companyPhone','companyEmail','companyGST','upiId','logo'];
  const bpFilled = bpFields.filter(f => (bp as any)[f]).length;
  const bpPercent = Math.round((bpFilled / bpFields.length) * 100);

  const formatDate = (iso: string) => {
    if (!iso) return 'Never';
    try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return iso; }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
            <BarChart2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Last activity: {formatDate(lastActivity)}
            </p>
          </div>
          <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Crown className="h-3 w-3" /> PRO
          </span>
        </div>
        <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
          {(['week', 'month', 'all'] as const).map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                timeRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r === 'all' ? 'All Time' : `This ${r.charAt(0).toUpperCase() + r.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: FileText, label: 'Total PDFs Generated', value: totalGenerated,
            color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
            trend: totalGenerated > 0 ? '+' + totalGenerated : '0',
            sub: 'All time',
          },
          {
            icon: topTypeMeta?.icon || Star, label: 'Top Document Type',
            value: docTypeLabels[topType] || '—',
            color: topTypeMeta?.color || 'text-purple-600',
            bg: topTypeMeta?.bg || 'bg-purple-50', border: 'border-purple-100',
            trend: topTypeCount + ' PDFs',
            sub: 'Most generated',
          },
          {
            icon: TrendingUp, label: 'Unique Types Used',
            value: Object.keys(pdfTypeCounts).length,
            color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100',
            trend: `of 12 types`,
            sub: 'Document variety',
          },
          {
            icon: Zap, label: 'Profile Completeness',
            value: bpPercent + '%',
            color: bpPercent === 100 ? 'text-green-600' : 'text-amber-600',
            bg: bpPercent === 100 ? 'bg-green-50' : 'bg-amber-50',
            border: bpPercent === 100 ? 'border-green-100' : 'border-amber-100',
            trend: bpFilled + '/' + bpFields.length + ' fields',
            sub: 'Business profile',
          },
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border ${stat.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl w-fit mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5 truncate">{stat.value}</p>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className={`font-medium ${stat.color}`}>{stat.trend}</span>
              · {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Document Type Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-blue-600" /> Document Mix
          </h2>
          <p className="text-xs text-gray-400 mb-4">Distribution by type</p>
          {donutData.length > 0 ? (
            <DonutChart data={donutData} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Generate PDFs to see stats</p>
            </div>
          )}
        </div>

        {/* Document Type Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm md:col-span-2">
          <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-purple-600" /> PDFs by Document Type
          </h2>
          <p className="text-xs text-gray-400 mb-4">Total generated per type</p>
          {barDataDocs.length > 0 ? (
            <BarChartInline data={barDataDocs} maxVal={maxDocCount} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No data yet. Start generating PDFs!</p>
              <Link to="/" className="text-blue-600 text-xs mt-1 inline-block hover:underline">
                Go to document generators →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Template Usage + Business Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Template Usage */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" /> Template Usage
          </h2>
          <p className="text-xs text-gray-400 mb-4">Which templates you use most</p>
          {barDataTpl.length > 0 ? (
            <BarChartInline data={barDataTpl} maxVal={maxTplCount} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No template data yet</p>
            </div>
          )}
        </div>

        {/* Business Profile Completeness */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-600" /> Business Profile
          </h2>
          <p className="text-xs text-gray-400 mb-4">Complete your profile for faster document creation</p>

          {/* Progress ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke={bpPercent === 100 ? '#10b981' : '#3b82f6'}
                  strokeWidth="6"
                  strokeDasharray={`${(bpPercent / 100) * 163} 163`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                {bpPercent}%
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {bpPercent === 100 ? '✅ Profile Complete!' : `${bpFilled}/${bpFields.length} fields filled`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {bpPercent < 100 ? 'Complete your profile to enable auto-fill in all documents' : 'Auto-fill active for all document types'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { key: 'companyName', label: 'Company Name', icon: '🏢' },
              { key: 'companyAddress', label: 'Business Address', icon: '📍' },
              { key: 'companyPhone', label: 'Phone Number', icon: '📞' },
              { key: 'companyEmail', label: 'Email Address', icon: '✉️' },
              { key: 'companyGST', label: 'GSTIN', icon: '🧾' },
              { key: 'upiId', label: 'UPI ID', icon: '💳' },
              { key: 'logo', label: 'Business Logo', icon: '🖼️' },
            ].map(({ key, label, icon }) => {
              const filled = !!(bp as any)[key];
              return (
                <div key={key} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${filled ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <span className="flex items-center gap-2">
                    <span>{icon}</span>
                    <span className={filled ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
                  </span>
                  {filled ? (
                    <span className="text-green-500 text-xs font-bold">✓</span>
                  ) : (
                    <Link to="/profile" className="text-xs text-blue-600 hover:underline font-medium">Add</Link>
                  )}
                </div>
              );
            })}
          </div>

          {bpPercent < 100 && (
            <Link
              to="/profile"
              className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Complete Profile →
            </Link>
          )}
        </div>
      </div>

      {/* Document Type Grid */}
      {sortedTypes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" /> All Document Types
          </h2>
          <p className="text-xs text-gray-400 mb-5">Click any type to generate more PDFs</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.keys(docTypeLabels).map(key => {
              const count = (pdfTypeCounts[key] as number) || 0;
              const meta = DOC_TYPE_META[key] || DOC_TYPE_META['invoice'];
              const DocIcon = meta.icon;
              const path = key === 'bulk-certificate' ? '/bulk-certificate' : key === 'bulk-event-pass' ? '/bulk-event-pass' : `/${key}`;
              return (
                <Link
                  key={key}
                  to={path}
                  className="group flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-center"
                >
                  <div className={`${meta.bg} ${meta.color} p-2.5 rounded-xl mb-2 group-hover:scale-110 transition-transform`}>
                    <DocIcon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{meta.label}</span>
                  <span className={`text-lg font-bold mt-0.5 ${count > 0 ? meta.color : 'text-gray-300'}`}>
                    {count > 0 ? count : '—'}
                  </span>
                  <span className="text-[10px] text-gray-400">PDFs</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity Summary */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <h2 className="text-base font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Account Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Subscription', value: 'Pro', icon: Crown },
            { label: 'Plan Since', value: user?.subscriptionExpiry ? formatDate(new Date(new Date(user.subscriptionExpiry).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()) : 'Active', icon: Clock },
            { label: 'Expires', value: user?.subscriptionExpiry ? formatDate(user.subscriptionExpiry) : '—', icon: Calendar },
            { label: 'Total Generated', value: totalGenerated.toString(), icon: Download },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
              <s.icon className="h-5 w-5 mx-auto mb-2 text-white/70" />
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Edit Business Profile
          </Link>
          <Link
            to="/history"
            className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            View PDF History
          </Link>
        </div>
      </div>
    </div>
  );
}
