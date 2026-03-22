import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Crown, UserX, UserCheck, Trash2, Mail, Calendar, Smartphone } from 'lucide-react';
import { getUserById, updateUserInRegistry } from '../utils/users';
import { addLog } from '../utils/auditLog';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import type { AppUser } from '../types/admin';

export function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { session } = useAdminAuth();
  const [user, setUser] = useState<AppUser | null>(null);

  function load() { setUser(getUserById(decodeURIComponent(userId || ''))); }
  useEffect(() => { load(); }, [userId]);

  function log(action: string) {
    if (session && user) addLog(session.adminId, session.email, action, 'user', user.email);
  }

  function handleSuspend() {
    if (!user) return;
    const ns = user.status === 'active' ? 'suspended' : 'active';
    updateUserInRegistry(user.email, { status: ns });
    log(`User ${ns}`);
    load();
  }

  function handleUpgrade() {
    if (!user) return;
    const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1);
    updateUserInRegistry(user.email, { plan: 'pro', subscriptionExpiry: exp.toISOString() });
    log('User upgraded to Pro');
    load();
  }

  function handleDelete() {
    if (!user || !confirm(`Delete ${user.email}?`)) return;
    const reg = JSON.parse(localStorage.getItem('pdfdecor_users_registry') || '{}');
    delete reg[user.email];
    localStorage.setItem('pdfdecor_users_registry', JSON.stringify(reg));
    log('User deleted');
    navigate('/admin/users');
  }

  if (!user) return (
    <div className="text-center py-20 text-gray-400">
      User not found. <Link to="/admin/users" className="text-blue-600 underline">Back to Users</Link>
    </div>
  );

  const pdfTypes = user.analytics?.pdfTypeCounts || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/users" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name || user.email}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {user.plan !== 'pro' && (
            <button onClick={handleUpgrade} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700">
              <Crown className="h-4 w-4" /> Upgrade
            </button>
          )}
          <button onClick={handleSuspend} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-semibold rounded-xl hover:bg-orange-200">
            {user.status === 'active' ? <><UserX className="h-4 w-4" />Suspend</> : <><UserCheck className="h-4 w-4" />Activate</>}
          </button>
          <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-200">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Profile</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Email', user.email, Mail],
              ['Plan', user.plan, Crown],
              ['Status', user.status, UserCheck],
              ['Created', user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—', Calendar],
              ['Last Login', user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '—', Calendar],
              ['Last IP', user.lastLoginIp || '—', Smartphone],
              ['Subscription Expiry', user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : '—', Calendar],
              ['PDFs Generated', user.analytics?.totalGenerated || 0, null],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                <p className="font-semibold text-gray-800 capitalize">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">PDF Usage</h3>
          {Object.keys(pdfTypes).length === 0
            ? <p className="text-gray-400 text-sm">No PDF data</p>
            : (
              <div className="space-y-2">
                {Object.entries(pdfTypes).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{type}</span>
                    <span className="font-bold text-gray-800">{count as number}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* PDF History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">PDF History ({(user.pdfHistory || []).length})</h3>
        {!user.pdfHistory?.length
          ? <p className="text-gray-400 text-sm">No saved history</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left border-b">
                  <th className="pb-2 font-semibold text-gray-600">Type</th>
                  <th className="pb-2 font-semibold text-gray-600">Title</th>
                  <th className="pb-2 font-semibold text-gray-600">Date</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {user.pdfHistory.slice(0, 20).map((h: any) => (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="py-2 capitalize text-gray-600">{h.documentType}</td>
                      <td className="py-2 text-gray-800">{h.title || '—'}</td>
                      <td className="py-2 text-gray-500 text-xs">{new Date(h.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}
