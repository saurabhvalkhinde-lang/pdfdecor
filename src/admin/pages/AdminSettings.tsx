import { useEffect, useState } from 'react';
import { Save, RefreshCcw } from 'lucide-react';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/settings';
import { addLog } from '../utils/auditLog';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import type { PlatformSettings } from '../types/admin';

export function AdminSettings() {
  const { session } = useAdminAuth();
  const [s, setS] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setS(getSettings()); }, []);

  function set(k: keyof PlatformSettings, v: any) {
    setS(prev => ({ ...prev, [k]: v }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(s);
    if (session) addLog(session.adminId, session.email, 'Platform settings updated', 'settings', 'platform');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (!confirm('Reset all settings to defaults?')) return;
    setS({ ...DEFAULT_SETTINGS });
    saveSettings({ ...DEFAULT_SETTINGS });
    setSaved(false);
  }

  const Field = ({ label, k, type = 'text', min, step }: { label: string; k: keyof PlatformSettings; type?: string; min?: number; step?: number }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={String(s[k])}
        min={min}
        step={step}
        onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 text-sm">Configure site-wide settings</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-gray-800 border-b pb-2">Site Info</h3>
        <Field label="Site Name" k="siteName" />
        <Field label="Site URL" k="siteUrl" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-gray-800 border-b pb-2">Free Plan Limits</h3>
        <Field label="Free Plan Daily PDF Limit" k="freePlanDailyLimit" type="number" min={1} step={1} />
        <Field label="Watermark Text" k="watermarkText" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-gray-800 border-b pb-2">Pricing (₹)</h3>
        <Field label="Monthly Price (₹)" k="monthlyPrice" type="number" min={1} />
        <Field label="Yearly Price (₹)"  k="yearlyPrice"  type="number" min={1} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 border-b pb-2">Toggles</h3>
        {([
          ['adsEnabled',       'Ads Enabled'],
          ['maintenanceMode',  'Maintenance Mode'],
        ] as [keyof PlatformSettings, string][]).map(([k, label]) => (
          <label key={k} className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={Boolean(s[k])} onChange={e => set(k, e.target.checked)}
              className="w-4 h-4 rounded accent-blue-600" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-sm">
          <Save className="h-4 w-4" /> Save Settings
        </button>
        <button onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
          <RefreshCcw className="h-4 w-4" /> Reset to Defaults
        </button>
        {saved && <span className="text-green-600 font-medium text-sm">✓ Saved!</span>}
      </div>
    </div>
  );
}
