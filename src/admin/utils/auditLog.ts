import type { AdminLog } from '../types/admin';

const LOGS_KEY = 'pdfdecor_admin_logs';

export function getAllLogs(): AdminLog[] {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]') as AdminLog[];
  } catch { return []; }
}

export function addLog(
  adminId: string,
  adminEmail: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: string,
): void {
  const logs = getAllLogs();
  const log: AdminLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    adminId,
    adminEmail,
    action,
    targetType,
    targetId,
    details,
    createdAt: new Date().toISOString(),
  };
  logs.unshift(log);
  // keep last 1000 logs
  if (logs.length > 1000) logs.splice(1000);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function clearLogs(): void {
  localStorage.removeItem(LOGS_KEY);
}
