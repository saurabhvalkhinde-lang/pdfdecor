import type { AppUser } from '../types/admin';

const USERS_REGISTRY_KEY = 'pdfdecor_users_registry';

export function getAllUsers(): AppUser[] {
  try {
    const raw = JSON.parse(localStorage.getItem(USERS_REGISTRY_KEY) || '{}');
    return Object.values(raw).map((u: any) => ({
      id: u.id || u.email,
      email: u.email,
      name: u.name || '',
      plan: u.plan || 'free',
      status: u.status || 'active',
      role: u.role || 'user',
      createdAt: u.createdAt || '',
      lastLoginAt: u.lastLoginAt || '',
      lastLoginIp: u.lastLoginIp || '',
      subscriptionExpiry: u.subscriptionExpiry || '',
      pdfHistory: u.pdfHistory || [],
      analytics: u.analytics || {},
    })) as AppUser[];
  } catch { return []; }
}

export function getUserById(id: string): AppUser | null {
  return getAllUsers().find(u => u.id === id || u.email === id) || null;
}

export function updateUserInRegistry(email: string, updates: Partial<AppUser>): void {
  try {
    const raw = JSON.parse(localStorage.getItem(USERS_REGISTRY_KEY) || '{}');
    if (raw[email]) {
      raw[email] = { ...raw[email], ...updates };
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(raw));
    }
  } catch {}
}
