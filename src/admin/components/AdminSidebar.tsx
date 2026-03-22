import { useState } from 'react';
import { NavLink } from 'react-router';
import {
  LayoutDashboard, Users, FileText, Layers, CreditCard,
  Boxes, BarChart3, Activity, Settings, Megaphone, LogOut,
  ChevronDown, ChevronRight, Sparkles,
  Award, Receipt, FilePlus, AlignLeft, Briefcase, Calendar, PartyPopper,
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const DOC_TYPE_NAV = [
  { key: 'invoice',             label: 'Invoice',             icon: FileText   },
  { key: 'certificate',         label: 'Certificate',         icon: Award      },
  { key: 'id-card',             label: 'ID Card',             icon: CreditCard },
  { key: 'event-pass',          label: 'Event Pass',          icon: PartyPopper},
  { key: 'bill',                label: 'Bill',                icon: Receipt    },
  { key: 'receipt',             label: 'Receipt',             icon: Receipt    },
  { key: 'quotation',           label: 'Quotation',           icon: FilePlus   },
  { key: 'estimate',            label: 'Estimate',            icon: AlignLeft  },
  { key: 'offer-letter',        label: 'Offer Letter',        icon: Briefcase  },
  { key: 'appointment-letter',  label: 'Appt. Letter',        icon: Calendar   },
];

const MAIN_NAV = [
  { to: '/admin/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/admin/users',         label: 'Users',         icon: Users           },
  { to: '/admin/documents',     label: 'Documents',     icon: FileText        },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard      },
  { to: '/admin/bulk-jobs',     label: 'Bulk Jobs',     icon: Boxes           },
  { to: '/admin/analytics',     label: 'Analytics',     icon: BarChart3       },
  { to: '/admin/activity',      label: 'Activity Logs', icon: Activity        },
  { to: '/admin/ads',           label: 'Ads',           icon: Megaphone       },
  { to: '/admin/settings',      label: 'Settings',      icon: Settings        },
];

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: any }) {
  return (
    <NavLink to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  );
}

export function AdminSidebar() {
  const { logout, session } = useAdminAuth();
  const [templatesOpen, setTemplatesOpen] = useState(false);

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-950 text-slate-200 border-r border-slate-800 min-h-screen">

      {/* Brand */}
      <div className="h-16 px-5 flex items-center gap-2 border-b border-slate-800 shrink-0">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-extrabold text-white tracking-tight">PDFDecor</span>
        <span className="ml-0.5 text-blue-400 text-xs font-bold uppercase tracking-widest">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <NavItem to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />
        <NavItem to="/admin/users"     label="Users"     icon={Users}           />
        <NavItem to="/admin/documents" label="Documents" icon={FileText}        />

        {/* ── Templates with expand/collapse ── */}
        <div>
          <div className="flex items-center gap-0.5">
            <NavLink to="/admin/templates" end
              className={({ isActive }) =>
                `flex-1 flex items-center gap-3 px-3 py-2.5 rounded-l-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Layers className="h-4 w-4 shrink-0" />
              Templates
            </NavLink>
            <button
              onClick={() => setTemplatesOpen(o => !o)}
              className="px-2 py-2.5 rounded-r-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
              title="Toggle doc types"
            >
              {templatesOpen
                ? <ChevronDown className="h-3.5 w-3.5" />
                : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>

          {templatesOpen && (
            <div className="ml-3 mt-1 border-l border-slate-800 pl-3 space-y-0.5">
              {DOC_TYPE_NAV.map(dt => {
                const Icon = dt.icon;
                return (
                  <NavLink key={dt.key}
                    to={`/admin/templates?type=${dt.key}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Icon className="h-3 w-3 shrink-0" /> {dt.label}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Remaining nav items */}
        {MAIN_NAV.slice(3).map(item => (
          <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        {session && (
          <div className="px-3 py-2 mb-2 bg-slate-900 rounded-xl">
            <div className="text-xs font-bold text-white truncate">{session.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{session.email}</div>
            <div className="text-[10px] text-blue-400 capitalize font-semibold mt-0.5">{session.role}</div>
          </div>
        )}
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
