import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import {
  FileText, Award, Receipt, FileSpreadsheet, Home, Sparkles, Crown,
  LogIn, LogOut, User, ChevronDown, Menu, X, BarChart2, Globe,
  FileCheck, Briefcase, CreditCard, Ticket, Users, HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { AdBanner } from './AdBanner';
import { HelpWidget } from './HelpWidget';

const DOC_TYPES = [
  { path: '/invoice', icon: FileText, label: 'Invoice', color: 'text-blue-600' },
  { path: '/bill', icon: Receipt, label: 'Bill', color: 'text-orange-600' },
  { path: '/receipt', icon: FileCheck, label: 'Receipt', color: 'text-green-600' },
  { path: '/quotation', icon: FileSpreadsheet, label: 'Quotation', color: 'text-purple-600' },
  { path: '/estimate', icon: FileText, label: 'Estimate', color: 'text-yellow-600' },
  { path: '/certificate', icon: Award, label: 'Certificate', color: 'text-pink-600' },
  { path: '/offer-letter', icon: Briefcase, label: 'Offer Letter', color: 'text-indigo-600' },
  { path: '/appointment-letter', icon: Users, label: 'Appointment Letter', color: 'text-cyan-600' },
  { path: '/id-card', icon: CreditCard, label: 'ID Card', color: 'text-red-600' },
  { path: '/event-pass', icon: Ticket, label: 'Event Pass', color: 'text-teal-600' },
];

export function Layout() {
  const location = useLocation();
  const { isAuthenticated, isPro, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Sparkles className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PDFDecor</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all text-sm font-medium ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Home className="h-4 w-4" /> {t.home}
              </Link>

              {/* Documents Dropdown */}
              <div className="relative" onMouseEnter={() => setDocsOpen(true)} onMouseLeave={() => setDocsOpen(false)}>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all text-sm font-medium text-gray-600 hover:bg-gray-100">
                  <FileText className="h-4 w-4" />
                  Documents
                  <ChevronDown className="h-3 w-3" />
                </button>
                {docsOpen && (
                  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-72 z-50">
                    <div className="grid grid-cols-2 gap-1 mb-1">
                    {DOC_TYPES.map(d => (
                      <Link key={d.path} to={d.path}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors ${location.pathname === d.path ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                      >
                        <d.icon className={`h-3.5 w-3.5 ${d.color}`} />
                        {d.label}
                      </Link>
                    ))}
                    </div>
                    {isPro && (
                      <div className="border-t border-gray-100 pt-1 mt-1">
                        <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wide px-2 py-1">Pro Bulk Tools</p>
                        <Link to="/bulk-certificate" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-amber-50 text-gray-700 font-medium">
                          🎓 Bulk Certificates
                        </Link>
                        <Link to="/bulk-event-pass" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-amber-50 text-gray-700 font-medium">
                          🎫 Bulk Event Passes
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-2">
              {/* Help link */}
              <Link to="/help" className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                <HelpCircle className="h-3.5 w-3.5" /> Help
              </Link>

              {/* Language Switcher */}
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">🇬🇧 EN</option>
                <option value="hi">🇮🇳 HI</option>
                <option value="mr">🇮🇳 MR</option>
              </select>

              {!isPro && (
                <Link to="/pricing">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs">
                    <Crown className="mr-1 h-3.5 w-3.5" /> {t.upgradeToPro}
                  </Button>
                </Link>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {isPro && (
                    <>
                      <Link to="/history"><Button variant="outline" size="sm" className="text-xs">{t.history}</Button></Link>
                      <Link to="/profile"><Button variant="outline" size="sm" className="text-xs">{t.profile}</Button></Link>
                      <Link to="/analytics"><Button variant="outline" size="sm" className="text-xs"><BarChart2 className="h-3.5 w-3.5" /></Button></Link>
                      <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-2.5 py-1.5 rounded-lg font-bold text-xs">
                        <Crown className="h-3 w-3" /> PRO
                      </span>
                    </>
                  )}
                  <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> {user?.email?.split('@')[0]}
                  </span>
                  <Button onClick={logout} variant="outline" size="sm" className="text-xs">
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-xs">
                    <LogIn className="mr-1 h-3.5 w-3.5" /> {t.login}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
              <Home className="h-4 w-4" /> {t.home}
            </Link>
            <div className="grid grid-cols-2 gap-1 pt-1">
              {DOC_TYPES.map(d => (
                <Link key={d.path} to={d.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${location.pathname === d.path ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                  <d.icon className={`h-3.5 w-3.5 ${d.color}`} />
                  {d.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <select value={language} onChange={e => setLanguage(e.target.value as any)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                <option value="en">🇬🇧 EN</option>
                <option value="hi">🇮🇳 HI</option>
                <option value="mr">🇮🇳 MR</option>
              </select>
              {!isPro && <Link to="/pricing" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="text-xs bg-gradient-to-r from-blue-600 to-purple-600">
                  <Crown className="mr-1 h-3 w-3" /> Upgrade
                </Button>
              </Link>}
              {isAuthenticated ? (
                <>
                  {isPro && <>
                    <Link to="/history" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="text-xs">History</Button></Link>
                    <Link to="/profile" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="text-xs">Profile</Button></Link>
                  </>}
                  <Button onClick={() => { logout(); setMobileOpen(false); }} variant="outline" size="sm" className="text-xs">Logout</Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="text-xs">Login</Button></Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-gray-900">PDFDecor</span>
              </div>
              <p className="text-xs text-gray-500">Professional PDF generation for Indian businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Documents</h4>
              <div className="space-y-1">
                {DOC_TYPES.slice(0, 5).map(d => (
                  <Link key={d.path} to={d.path} className="block text-xs text-gray-500 hover:text-blue-600">{d.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">More Documents</h4>
              <div className="space-y-1">
                {DOC_TYPES.slice(5).map(d => (
                  <Link key={d.path} to={d.path} className="block text-xs text-gray-500 hover:text-blue-600">{d.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Platform</h4>
              <div className="space-y-1">
                <Link to="/pricing" className="block text-xs text-gray-500 hover:text-blue-600">Pricing</Link>
                <Link to="/help" className="block text-xs text-gray-500 hover:text-blue-600">Help Center</Link>
                <Link to="/about" className="block text-xs text-gray-500 hover:text-blue-600">About</Link>
                <Link to="/privacy" className="block text-xs text-gray-500 hover:text-blue-600">Privacy Policy</Link>
                <Link to="/terms" className="block text-xs text-gray-500 hover:text-blue-600">Terms</Link>
                <Link to="/login" className="block text-xs text-gray-500 hover:text-blue-600">Login / Sign Up</Link>
                {isPro && <Link to="/analytics" className="block text-xs text-gray-500 hover:text-blue-600">Analytics</Link>}
                {isPro && <Link to="/bulk-certificate" className="block text-xs text-gray-500 hover:text-teal-600">🎓 Bulk Certificates</Link>}
                {isPro && <Link to="/bulk-event-pass" className="block text-xs text-gray-500 hover:text-teal-600">🎫 Bulk Event Passes</Link>}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} PDFDecor — India's #1 Free PDF Generator for Businesses
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Help Widget — always visible */}
      <HelpWidget />
    </div>
  );
}
