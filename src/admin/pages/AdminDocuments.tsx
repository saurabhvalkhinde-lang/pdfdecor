import { useEffect, useState } from 'react';
import { Search, Eye, Trash2 } from 'lucide-react';
import { getAllUsers } from '../utils/users';
import { addLog } from '../utils/auditLog';
import { useAdminAuth } from '../contexts/AdminAuthContext';

interface DocRow {
  userId: string;
  userEmail: string;
  id: string;
  documentType: string;
  templateId?: string;
  title?: string;
  createdAt: string;
}

export function AdminDocuments() {
  const { session } = useAdminAuth();
  const [docs, setDocs]   = useState<DocRow[]>([]);
  const [query, setQuery] = useState('');
  const [typeF, setTypeF] = useState('all');

  function load() {
    const users = getAllUsers();
    const rows: DocRow[] = [];
    users.forEach(u => {
      (u.pdfHistory || []).forEach((h: any) => {
        rows.push({
          userId: u.id,
          userEmail: u.email,
          id: h.id,
          documentType: h.documentType || '—',
          templateId: h.templateId,
          title: h.title || '—',
          createdAt: h.createdAt || '',
        });
      });
    });
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setDocs(rows);
  }
  useEffect(() => { load(); }, []);

  const docTypes = Array.from(new Set(docs.map(d => d.documentType)));

  function handleDelete(row: DocRow) {
    if (!confirm('Delete this document from user history?')) return;
    const reg = JSON.parse(localStorage.getItem('pdfdecor_users_registry') || '{}');
    if (reg[row.userEmail]) {
      reg[row.userEmail].pdfHistory = (reg[row.userEmail].pdfHistory || []).filter((h: any) => h.id !== row.id);
      localStorage.setItem('pdfdecor_users_registry', JSON.stringify(reg));
    }
    if (session) addLog(session.adminId, session.email, 'Document deleted', 'document', row.id, `user: ${row.userEmail}`);
    load();
  }

  const filtered = docs.filter(d =>
    (typeF === 'all' || d.documentType === typeF) &&
    (!query || d.userEmail.includes(query) || (d.title || '').toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 text-sm">{filtered.length} of {docs.length} documents</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search user or title…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={typeF} onChange={e => setTypeF(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">All Types</option>
          {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Template</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0
                ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No documents found</td></tr>
                : filtered.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 text-xs">{d.userEmail}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize">{d.documentType}</span></td>
                    <td className="px-4 py-3 text-gray-800">{d.title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.templateId || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View (coming soon)"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(d)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
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
