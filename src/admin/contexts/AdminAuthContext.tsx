import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AdminSession, AdminRole } from '../types/admin';
import { getAdminSession, adminLogout } from '../utils/auth';

interface AdminAuthContextType {
  session: AdminSession | null;
  isLoaded: boolean;
  isAuthenticated: boolean;
  hasRole: (min: AdminRole) => boolean;
  refresh: () => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  session: null,
  isLoaded: false,
  isAuthenticated: false,
  hasRole: () => false,
  refresh: () => {},
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  function refresh() {
    setSession(getAdminSession());
    setIsLoaded(true);
  }

  useEffect(() => { refresh(); }, []);

  function logout() {
    adminLogout();
    setSession(null);
  }

  const LEVELS: AdminRole[] = ['viewer', 'admin', 'superadmin'];
  function hasRole(min: AdminRole): boolean {
    if (!session) return false;
    return LEVELS.indexOf(session.role) >= LEVELS.indexOf(min);
  }

  return (
    <AdminAuthContext.Provider value={{
      session, isLoaded, isAuthenticated: !!session, hasRole, refresh, logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() { return useContext(AdminAuthContext); }
