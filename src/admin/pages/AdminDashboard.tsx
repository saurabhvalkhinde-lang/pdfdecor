import { useEffect, useState } from 'react';
import { Users, Crown, FileText, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { getAllUsers } from '../utils/users';
import { getAllLogs } from '../utils/auditLog';

export function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    setUsers(getAllUsers());
    setLogs(getAllLogs().slice(0, 10));
  }, []);

  const totalUsers    = users.length;
  const proUsers      = users.filter(u => u.plan === 'pro').length;
  const activeUsers   = users.filter(u => u.status === 'active').length;
  const totalPDFs     = users.reduce((s, u) => s + (u.analytics?.totalGenerated || 0), 0);
  const monthlyRev    = proUsers * 249;

  // PDF type distribution
  const docTypes: Record<string, number> = {};
  users.forEach(u => {
    const counts = u.analytics?.pdfTypeCounts || {};
    Object.entries(counts).forEach(([k, v]) => {
      docTypes[k] = (docTypes[k] || 0) + (v as number);
    });
  });
  const topTypes = Object.entries(docTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Platform overview and key metrics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Users"    value={totalUsers}   change={12} icon={<Users className="h-5 w-5" />}      color="blue" />
        <StatsCard title="Active Users"   value={activeUsers}  change={8}  icon={<Activity className="h-5 w-5" />}   color="green" />
        <StatsCard title="Pro Subscribers" value={proUsers}    change={15} icon={<Crown className="h-5 w-5" />}      color="purple" />
        <StatsCard title="PDFs Generated" value={totalPDFs}    change={22} icon={<FileText className="h-5 w-5" />}   color="orange" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard title="Monthly Revenue (Est.)" value={`₹${monthlyRev.toLocaleString()}`} change={18} icon={<DollarSign className="h-5 w-5" />} color="indigo" />
        <StatsCard title="Yearly Revenue (Est.)"  value={`₹${(proUsers * 2390).toLocaleString()}`} change={18} icon={<TrendingUp className="h-5 w-5" />} color="green" />
      </div>

      {/* Top PDF Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Top PDF Types</h3>
          {topTypes.length === 0
            ? <p className="text-gray-400 text-sm">No PDF data yet</p>
            : (
              <div className="space-y-3">
                {topTypes.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-36 capitalize">{type}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (count / (topTypes[0]?.[1] || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-10 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Recent Admin Activity</h3>
          {logs.length === 0
            ? <p className="text-gray-400 text-sm">No activity logged yet</p>
            : (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{log.action}</p>
                      <p className="text-xs text-gray-400">{log.adminEmail} · {new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* User Plan Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">User Plan Distribution</h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-black text-gray-600">{totalUsers - proUsers}</div>
            <div className="text-xs text-gray-400 mt-0.5">Free</div>
          </div>
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              style={{ width: totalUsers > 0 ? `${(proUsers / totalUsers) * 100}%` : '0%' }}
            />
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-purple-600">{proUsers}</div>
            <div className="text-xs text-gray-400 mt-0.5">Pro</div>
          </div>
        </div>
        {totalUsers > 0 && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            {((proUsers / totalUsers) * 100).toFixed(1)}% conversion rate
          </p>
        )}
      </div>
    </div>
  );
}
