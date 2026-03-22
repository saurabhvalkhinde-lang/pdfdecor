/**
 * ProTemplateGate
 * ─────────────────
 * Wrap Pro-only template thumbnails in this component.
 * • Free users see the template thumbnail with a blur + Crown overlay.
 * • Clicking it shows the UpgradeModal.
 * • Pro users see the template normally (no gate).
 */
import { useState } from 'react';
import { Crown, Lock } from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';
import { useAuth } from '../contexts/AuthContext';

interface ProTemplateGateProps {
  children: React.ReactNode;
  /** Template number shown in the label */
  templateNumber: number;
  /** Whether this slot is a Pro-only template */
  isPro: boolean;
  /** Whether the user is a Pro member */
  userIsPro: boolean;
  /** Called when the template is selected (only fires for accessible templates) */
  onSelect: () => void;
  /** Whether this template is currently active */
  isActive: boolean;
}

export function ProTemplateGate({
  children,
  templateNumber,
  isPro,
  userIsPro,
  onSelect,
  isActive,
}: ProTemplateGateProps) {
  const { trackEvent } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const locked = isPro && !userIsPro;

  const handleClick = () => {
    if (locked) {
      trackEvent('upgrade_click');
      setShowUpgrade(true);
    } else {
      onSelect();
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`relative cursor-pointer rounded-xl overflow-hidden transition-all border-2 ${
          isActive && !locked
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-300'
            : 'border-gray-200 hover:border-gray-300'
        } ${locked ? 'opacity-80' : ''}`}
        title={locked ? 'Pro template — upgrade to unlock' : `Template ${templateNumber}`}
      >
        {/* Actual template thumbnail */}
        <div className={locked ? 'blur-[2px] pointer-events-none select-none' : ''}>{children}</div>

        {/* Locked overlay */}
        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] rounded-xl">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-3 shadow-lg mb-2">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xs bg-black/50 px-3 py-1 rounded-full">
              PRO ONLY
            </span>
          </div>
        )}

        {/* Active badge */}
        {isActive && !locked && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            SELECTED
          </div>
        )}

        {/* Pro badge */}
        {isPro && !locked && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Crown className="h-2.5 w-2.5" /> PRO
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger="template"
      />
    </>
  );
}

/**
 * TemplateSelector
 * ─────────────────
 * Renders numbered template boxes (1-5). Slots 4 & 5 are Pro-gated.
 */
interface TemplateSelectorProps {
  selected: number;
  onSelect: (n: number) => void;
  userIsPro: boolean;
  /** labels for each template index (0-based) */
  labels?: string[];
}

export function TemplateSelector({ selected, onSelect, userIsPro, labels }: TemplateSelectorProps) {
  const defaultLabels = ['Classic', 'Modern', 'Minimal', 'Premium', 'Elite'];
  const names = labels || defaultLabels;
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { trackEvent } = useAuth();

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map(n => {
          const isProTemplate = n >= 4;
          const locked = isProTemplate && !userIsPro;
          const isActive = selected === n;
          return (
            <button
              key={n}
              onClick={() => {
                if (locked) {
                  trackEvent('upgrade_click');
                  setShowUpgrade(true);
                } else {
                  onSelect(n);
                }
              }}
              className={`relative flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all min-w-[70px] ${
                isActive && !locked
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : locked
                  ? 'border-dashed border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
              }`}
              title={locked ? 'Pro template — click to upgrade' : `Use template ${n}`}
            >
              <span className="text-lg font-bold">{n}</span>
              <span className="text-[10px] mt-0.5 opacity-70">{names[n - 1]}</span>
              {isProTemplate && (
                <span className={`absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  locked ? 'bg-amber-400 text-white' : 'bg-green-500 text-white'
                }`}>
                  {locked ? <Lock className="h-2 w-2 inline" /> : '✓'} PRO
                </span>
              )}
            </button>
          );
        })}
      </div>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} trigger="template" />
    </>
  );
}
