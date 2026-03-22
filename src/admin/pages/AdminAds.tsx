import { useEffect, useState } from 'react';
import { ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/settings';
import { addLog } from '../utils/auditLog';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import type { PlatformSettings } from '../types/admin';

export function AdminAds() {
  const { session } = useAdminAuth();
  const [s, setS] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setS(getSettings()); }, []);

  function toggle(k: keyof PlatformSettings) {
    setS(prev => ({ ...prev, [k]: !prev[k] }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(s);
    if (session) addLog(session.adminId, session.email, 'Ads settings updated', 'settings', 'ads');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const Row = ({ label, desc, field }: { label: string; desc: string; field: keyof PlatformSettings }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <button onClick={() => toggle(field)} className="focus:outline-none">
        {s[field]
          ? <ToggleRight className="h-8 w-8 text-blue-600" />
          : <ToggleLeft className="h-8 w-8 text-gray-300" />
        }
      </button>
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ads Management</h1>
        <p className="text-gray-500 text-sm">Toggle ad placements across the platform</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-0">
        <Row label="Ads Enabled (Global)" desc="Master switch — disables all ads site-wide when off" field="adsEnabled" />
        <Row label="Homepage Banner" desc="Top banner ad on the home page" field="adHomepageBanner" />
        <Row label="Generator Sidebar" desc="Ad shown on document generator pages" field="adGeneratorSidebar" />
        <Row label="Footer Ad" desc="Ad shown in the page footer" field="adFooter" />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-sm">
          <Save className="h-4 w-4" /> Save Ad Settings
        </button>
        {saved && <span className="text-green-600 font-medium text-sm">✓ Saved!</span>}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
        <strong>Note:</strong> Ad toggles are stored locally (localStorage). For production, connect to a backend API so settings sync across all users in real time.
      </div>
    </div>
  );
}
