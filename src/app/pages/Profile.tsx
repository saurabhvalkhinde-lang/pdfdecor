/**
 * Profile.tsx — Business Profile & Account Settings v2
 * Enhanced with logo upload preview, brand color picker, completeness meter,
 * and live preview of how profile auto-fills documents.
 */
import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Crown, Save, User, Building2, Upload, Trash2, CheckCircle2,
  Lock, Eye, EyeOff, AlertCircle, Sparkles, Phone, Mail,
  CreditCard, FileText, Palette, Hash, Info,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import type { BusinessProfile } from '../contexts/AuthContext';

const COMPLETENESS_FIELDS: Array<{ key: keyof BusinessProfile; label: string; icon: string; weight: number }> = [
  { key: 'companyName', label: 'Company Name', icon: '🏢', weight: 15 },
  { key: 'companyAddress', label: 'Business Address', icon: '📍', weight: 15 },
  { key: 'companyPhone', label: 'Phone Number', icon: '📞', weight: 10 },
  { key: 'companyEmail', label: 'Email Address', icon: '✉️', weight: 10 },
  { key: 'companyGST', label: 'GST Number (GSTIN)', icon: '🧾', weight: 15 },
  { key: 'upiId', label: 'UPI ID', icon: '💳', weight: 10 },
  { key: 'logo', label: 'Business Logo', icon: '🖼️', weight: 10 },
  { key: 'bankName', label: 'Bank Name', icon: '🏦', weight: 5 },
  { key: 'bankAccount', label: 'Bank Account No.', icon: '🔢', weight: 5 },
  { key: 'bankIFSC', label: 'IFSC Code', icon: '🔑', weight: 5 },
];

function completenessScore(profile: Partial<BusinessProfile>): number {
  return COMPLETENESS_FIELDS.reduce((score, f) => {
    const val = (profile as any)[f.key];
    return score + (val && val.toString().trim() ? f.weight : 0);
  }, 0);
}

export function Profile() {
  const { user, isPro, isAuthenticated, updateBusinessProfile, logout } = useAuth();
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'billing' | 'account'>('business');
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState<Partial<BusinessProfile>>(user?.businessProfile || {});

  // ── Gate: Must be logged in ─────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign In Required</h1>
        <p className="text-gray-500 mb-6">Please sign in to access your profile and business settings.</p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors inline-block">
          Sign In / Create Account
        </Link>
      </div>
    );
  }

  // ── Gate: Must be Pro ───────────────────────────────────────────────────────
  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-3xl p-12 text-center">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Business Profile</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Save your business details once — auto-fill all 10 document types instantly.
          </p>
          <div className="grid grid-cols-2 gap-2 text-left max-w-xs mx-auto mb-8">
            {[
              'Company name & address', 'GST number (GSTIN)',
              'Logo & brand colors', 'UPI ID for invoices',
              'Bank details', 'Custom footer text',
              'Invoice prefix & numbering', 'Default tax rate',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> {f}
              </div>
            ))}
          </div>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <Crown className="h-5 w-5" /> Get Pro — ₹249/month
          </Link>
        </div>
      </div>
    );
  }

  const score = completenessScore(profile);
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
  const barColor = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

  const set = (key: keyof BusinessProfile, value: any) => {
    setProfile(p => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be under 2MB. Please compress and try again.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => set('logo', reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateBusinessProfile(profile);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const TABS = [
    { key: 'business', label: 'Business Details', icon: Building2 },
    { key: 'billing', label: 'Bank & Billing', icon: CreditCard },
    { key: 'account', label: 'Account Settings', icon: User },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3" /> PRO
            </span>
          </div>
          <p className="text-gray-500 text-sm">Fill once — auto-fills all 10 document types</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          {saving ? (
            <><span className="animate-spin">⟳</span> Saving…</>
          ) : saved ? (
            <><CheckCircle2 className="h-4 w-4 text-green-300" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save Profile</>
          )}
        </Button>
      </div>

      {/* Completeness Banner */}
      <div className={`rounded-2xl p-5 mb-6 border ${score >= 80 ? 'bg-green-50 border-green-200' : score >= 50 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${scoreColor}`}>
            Profile {score >= 80 ? '✅ Complete' : score >= 50 ? '⚠️ Partial' : '❌ Incomplete'} — {score}% filled
          </span>
          <span className="text-xs text-gray-500">{score >= 80 ? 'Auto-fill works perfectly!' : 'Fill more fields for better auto-fill'}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${score}%` }} />
        </div>
        {score < 80 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {COMPLETENESS_FIELDS.filter(f => !(profile as any)[f.key]?.toString().trim()).slice(0, 4).map(f => (
              <span key={f.key} className="text-[10px] bg-white/70 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                {f.icon} Add {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Business Details ─────────────────────────────────────── */}
      {activeTab === 'business' && (
        <div className="space-y-5">
          {/* Logo Section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" /> Business Identity
            </h3>
            <div className="flex items-start gap-6">
              {/* Logo preview */}
              <div className="flex-shrink-0">
                <div
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {profile.logo ? (
                    <img src={profile.logo} alt="Logo" className="w-full h-full object-contain rounded-2xl" />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-400">Upload Logo</span>
                    </div>
                  )}
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                {profile.logo && (
                  <button
                    onClick={() => set('logo', '')}
                    className="mt-2 text-xs text-red-500 hover:underline w-full text-center flex items-center justify-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                )}
                <p className="text-[10px] text-gray-400 mt-1 text-center">Max 2MB · PNG/JPG</p>
              </div>

              {/* Brand color + Company name */}
              <div className="flex-1 space-y-3">
                <div>
                  <Label className="text-xs font-semibold">Company / Business Name *</Label>
                  <Input
                    value={profile.companyName || ''}
                    onChange={e => set('companyName', e.target.value)}
                    placeholder="Acme Technologies Pvt Ltd"
                    className="mt-1 h-9 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Palette className="h-3 w-3 text-purple-500" /> Brand Color
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={profile.brandColor || '#2563eb'}
                        onChange={e => set('brandColor', e.target.value)}
                        className="h-9 w-14 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                      />
                      <Input
                        value={profile.brandColor || '#2563eb'}
                        onChange={e => set('brandColor', e.target.value)}
                        placeholder="#2563eb"
                        className="h-9 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Hash className="h-3 w-3 text-orange-500" /> Invoice Prefix
                    </Label>
                    <Input
                      value={profile.invoicePrefix || ''}
                      onChange={e => set('invoicePrefix', e.target.value)}
                      placeholder="INV- or ACM-"
                      className="mt-1 h-9 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-600" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">Business Address *</Label>
                <Textarea
                  value={profile.companyAddress || ''}
                  onChange={e => set('companyAddress', e.target.value)}
                  placeholder="123 Business Park, Andheri East, Mumbai, Maharashtra 400069"
                  rows={2}
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone Number *
                </Label>
                <Input
                  value={profile.companyPhone || ''}
                  onChange={e => set('companyPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email Address *
                </Label>
                <Input
                  type="email"
                  value={profile.companyEmail || ''}
                  onChange={e => set('companyEmail', e.target.value)}
                  placeholder="contact@yourcompany.com"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">GSTIN (GST Number) *</Label>
                <Input
                  value={profile.companyGST || ''}
                  onChange={e => set('companyGST', e.target.value.toUpperCase())}
                  placeholder="22AAAAA0000A1Z5"
                  className="mt-1 h-9 text-sm font-mono"
                  maxLength={15}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold flex items-center gap-1">
                  💳 UPI ID (for QR Code)
                </Label>
                <Input
                  value={profile.upiId || ''}
                  onChange={e => set('upiId', e.target.value)}
                  placeholder="business@paytm or 9876543210@upi"
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Document Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" /> Document Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">Default Tax Rate (%)</Label>
                <Input
                  type="number"
                  min={0} max={100} step={0.5}
                  value={profile.defaultTaxRate ?? 18}
                  onChange={e => set('defaultTaxRate', parseFloat(e.target.value))}
                  className="mt-1 h-9 text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1">Auto-fills tax rate in all invoices & bills</p>
              </div>
              <div>
                <Label className="text-xs font-semibold">Payment Terms</Label>
                <Input
                  value={profile.paymentTerms || ''}
                  onChange={e => set('paymentTerms', e.target.value)}
                  placeholder="Net 30 days / Due on receipt"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">Custom Footer Text</Label>
                <Input
                  value={profile.customFooter || ''}
                  onChange={e => set('customFooter', e.target.value)}
                  placeholder="Thank you for your business! All disputes subject to Mumbai jurisdiction."
                  className="mt-1 h-9 text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1">Appears at the bottom of all your PDFs</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Bank & Billing ───────────────────────────────────────── */}
      {activeTab === 'billing' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" /> Bank Account Details
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Bank details auto-fill in invoices, quotations, and offer letters when enabled.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold">Bank Name</Label>
                <Input
                  value={profile.bankName || ''}
                  onChange={e => set('bankName', e.target.value)}
                  placeholder="State Bank of India"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Account Number</Label>
                <Input
                  value={profile.bankAccount || ''}
                  onChange={e => set('bankAccount', e.target.value)}
                  placeholder="1234567890"
                  className="mt-1 h-9 text-sm font-mono"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">IFSC Code</Label>
                <Input
                  value={profile.bankIFSC || ''}
                  onChange={e => set('bankIFSC', e.target.value.toUpperCase())}
                  placeholder="SBIN0001234"
                  className="mt-1 h-9 text-sm font-mono"
                  maxLength={11}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Branch Name</Label>
                <Input
                  value={profile.bankBranch || ''}
                  onChange={e => set('bankBranch', e.target.value)}
                  placeholder="Andheri East Branch"
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" /> Your Subscription
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">Current Plan</p>
                <p className="font-bold text-blue-600 text-lg flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" /> Pro
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">Expires</p>
                <p className="font-bold text-gray-900 text-sm">
                  {user?.subscriptionExpiry
                    ? new Date(user.subscriptionExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Not set'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/pricing"
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Renew / Upgrade Plan
              </Link>
              <a
                href="mailto:support@pdfdecor.in"
                className="text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Account Settings ─────────────────────────────────────── */}
      {activeTab === 'account' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" /> Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {(user?.name || user?.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.name || 'Your Name'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 px-2 py-0.5 rounded-full font-bold mt-1">
                    <Crown className="h-2.5 w-2.5" /> Pro Member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold">Display Name</Label>
                  <Input
                    defaultValue={user?.name || ''}
                    placeholder="Your full name"
                    className="mt-1 h-9 text-sm"
                    disabled
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Contact support to update name</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold">Email Address</Label>
                  <div className="relative mt-1">
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="h-9 text-sm pr-8 bg-gray-50"
                    />
                    <Lock className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
            <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Danger Zone
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-100 text-sm"
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                    logout();
                    navigate('/');
                  }
                }}
              >
                Sign Out
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-100 text-sm"
                onClick={() => {
                  if (confirm('This will clear all your local data (PDF history, business profile). This cannot be undone. Continue?')) {
                    logout();
                    localStorage.clear();
                    navigate('/');
                  }
                }}
              >
                Clear All Data
              </Button>
            </div>
            <p className="text-xs text-red-600 mt-3">
              ⚠️ Data stored locally in your browser. Clearing data will remove all saved information.
            </p>
          </div>
        </div>
      )}

      {/* Save Button (bottom) */}
      {activeTab !== 'account' && (
        <div className="sticky bottom-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              {saved ? (
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Profile saved successfully!
                </span>
              ) : (
                'Unsaved changes will be lost if you navigate away.'
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 gap-2 flex-shrink-0"
            >
              {saving ? (
                <><span className="animate-spin">⟳</span> Saving…</>
              ) : saved ? (
                <><CheckCircle2 className="h-4 w-4" /> Saved</>
              ) : (
                <><Save className="h-4 w-4" /> Save Profile</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
