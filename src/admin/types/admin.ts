// Admin type definitions
export type AdminRole = 'viewer' | 'admin' | 'superadmin';
export type AdminStatus = 'active' | 'suspended';
export type UserPlan = 'free' | 'pro';
export type UserStatus = 'active' | 'suspended';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  loginAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  plan: UserPlan;
  status: UserStatus;
  role?: string;
  createdAt?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  subscriptionExpiry?: string;
  pdfHistory?: any[];
  analytics?: any;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: string;
  createdAt: string;
}

export interface PlatformSettings {
  siteName: string;
  siteUrl: string;
  freePlanDailyLimit: number;
  watermarkText: string;
  monthlyPrice: number;
  yearlyPrice: number;
  adsEnabled: boolean;
  adHomepageBanner: boolean;
  adGeneratorSidebar: boolean;
  adFooter: boolean;
  maintenanceMode: boolean;
}
