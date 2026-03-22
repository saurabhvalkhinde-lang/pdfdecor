import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserPlan = 'free' | 'pro';
export type UserRole = 'user' | 'admin';

export interface BusinessProfile {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyGST?: string;
  upiId?: string;
  logo?: string;
  defaultTaxRate?: number;
  customFooter?: string;
  invoicePrefix?: string;
  bankName?: string;
  bankAccount?: string;
  bankIFSC?: string;
  bankBranch?: string;
  brandColor?: string;
  paymentTerms?: string;
}

export interface PDFHistoryItem {
  id: string;
  type: 'invoice' | 'certificate' | 'quotation' | 'bill' | 'receipt' | 'estimate' | 'offer-letter' | 'appointment-letter' | 'id-card' | 'event-pass';
  templateId: number;
  data: any;
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface AnalyticsData {
  pdfTypeCounts: Record<string, number>;
  templateCounts: Record<string, number>;
  totalGenerated: number;
  upgradeClicks: number;
  lastActivity: string;
}

export interface User {
  email: string;
  plan: UserPlan;
  name?: string;
  role?: UserRole;
  subscriptionExpiry?: string;
  businessProfile?: BusinessProfile;
  pdfHistory?: PDFHistoryItem[];
  analytics?: AnalyticsData;
  invoiceCounter?: number;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPro: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  logout: () => void;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  upgradeToPro: (plan: 'monthly' | 'yearly') => Promise<boolean>;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  savePDFToHistory: (item: Omit<PDFHistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePDFInHistory: (id: string, update: { data?: any; templateId?: number; title?: string }) => void;
  deletePDFFromHistory: (id: string) => void;
  getPDFFromHistory: (id: string) => PDFHistoryItem | undefined;
  trackEvent: (event: 'pdf_generated' | 'upgrade_click' | 'template_selected', meta?: Record<string, string>) => void;
  getNextInvoiceNumber: () => string;
  analytics: AnalyticsData | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAnalytics: AnalyticsData = {
  pdfTypeCounts: {},
  templateCounts: {},
  totalGenerated: 0,
  upgradeClicks: 0,
  lastActivity: new Date().toISOString(),
};

const STORAGE_KEY_USER      = 'pdfdecor_user';
const STORAGE_KEY_USERS     = 'pdfdecor_users';
const STORAGE_KEY_ANALYTICS = 'pdfdecor_analytics';
const STORAGE_KEY_SEEDED    = 'pdfdecor_demo_seeded_v2';

/* ── Demo accounts seeded at first load ──────────────────────────────────────
   admin@pdfdecor.in / Admin@123  → role: admin, pro plan
   user@pdfdecor.in  / User@123   → role: user, free plan
 ──────────────────────────────────────────────────────────────────────────── */
function seedDemoAccounts(): void {
  if (localStorage.getItem(STORAGE_KEY_SEEDED)) return;
  try {
    const registry: Record<string, StoredUser> = JSON.parse(
      localStorage.getItem(STORAGE_KEY_USERS) || '{}',
    );

    if (!registry['admin@pdfdecor.in']) {
      registry['admin@pdfdecor.in'] = {
        email: 'admin@pdfdecor.in',
        name: 'Site Admin',
        password: 'Admin@123',
        plan: 'pro',
        role: 'admin',
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
        businessProfile: { companyName: 'PDFDecor', invoicePrefix: 'ADM' },
        pdfHistory: [],
        invoiceCounter: 1,
      };
    }

    if (!registry['user@pdfdecor.in']) {
      registry['user@pdfdecor.in'] = {
        email: 'user@pdfdecor.in',
        name: 'Demo User',
        password: 'User@123',
        plan: 'free',
        role: 'user',
        businessProfile: {},
        pdfHistory: [],
        invoiceCounter: 1,
      };
    }

    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));
    localStorage.setItem(STORAGE_KEY_SEEDED, '1');
  } catch { /* ignore */ }
}

/* ── Write an admin session into localStorage so /admin/* routes open ──────── */
function persistAdminSession(stored: StoredUser): void {
  const session = {
    adminId: `admin_${stored.email.replace(/[@.]/g, '_')}`,
    email: stored.email,
    name: stored.name || 'Admin',
    role: 'superadmin' as const,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem('pdfdecor_admin_session', JSON.stringify(session));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  /* ── Bootstrap ────────────────────────────────────────────────────────── */
  useEffect(() => {
    seedDemoAccounts();

    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      if (raw) {
        const u: User = JSON.parse(raw);
        if (u.plan === 'pro' && u.subscriptionExpiry && new Date(u.subscriptionExpiry) < new Date()) {
          u.plan = 'free';
          u.subscriptionExpiry = undefined;
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u));
        }
        setUser(u);
      }
    } catch { /* corrupted storage */ }

    try {
      const raw = localStorage.getItem(STORAGE_KEY_ANALYTICS);
      setAnalytics(raw ? JSON.parse(raw) : { ...defaultAnalytics });
    } catch { setAnalytics({ ...defaultAnalytics }); }
  }, []);

  /* ── Persist helper ───────────────────────────────────────────────────── */
  const persistUser = (u: User) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u));
    try {
      const registry: Record<string, StoredUser> = JSON.parse(
        localStorage.getItem(STORAGE_KEY_USERS) || '{}',
      );
      if (registry[u.email]) {
        registry[u.email] = { ...registry[u.email], ...u };
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));
      }
    } catch { /* ignore */ }
  };

  /* ── login ────────────────────────────────────────────────────────────── */
  const login = async (
    email: string, password: string,
  ): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
    const key = email.trim().toLowerCase();
    try {
      const registry: Record<string, StoredUser> = JSON.parse(
        localStorage.getItem(STORAGE_KEY_USERS) || '{}',
      );
      const stored = registry[key];
      if (!stored) return { success: false, error: 'No account found with this email.' };
      if (stored.password !== password) return { success: false, error: 'Incorrect password.' };

      /* auto-downgrade expired pro */
      if (stored.plan === 'pro' && stored.subscriptionExpiry) {
        if (new Date(stored.subscriptionExpiry) < new Date()) {
          stored.plan = 'free';
          stored.subscriptionExpiry = undefined;
          registry[key] = stored;
          localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));
        }
      }

      const { password: _pw, ...session } = stored;
      setUser(session);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));

      /* if admin → also create admin session for /admin/* routes */
      const isAdminUser = stored.role === 'admin';
      if (isAdminUser) persistAdminSession(stored);

      return { success: true, isAdmin: isAdminUser };
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  /* ── logout ───────────────────────────────────────────────────────────── */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem('pdfdecor_admin_session');
  };

  /* ── signup ───────────────────────────────────────────────────────────── */
  const signup = async (
    email: string, password: string, name?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const key = email.trim().toLowerCase();
    if (!key || !password) return { success: false, error: 'Email and password are required.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    try {
      const registry: Record<string, StoredUser> = JSON.parse(
        localStorage.getItem(STORAGE_KEY_USERS) || '{}',
      );
      if (registry[key]) return { success: false, error: 'An account with this email already exists.' };

      const newUser: StoredUser = {
        email: key, name: name?.trim() || '', password,
        plan: 'free', role: 'user',
        businessProfile: {}, pdfHistory: [], invoiceCounter: 1,
      };
      registry[key] = newUser;
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));

      const { password: _pw, ...sess } = newUser;
      setUser(sess);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sess));
      return { success: true };
    } catch {
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  /* ── upgradeToPro ─────────────────────────────────────────────────────── */
  const upgradeToPro = async (plan: 'monthly' | 'yearly'): Promise<boolean> => {
    if (!user) return false;
    const expiry = new Date();
    plan === 'monthly' ? expiry.setMonth(expiry.getMonth() + 1) : expiry.setFullYear(expiry.getFullYear() + 1);
    const updated: User = { ...user, plan: 'pro', subscriptionExpiry: expiry.toISOString() };
    persistUser(updated);
    try {
      const registry: Record<string, StoredUser> = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}');
      if (registry[user.email]) {
        registry[user.email].plan = 'pro';
        registry[user.email].subscriptionExpiry = expiry.toISOString();
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));
      }
    } catch { /* ignore */ }
    return true;
  };

  /* ── updateBusinessProfile ────────────────────────────────────────────── */
  const updateBusinessProfile = (profile: BusinessProfile) => {
    if (!user || user.plan !== 'pro') return;
    persistUser({ ...user, businessProfile: { ...user.businessProfile, ...profile } });
  };

  /* ── PDF History ──────────────────────────────────────────────────────── */
  const savePDFToHistory = (item: Omit<PDFHistoryItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    if (!user || user.plan !== 'pro') return '';
    const id = `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const now = new Date().toISOString();
    const newItem: PDFHistoryItem = { ...item, id, createdAt: now, updatedAt: now };
    persistUser({ ...user, pdfHistory: [newItem, ...(user.pdfHistory || [])].slice(0, 100) });
    return id;
  };

  const updatePDFInHistory = (id: string, update: { data?: any; templateId?: number; title?: string }) => {
    if (!user || user.plan !== 'pro') return;
    const history = (user.pdfHistory || []).map(h =>
      h.id !== id ? h : { ...h, ...update, updatedAt: new Date().toISOString() },
    );
    persistUser({ ...user, pdfHistory: history });
  };

  const deletePDFFromHistory = (id: string) => {
    if (!user || user.plan !== 'pro') return;
    persistUser({ ...user, pdfHistory: (user.pdfHistory || []).filter(h => h.id !== id) });
  };

  const getPDFFromHistory = (id: string) =>
    (!user || user.plan !== 'pro') ? undefined : (user.pdfHistory || []).find(h => h.id === id);

  /* ── trackEvent ───────────────────────────────────────────────────────── */
  const trackEvent = (
    event: 'pdf_generated' | 'upgrade_click' | 'template_selected',
    meta?: Record<string, string>,
  ) => {
    const cur = analytics || { ...defaultAnalytics };
    const updated: AnalyticsData = { ...cur, lastActivity: new Date().toISOString() };
    if (event === 'pdf_generated' && meta?.type) {
      updated.totalGenerated = (cur.totalGenerated || 0) + 1;
      updated.pdfTypeCounts = { ...cur.pdfTypeCounts, [meta.type]: ((cur.pdfTypeCounts || {})[meta.type] || 0) + 1 };
    } else if (event === 'upgrade_click') {
      updated.upgradeClicks = (cur.upgradeClicks || 0) + 1;
    } else if (event === 'template_selected' && meta?.template) {
      updated.templateCounts = { ...cur.templateCounts, [meta.template]: ((cur.templateCounts || {})[meta.template] || 0) + 1 };
    }
    setAnalytics(updated);
    localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(updated));
  };

  /* ── getNextInvoiceNumber ─────────────────────────────────────────────── */
  const getNextInvoiceNumber = (): string => {
    if (!user) return 'INV-001';
    const prefix = user.businessProfile?.invoicePrefix || 'INV';
    const counter = user.invoiceCounter || 1;
    persistUser({ ...user, invoiceCounter: counter + 1 });
    return `${prefix}-${String(counter).padStart(3, '0')}`;
  };

  const isPro = user?.plan === 'pro' && (!user.subscriptionExpiry || new Date(user.subscriptionExpiry) > new Date());
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isPro, isAdmin,
      login, logout, signup, upgradeToPro,
      updateBusinessProfile,
      savePDFToHistory, updatePDFInHistory, deletePDFFromHistory, getPDFFromHistory,
      trackEvent, getNextInvoiceNumber, analytics,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
