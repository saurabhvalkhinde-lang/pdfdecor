import { useEffect, useState } from 'react';
import { Crown, Ban, TrendingUp, Calendar } from 'lucide-react';
import { getAllUsers, updateUserInRegistry } from '../utils/users';
import { addLog } from '../utils/auditLog';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import type { AppUser } from '../types/admin';

export function AdminSubscriptions() {
  const { session } = useAdminAuth();
  const [users, setUsers] = useState<AppUser[]>([]);

  function load() { setUsers(getAllUsers().filter(u => u.plan === 'pro' || u.subscriptionExpiry)); }
  useEffect(() => { load(); }, []);

  function log(action: string, email: string) {
    if (session) addLog(session.adminId, session.email, action, 'subscription', email);
  }

  function handleCancel(u: AppUser) {
    if (!confirm(`Cancel subscription for ${u.email}?`)) return;
    updateUserInRegistry(u.email, { plan: 'free', status: 'active', subscriptionExpiry: undefined });
    log('Subscription cancelled', u.email);
    load();
  }

  function handleExtend(u: AppUser) {
    const current = u.subscriptionExpiry ? new Date(u.subscriptionExpiry) : new Date();
    if (current < new Date()) current.setTime(Date.now());
    current.setFullYear(current.getFullYear() + 1);
    updateUserInRegistry(u.email, { plan: 'pro', subscriptionExpiry: current.toISOString() });
    log('Subscription extended 1 year', u.email);
    load();
  }

  function handleUpgrade(u: AppUser) {
    const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1);
    updateUserInRegistry(u.email, { plan: 'pro', subscriptionExpiry: exp.toISOString() });
    log('Subscription upgraded', u.email);
    load();
  }

  function statusBadge(u: AppUser) {
    if (u.plan !== 'pro') return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">Cancelled</span>;
    if (u.subscriptionExpiry && new Date(u.subscriptionExpiry) < new Date())
      return <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600">Expired</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Active</span>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-500 text-sm">{users.length} subscription records</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Plan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Expires</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0
                ? <tr><td colSpan={5} className="text-center py-10 text-gray-400">No Pro subscriptions yet</td></tr>
                : users.map(u => (
                  <tr key={u.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{u.name || u.email}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold w-fit">
                        <Crown className="h-3 w-3" /> {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(u)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {u.subscriptionExpiry ? new Date(u.subscriptionExpiry).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleExtend(u)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100">
                          <Calendar className="h-3.5 w-3.5" /> Extend
                        </button>
                        {u.plan !== 'pro' && (
                          <button onClick={() => handleUpgrade(u)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100">
                            <TrendingUp className="h-3.5 w-3.5" /> Upgrade
                          </button>
                        )}
                        {u.plan === 'pro' && (
                          <button onClick={() => handleCancel(u)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">
                            <Ban className="h-3.5 w-3.5" /> Cancel
                          </button>
                        )}
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
