import { useEffect, useState } from 'react';
import { getAllLogs, clearLogs } from '../utils/auditLog';
import { Search, Trash2 } from 'lucide-react';
import type { AdminLog } from '../types/admin';

export function AdminActivity() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [query, setQuery] = useState('');

  function load() { setLogs(getAllLogs()); }
  useEffect(() => { load(); }, []);

  function handleClear() {
    if (!confirm('Clear ALL activity logs? This cannot be undone.')) return;
    clearLogs();
    setLogs([]);
  }

  const filtered = logs.filter(l =>
    !query ||
    l.action.toLowerCase().includes(query.toLowerCase()) ||
    l.adminEmail.toLowerCase().includes(query.toLowerCase()) ||
    (l.targetId || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-500 text-sm">{filtered.length} of {logs.length} entries</p>
        </div>
        {logs.length > 0 && (
          <button onClick={handleClear}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100">
            <Trash2 className="h-4 w-4" /> Clear All
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search actions, admin, target…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Timestamp</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Admin</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Target</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0
                ? <tr><td colSpan={5} className="text-center py-10 text-gray-400">No activity logged yet</td></tr>
                : filtered.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{l.adminEmail}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{l.action}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {l.targetType && <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 mr-1">{l.targetType}</span>}
                      {l.targetId}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{l.details || '—'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
