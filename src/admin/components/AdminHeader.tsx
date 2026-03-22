import { useState } from 'react';
import { Menu, Bell, ChevronDown, User, LogOut, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { session, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        View Site
      </a>

      <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
        <Bell className="h-5 w-5" />
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 rounded-xl hover:bg-gray-100 px-2 py-1.5 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {session?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{session?.name || 'Admin'}</p>
            <p className="text-[11px] text-gray-400 leading-tight capitalize">{session?.role}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{session?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.email}</p>
            </div>
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
