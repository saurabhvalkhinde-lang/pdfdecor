import { Navigate } from 'react-router';
export function AdminIndexRedirect() {
  return <Navigate to="/admin/dashboard" replace />;
}
