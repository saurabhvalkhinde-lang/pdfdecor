import { Navigate, Outlet } from 'react-router';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import type { AdminRole } from '../types/admin';

interface Props { minRole?: AdminRole; }

export function AdminRouteGuard({ minRole = 'viewer' }: Props) {
  const { session, isLoaded, hasRole } = useAdminAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;
  if (!hasRole(minRole)) return <Navigate to="/admin/dashboard" replace />;

  return <Outlet />;
}
