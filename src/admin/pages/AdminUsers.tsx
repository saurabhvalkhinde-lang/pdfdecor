import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search, Crown, UserX, UserCheck, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { getAllUsers, updateUserInRegistry } from '../utils/users';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { addLog } from '../utils/auditLog';
import type { AppUser } from '../types/admin';

export function AdminUsers() {
  const { session } = useAdminAuth();
  const [users, setUsers]   = useState<AppUser[]>([]);
  const [query, setQuery]   = useState('');
  const [planF, setPlanF]   = useState<'all'|'free'|'pro'>('all');
  const [statusF, setStatF] = useState<'all'|'active'|'suspended'>('all');
  const [sort, setSort]     = useState<{ col: string; dir: 'asc'|'desc' }>({ col: 'createdAt', dir: 'desc' });

  function load() { setUsers(getAllUsers()); }
  useEffect(() => { load(); }, []);

  function log(action: string, target: string) {
    if (session) addLog(session.adminId, session.email, action, 'user', target);
  }

  function handleSuspend(u: AppUser) {
    const ns = u.status === 'active' ? 'suspended' : 'active';
    updateUserInRegistry(u.email, { status: ns });
    log(`User ${ns}`, u.email);
    load();
  }

  function handleUpgrade(u: AppUser) {
    const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1);
    updateUserInRegistry(u.email, { plan: 'pro', subscriptionExpiry: exp.toISOString() });
    log('User upgraded to Pro', u.email);
    load();
  }

  function handleDelete(u: AppUser) {
    if (!confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    try {
      const reg = JSON.parse(localStorage.getItem('pdfdecor_users_registry') || '{}');
      delete reg[u.email];
      localStorage.setItem('pdfdecor_users_registry', JSON.stringify(reg));
      log('User deleted', u.email);
      load();
    } catch {}
  }

  function toggleSort(col: string) {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' });
  }

  const filtered = users
    .filter(u =>
      (planF === 'all' || u.plan === planF) &&
      (statusF === 'all' || u.status === statusF) &&
      (!query || u.email.includes(query.toLowerCase()) || (u.name || '').toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => {
      const mul = sort.dir === 'asc' ? 1 : -1;
      const va = (a as any)[sort.col] || '';
      const vb = (b as any)[sort.col] || '';
      return mul * String(va).localeCompare(String(vb));
    });

  const SortIcon = ({ col }: { col: string }) =>
    sort.col === col
      ? sort.dir === 'asc' ? <ChevronUp className="h-3.5 w-3.5 inline ml-1" /> : <ChevronDown className="h-3.5 w-3.5 inline ml-1" />
      : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">{filtered.length} of {users.length} users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search email or name…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={planF} onChange={e => setPlanF(e.target.value as any)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
        <select value={statusF} onChange={e => setStatF(e.target.value as any)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[['name','Name'],['email','Email'],['plan','Plan'],['analytics.totalGenerated','PDFs'],['lastLoginAt','Last Login'],['status','Status']].map(([col, label]) => (
                  <th key={col} onClick={() => toggleSort(col)}
                    className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-gray-900 whitespace-nowrap">
                    {label}<SortIcon col={col} />
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0
                ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No users found</td></tr>
                : filtered.map(u => (
                  <tr key={u.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${u.plan === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.plan === 'pro' && <Crown className="h-3 w-3" />} {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.analytics?.totalGenerated || 0}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/users/${encodeURIComponent(u.email)}`}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </Link>
                        {u.plan !== 'pro' && (
                          <button onClick={() => handleUpgrade(u)}
                            className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors" title="Upgrade to Pro">
                            <Crown className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleSuspend(u)}
                          className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors"
                          title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                          {u.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button onClick={() => handleDelete(u)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
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
