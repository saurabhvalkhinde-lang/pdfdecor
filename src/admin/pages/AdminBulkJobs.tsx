import { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

const BULK_KEY = 'pdfdecor_bulk_jobs';

interface BulkJob {
  id: string;
  userEmail: string;
  type: 'certificate' | 'event-pass';
  totalRecords: number;
  generated: number;
  status: 'queued' | 'running' | 'done' | 'error';
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

export function AdminBulkJobs() {
  const [jobs, setJobs] = useState<BulkJob[]>([]);

  function load() {
    try { setJobs(JSON.parse(localStorage.getItem(BULK_KEY) || '[]').sort((a: BulkJob, b: BulkJob) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); }
    catch { setJobs([]); }
  }
  useEffect(() => { load(); }, []);

  function handleDelete(id: string) {
    if (!confirm('Delete this bulk job record?')) return;
    const updated = jobs.filter(j => j.id !== id);
    localStorage.setItem(BULK_KEY, JSON.stringify(updated));
    setJobs(updated);
  }

  function statusBadge(s: string) {
    const map: Record<string, string> = {
      queued: 'bg-yellow-100 text-yellow-700',
      running: 'bg-blue-100 text-blue-700',
      done: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-600',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Jobs</h1>
        <p className="text-gray-500 text-sm">{jobs.length} jobs recorded</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Progress</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Created</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.length === 0
                ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No bulk jobs found. Jobs appear here when users generate bulk certificates/passes.</td></tr>
                : jobs.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 text-xs">{j.userEmail}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">{j.type}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-24">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${j.totalRecords > 0 ? (j.generated / j.totalRecords) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{j.generated}/{j.totalRecords}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{statusBadge(j.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(j.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Download ZIP (Pro feature)">
                          <Download className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(j.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
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
