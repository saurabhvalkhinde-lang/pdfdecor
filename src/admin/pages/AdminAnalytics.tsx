import { useEffect, useState } from 'react';
import { getAllUsers } from '../utils/users';
import { BarChart3, FileText, Users, Crown } from 'lucide-react';

export function AdminAnalytics() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => { setUsers(getAllUsers()); }, []);

  const totalPDFs = users.reduce((s, u) => s + (u.analytics?.totalGenerated || 0), 0);
  const proUsers  = users.filter(u => u.plan === 'pro').length;

  const docTypes: Record<string, number> = {};
  users.forEach(u => {
    const counts = u.analytics?.pdfTypeCounts || {};
    Object.entries(counts).forEach(([k, v]) => { docTypes[k] = (docTypes[k] || 0) + (v as number); });
  });
  const sorted = Object.entries(docTypes).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  const topUsers = [...users]
    .sort((a, b) => (b.analytics?.totalGenerated || 0) - (a.analytics?.totalGenerated || 0))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm">Platform usage overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: users.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pro Users', val: proUsers, icon: Crown, color: 'text-purple-600 bg-purple-50' },
          { label: 'Total PDFs', val: totalPDFs, icon: FileText, color: 'text-orange-600 bg-orange-50' },
          { label: 'Doc Types Active', val: sorted.length, icon: BarChart3, color: 'text-green-600 bg-green-50' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-gray-900">{val}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-5">PDFs by Document Type</h3>
          {sorted.length === 0
            ? <p className="text-gray-400 text-sm">No data yet</p>
            : (
              <div className="space-y-3">
                {sorted.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 capitalize w-36 shrink-0">{type}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-10 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-5">Top 10 Users by PDF Count</h3>
          {topUsers.length === 0
            ? <p className="text-gray-400 text-sm">No data yet</p>
            : (
              <div className="space-y-2">
                {topUsers.map((u, i) => (
                  <div key={u.email} className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-gray-400 w-5">#{i + 1}</span>
                    <span className="flex-1 text-gray-700 truncate">{u.email}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.plan === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{u.plan}</span>
                    <span className="font-bold text-gray-800 w-10 text-right">{u.analytics?.totalGenerated || 0}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
