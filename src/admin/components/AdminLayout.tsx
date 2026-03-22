import { useState } from 'react';
import { Outlet } from 'react-router';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Menu, X } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { NavLink } from 'react-router';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/documents', label: 'Documents' },
  { to: '/admin/templates', label: 'Templates' },
  { to: '/admin/subscriptions', label: 'Subscriptions' },
  { to: '/admin/bulk-jobs', label: 'Bulk Jobs' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/activity', label: 'Activity Logs' },
  { to: '/admin/ads', label: 'Ads' },
  { to: '/admin/settings', label: 'Settings' },
];

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 flex flex-col w-64 bg-slate-950 text-slate-200 min-h-screen">
            <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
              <span className="font-extrabold text-white">PDFDecor Admin</span>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ` +
                    (isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-slate-800">
              <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white">
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
