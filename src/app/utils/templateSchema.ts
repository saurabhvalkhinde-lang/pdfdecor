/**
 * templateSchema.ts
 * ─────────────────────────────────────────────────────────────
 * JSON-driven template configuration system for PDFDecor.
 * Every template type is described by this schema so that:
 *  1. The UI can render template pickers dynamically.
 *  2. The PDF engine can apply consistent styles.
 *  3. Pro gating logic is centralised here.
 * ─────────────────────────────────────────────────────────────
 */

export type HeaderStyle = 'full-color' | 'minimal' | 'bordered' | 'gradient' | 'dark';
export type TableStyle = 'striped' | 'bordered' | 'minimal' | 'card';
export type FontFamily = 'system' | 'serif' | 'mono' | 'rounded';
export type SpacingDensity = 'compact' | 'normal' | 'spacious';

export interface TemplateSchema {
  id: number;
  templateName: string;
  description: string;
  headerStyle: HeaderStyle;
  font: FontFamily;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tableStyle: TableStyle;
  spacing: SpacingDensity;
  isPro: boolean;         // true = requires Pro plan
  tags: string[];         // e.g. ['modern', 'corporate', 'minimal']
  previewBg: string;      // gradient for thumbnail background
}

// ─── Invoice Templates ────────────────────────────────────────
export const INVOICE_TEMPLATES: TemplateSchema[] = [
  {
    id: 1, templateName: 'Modern Blue', description: 'Clean, professional — great for IT and service businesses',
    headerStyle: 'full-color', font: 'system', primaryColor: '#2563eb', secondaryColor: '#eff6ff',
    accentColor: '#1d4ed8', tableStyle: 'striped', spacing: 'normal', isPro: false,
    tags: ['modern', 'corporate', 'popular'], previewBg: 'from-blue-100 to-blue-200',
  },
  {
    id: 2, templateName: 'Classic Dark', description: 'Bold dark header — elegant, suitable for premium brands',
    headerStyle: 'dark', font: 'system', primaryColor: '#1f2937', secondaryColor: '#f9fafb',
    accentColor: '#374151', tableStyle: 'bordered', spacing: 'normal', isPro: false,
    tags: ['classic', 'premium', 'dark'], previewBg: 'from-gray-700 to-gray-900',
  },
  {
    id: 3, templateName: 'Minimal Green', description: 'Simple and fresh — perfect for freelancers',
    headerStyle: 'minimal', font: 'system', primaryColor: '#059669', secondaryColor: '#ecfdf5',
    accentColor: '#047857', tableStyle: 'minimal', spacing: 'spacious', isPro: false,
    tags: ['minimal', 'freelancer', 'green'], previewBg: 'from-green-100 to-emerald-200',
  },
  {
    id: 4, templateName: 'Corporate Purple', description: 'Gradient header — stands out, ideal for consultancies',
    headerStyle: 'gradient', font: 'system', primaryColor: '#7c3aed', secondaryColor: '#faf5ff',
    accentColor: '#6d28d9', tableStyle: 'card', spacing: 'normal', isPro: true,
    tags: ['gradient', 'consulting', 'premium'], previewBg: 'from-purple-400 to-purple-700',
  },
  {
    id: 5, templateName: 'Executive Red', description: 'Authoritative red — high-impact for large enterprises',
    headerStyle: 'full-color', font: 'serif', primaryColor: '#dc2626', secondaryColor: '#fef2f2',
    accentColor: '#b91c1c', tableStyle: 'striped', spacing: 'compact', isPro: true,
    tags: ['enterprise', 'bold', 'serif'], previewBg: 'from-red-400 to-red-700',
  },
];

// ─── Certificate Templates ────────────────────────────────────
export const CERTIFICATE_TEMPLATES: TemplateSchema[] = [
  {
    id: 1, templateName: 'Elegant Pink', description: 'Classic ornate border with floral accents',
    headerStyle: 'bordered', font: 'serif', primaryColor: '#9d174d', secondaryColor: '#fdf2f8',
    accentColor: '#831843', tableStyle: 'minimal', spacing: 'spacious', isPro: false,
    tags: ['elegant', 'classic', 'popular'], previewBg: 'from-pink-200 to-rose-300',
  },
  {
    id: 2, templateName: 'Gold Award', description: 'Gold-accented prestige certificate',
    headerStyle: 'full-color', font: 'serif', primaryColor: '#b45309', secondaryColor: '#fffbeb',
    accentColor: '#92400e', tableStyle: 'minimal', spacing: 'spacious', isPro: false,
    tags: ['award', 'gold', 'prestigious'], previewBg: 'from-amber-200 to-yellow-400',
  },
  {
    id: 3, templateName: 'Modern Blue', description: 'Clean contemporary design for corporate training',
    headerStyle: 'full-color', font: 'system', primaryColor: '#1d4ed8', secondaryColor: '#eff6ff',
    accentColor: '#1e40af', tableStyle: 'minimal', spacing: 'normal', isPro: false,
    tags: ['corporate', 'training', 'modern'], previewBg: 'from-blue-300 to-blue-600',
  },
  {
    id: 4, templateName: 'Premium Dark', description: 'Dark luxurious certificate for special recognitions',
    headerStyle: 'dark', font: 'serif', primaryColor: '#0f172a', secondaryColor: '#f8fafc',
    accentColor: '#1e293b', tableStyle: 'minimal', spacing: 'spacious', isPro: true,
    tags: ['luxury', 'dark', 'premium'], previewBg: 'from-slate-600 to-slate-900',
  },
  {
    id: 5, templateName: 'Gradient Celebration', description: 'Vibrant gradient — perfect for events and graduations',
    headerStyle: 'gradient', font: 'rounded', primaryColor: '#7c3aed', secondaryColor: '#fdf4ff',
    accentColor: '#ec4899', tableStyle: 'minimal', spacing: 'spacious', isPro: true,
    tags: ['celebration', 'graduation', 'colorful'], previewBg: 'from-violet-400 to-pink-500',
  },
];

// ─── ID Card Templates ────────────────────────────────────────
export const ID_CARD_TEMPLATES: TemplateSchema[] = [
  {
    id: 1, templateName: 'Corporate Blue', description: 'Standard employee ID with barcode',
    headerStyle: 'full-color', font: 'system', primaryColor: '#1e3a8a', secondaryColor: '#eff6ff',
    accentColor: '#1d4ed8', tableStyle: 'minimal', spacing: 'compact', isPro: false,
    tags: ['corporate', 'employee', 'standard'], previewBg: 'from-blue-700 to-blue-900',
  },
  {
    id: 2, templateName: 'Student Green', description: 'Friendly design for educational institutions',
    headerStyle: 'full-color', font: 'rounded', primaryColor: '#065f46', secondaryColor: '#ecfdf5',
    accentColor: '#047857', tableStyle: 'minimal', spacing: 'compact', isPro: false,
    tags: ['student', 'education', 'friendly'], previewBg: 'from-green-600 to-emerald-800',
  },
  {
    id: 3, templateName: 'Minimal White', description: 'Clean minimal design for modern companies',
    headerStyle: 'minimal', font: 'system', primaryColor: '#374151', secondaryColor: '#ffffff',
    accentColor: '#1f2937', tableStyle: 'minimal', spacing: 'normal', isPro: false,
    tags: ['minimal', 'modern', 'clean'], previewBg: 'from-gray-200 to-gray-400',
  },
  {
    id: 4, templateName: 'Premium Dark', description: 'Dark executive card for senior management',
    headerStyle: 'dark', font: 'system', primaryColor: '#0f172a', secondaryColor: '#f1f5f9',
    accentColor: '#334155', tableStyle: 'minimal', spacing: 'compact', isPro: true,
    tags: ['executive', 'premium', 'dark'], previewBg: 'from-slate-700 to-slate-950',
  },
  {
    id: 5, templateName: 'Gradient VIP', description: 'Vibrant gradient for events and VIP access',
    headerStyle: 'gradient', font: 'system', primaryColor: '#7c3aed', secondaryColor: '#faf5ff',
    accentColor: '#6d28d9', tableStyle: 'minimal', spacing: 'compact', isPro: true,
    tags: ['vip', 'event', 'gradient'], previewBg: 'from-purple-500 to-indigo-700',
  },
];

// ─── Event Pass Templates ─────────────────────────────────────
export const EVENT_PASS_TEMPLATES: TemplateSchema[] = [
  {
    id: 1, templateName: 'Teal Modern', description: 'Clean teal event pass with QR code',
    headerStyle: 'full-color', font: 'system', primaryColor: '#0d9488', secondaryColor: '#f0fdfa',
    accentColor: '#0f766e', tableStyle: 'minimal', spacing: 'normal', isPro: false,
    tags: ['modern', 'event', 'qr'], previewBg: 'from-teal-400 to-teal-700',
  },
  {
    id: 2, templateName: 'Dark Premium', description: 'Sleek dark pass for premium events',
    headerStyle: 'dark', font: 'system', primaryColor: '#1e293b', secondaryColor: '#f8fafc',
    accentColor: '#334155', tableStyle: 'minimal', spacing: 'compact', isPro: false,
    tags: ['dark', 'premium', 'conference'], previewBg: 'from-slate-700 to-slate-950',
  },
  {
    id: 3, templateName: 'Festival Gradient', description: 'Vibrant gradient for festivals and concerts',
    headerStyle: 'gradient', font: 'rounded', primaryColor: '#7c3aed', secondaryColor: '#fdf4ff',
    accentColor: '#ec4899', tableStyle: 'minimal', spacing: 'normal', isPro: false,
    tags: ['festival', 'concert', 'colorful'], previewBg: 'from-violet-500 to-pink-600',
  },
  {
    id: 4, templateName: 'Corporate Pass', description: 'Professional corporate event pass',
    headerStyle: 'full-color', font: 'system', primaryColor: '#1d4ed8', secondaryColor: '#eff6ff',
    accentColor: '#1e40af', tableStyle: 'minimal', spacing: 'compact', isPro: true,
    tags: ['corporate', 'conference', 'business'], previewBg: 'from-blue-600 to-blue-900',
  },
  {
    id: 5, templateName: 'Gold VIP', description: 'Gold-accented VIP access pass',
    headerStyle: 'full-color', font: 'serif', primaryColor: '#b45309', secondaryColor: '#fffbeb',
    accentColor: '#92400e', tableStyle: 'minimal', spacing: 'spacious', isPro: true,
    tags: ['vip', 'gold', 'exclusive'], previewBg: 'from-amber-400 to-yellow-600',
  },
];

// ─── Bill Templates ───────────────────────────────────────────
export const BILL_TEMPLATES: TemplateSchema[] = [
  { id: 1, templateName: 'Orange Classic', description: 'Warm orange retail bill', headerStyle: 'full-color', font: 'system', primaryColor: '#ea580c', secondaryColor: '#fff7ed', accentColor: '#c2410c', tableStyle: 'striped', spacing: 'normal', isPro: false, tags: ['retail', 'classic'], previewBg: 'from-orange-300 to-orange-600' },
  { id: 2, templateName: 'Minimal White', description: 'Clean white bill for boutiques', headerStyle: 'minimal', font: 'system', primaryColor: '#374151', secondaryColor: '#f9fafb', accentColor: '#1f2937', tableStyle: 'minimal', spacing: 'normal', isPro: false, tags: ['minimal', 'boutique'], previewBg: 'from-gray-100 to-gray-300' },
  { id: 3, templateName: 'Green Fresh', description: 'Fresh green for grocery and FMCG', headerStyle: 'full-color', font: 'system', primaryColor: '#16a34a', secondaryColor: '#f0fdf4', accentColor: '#15803d', tableStyle: 'striped', spacing: 'compact', isPro: false, tags: ['grocery', 'fmcg'], previewBg: 'from-green-400 to-green-700' },
  { id: 4, templateName: 'Corporate Blue', description: 'Professional bill for corporate vendors', headerStyle: 'full-color', font: 'system', primaryColor: '#2563eb', secondaryColor: '#eff6ff', accentColor: '#1d4ed8', tableStyle: 'bordered', spacing: 'normal', isPro: true, tags: ['corporate', 'vendor'], previewBg: 'from-blue-400 to-blue-700' },
  { id: 5, templateName: 'Dark Premium', description: 'Dark elegant bill for luxury retail', headerStyle: 'dark', font: 'serif', primaryColor: '#1f2937', secondaryColor: '#f9fafb', accentColor: '#374151', tableStyle: 'minimal', spacing: 'spacious', isPro: true, tags: ['luxury', 'premium'], previewBg: 'from-gray-700 to-gray-950' },
];

// ─── Receipt Templates ────────────────────────────────────────
export const RECEIPT_TEMPLATES: TemplateSchema[] = [
  { id: 1, templateName: 'Clean Green', description: 'Simple payment receipt', headerStyle: 'full-color', font: 'system', primaryColor: '#059669', secondaryColor: '#ecfdf5', accentColor: '#047857', tableStyle: 'minimal', spacing: 'normal', isPro: false, tags: ['simple', 'clean'], previewBg: 'from-green-300 to-emerald-600' },
  { id: 2, templateName: 'Blue Modern', description: 'Modern blue receipt with logo area', headerStyle: 'full-color', font: 'system', primaryColor: '#2563eb', secondaryColor: '#eff6ff', accentColor: '#1d4ed8', tableStyle: 'striped', spacing: 'normal', isPro: false, tags: ['modern', 'blue'], previewBg: 'from-blue-300 to-blue-600' },
  { id: 3, templateName: 'Minimal', description: 'Ultra-minimal receipt', headerStyle: 'minimal', font: 'mono', primaryColor: '#374151', secondaryColor: '#ffffff', accentColor: '#1f2937', tableStyle: 'minimal', spacing: 'compact', isPro: false, tags: ['minimal', 'mono'], previewBg: 'from-gray-200 to-gray-400' },
  { id: 4, templateName: 'Branded Corporate', description: 'Full-branded corporate receipt', headerStyle: 'full-color', font: 'system', primaryColor: '#7c3aed', secondaryColor: '#faf5ff', accentColor: '#6d28d9', tableStyle: 'bordered', spacing: 'normal', isPro: true, tags: ['branded', 'corporate'], previewBg: 'from-purple-400 to-violet-700' },
  { id: 5, templateName: 'Gold Luxury', description: 'Premium receipt for luxury services', headerStyle: 'full-color', font: 'serif', primaryColor: '#b45309', secondaryColor: '#fffbeb', accentColor: '#92400e', tableStyle: 'minimal', spacing: 'spacious', isPro: true, tags: ['luxury', 'gold'], previewBg: 'from-amber-300 to-yellow-600' },
];

// ─── Quotation Templates ──────────────────────────────────────
export const QUOTATION_TEMPLATES: TemplateSchema[] = [
  { id: 1, templateName: 'Professional Blue', description: 'Standard quotation for services', headerStyle: 'full-color', font: 'system', primaryColor: '#2563eb', secondaryColor: '#eff6ff', accentColor: '#1d4ed8', tableStyle: 'striped', spacing: 'normal', isPro: false, tags: ['services', 'blue'], previewBg: 'from-blue-300 to-blue-600' },
  { id: 2, templateName: 'Purple Corporate', description: 'Corporate proposal document', headerStyle: 'gradient', font: 'system', primaryColor: '#7c3aed', secondaryColor: '#faf5ff', accentColor: '#6d28d9', tableStyle: 'card', spacing: 'normal', isPro: false, tags: ['proposal', 'corporate'], previewBg: 'from-purple-300 to-purple-700' },
  { id: 3, templateName: 'Minimal White', description: 'Clean quotation for freelancers', headerStyle: 'minimal', font: 'system', primaryColor: '#374151', secondaryColor: '#f9fafb', accentColor: '#1f2937', tableStyle: 'minimal', spacing: 'spacious', isPro: false, tags: ['minimal', 'freelancer'], previewBg: 'from-gray-200 to-gray-400' },
  { id: 4, templateName: 'Executive Dark', description: 'High-impact dark quotation', headerStyle: 'dark', font: 'system', primaryColor: '#0f172a', secondaryColor: '#f8fafc', accentColor: '#1e293b', tableStyle: 'bordered', spacing: 'normal', isPro: true, tags: ['executive', 'dark'], previewBg: 'from-slate-600 to-slate-900' },
  { id: 5, templateName: 'Premium Teal', description: 'Premium teal for high-value proposals', headerStyle: 'full-color', font: 'system', primaryColor: '#0d9488', secondaryColor: '#f0fdfa', accentColor: '#0f766e', tableStyle: 'striped', spacing: 'normal', isPro: true, tags: ['premium', 'teal'], previewBg: 'from-teal-400 to-teal-700' },
];

// ─── All template maps ────────────────────────────────────────
export const ALL_TEMPLATES: Record<string, TemplateSchema[]> = {
  invoice: INVOICE_TEMPLATES,
  bill: BILL_TEMPLATES,
  receipt: RECEIPT_TEMPLATES,
  quotation: QUOTATION_TEMPLATES,
  certificate: CERTIFICATE_TEMPLATES,
  'id-card': ID_CARD_TEMPLATES,
  'event-pass': EVENT_PASS_TEMPLATES,
};

/** Returns templates available to a given plan (free = first 3, pro = all 5) */
export function getAvailableTemplates(type: string, isPro: boolean): TemplateSchema[] {
  const all = ALL_TEMPLATES[type] ?? [];
  return isPro ? all : all.filter(t => !t.isPro);
}

/** Check if a specific template index is locked for free users */
export function isTemplateLocked(templateId: number, type: string, isPro: boolean): boolean {
  const all = ALL_TEMPLATES[type] ?? [];
  const tmpl = all.find(t => t.id === templateId);
  if (!tmpl) return false;
  return tmpl.isPro && !isPro;
}
