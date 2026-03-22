import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import { seedDemoAdmin } from '../utils/auth';

/* Seeds the demo admin account into the admin registry on first load */
function Seeder() {
  useEffect(() => { seedDemoAdmin(); }, []);
  return <Outlet />;
}

export function AdminShell() {
  return (
    <AdminAuthProvider>
      <Seeder />
    </AdminAuthProvider>
  );
}
