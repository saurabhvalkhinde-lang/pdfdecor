import type { AdminUser, AdminSession, AdminRole } from '../types/admin';
import { hashPassword, verifyPassword } from './crypto';

const ADMINS_KEY   = 'pdfdecor_admin_registry';
const SESSION_KEY  = 'pdfdecor_admin_session';
const RATE_KEY     = 'pdfdecor_admin_rate';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 5 * 60 * 1000;

function getAdmins(): Record<string, AdminUser> {
  try { return JSON.parse(localStorage.getItem(ADMINS_KEY) || '{}'); } catch { return {}; }
}
function saveAdmins(a: Record<string, AdminUser>) {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(a));
}

export function getAdminCount(): number {
  return Object.keys(getAdmins()).length;
}

/* ── Seed demo admin account (called at AdminShell mount) ─────────────────── */
export async function seedDemoAdmin(): Promise<void> {
  const admins = getAdmins();
  if (admins['admin@pdfdecor.in']) return;
  try {
    admins['admin@pdfdecor.in'] = {
      id: 'admin_demo',
      email: 'admin@pdfdecor.in',
      name: 'Site Admin',
      role: 'superadmin',
      status: 'active',
      passwordHash: await hashPassword('Admin@123'),
      createdAt: new Date().toISOString(),
    };
    saveAdmins(admins);
  } catch { /* ignore */ }
}

export async function bootstrapAdmin(
  email: string, name: string, password: string,
): Promise<{ ok: boolean; error?: string }> {
  const admins = getAdmins();
  if (Object.keys(admins).length > 0) return { ok: false, error: 'Admin already exists' };
  const key = email.toLowerCase().trim();
  admins[key] = {
    id: `admin_${Date.now()}`,
    email: key, name,
    role: 'superadmin', status: 'active',
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  saveAdmins(admins);
  return { ok: true };
}

export async function adminLogin(
  email: string, password: string, ip = '127.0.0.1',
): Promise<{ ok: boolean; session?: AdminSession; error?: string }> {
  const key = email.toLowerCase().trim();

  /* rate-limit */
  const rate = JSON.parse(localStorage.getItem(RATE_KEY) || '{}');
  const entry = rate[key] || { attempts: 0, lockedUntil: 0 };
  if (entry.lockedUntil > Date.now()) {
    const left = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
    return { ok: false, error: `Too many attempts. Try again in ${left}s.` };
  }

  const admins = getAdmins();
  const admin  = admins[key];
  if (!admin) {
    entry.attempts++;
    if (entry.attempts >= MAX_ATTEMPTS) entry.lockedUntil = Date.now() + LOCKOUT_MS;
    rate[key] = entry; localStorage.setItem(RATE_KEY, JSON.stringify(rate));
    return { ok: false, error: 'Invalid email or password' };
  }
  if (admin.status === 'suspended') return { ok: false, error: 'Account suspended' };

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    entry.attempts++;
    if (entry.attempts >= MAX_ATTEMPTS) entry.lockedUntil = Date.now() + LOCKOUT_MS;
    rate[key] = entry; localStorage.setItem(RATE_KEY, JSON.stringify(rate));
    return { ok: false, error: 'Invalid email or password' };
  }

  delete rate[key]; localStorage.setItem(RATE_KEY, JSON.stringify(rate));

  admins[key].lastLoginAt = new Date().toISOString();
  admins[key].lastLoginIp = ip;
  saveAdmins(admins);

  const session: AdminSession = {
    adminId: admin.id, email: admin.email, name: admin.name,
    role: admin.role, loginAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function getAdminSession(): AdminSession | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
export function adminLogout(): void { localStorage.removeItem(SESSION_KEY); }

export function hasMinRole(session: AdminSession | null, min: AdminRole): boolean {
  if (!session) return false;
  const levels: AdminRole[] = ['viewer', 'admin', 'superadmin'];
  return levels.indexOf(session.role) >= levels.indexOf(min);
}
