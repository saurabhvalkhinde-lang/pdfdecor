/**
 * TemplateGallery.tsx
 * ─────────────────────────────────────────────────────────────
 * Reusable template picker with:
 *  - Grid of template thumbnail cards
 *  - Pro lock overlay for gated templates
 *  - Live preview on hover
 *  - Click opens live editor
 * ─────────────────────────────────────────────────────────────
 */
import { useState } from 'react';
import { Link } from 'react-router';
import { Crown, Lock, CheckCircle2, Layers, Eye } from 'lucide-react';
import { TemplateSchema } from '../utils/templateSchema';
import { useAuth } from '../contexts/AuthContext';

interface TemplateGalleryProps {
  templates: TemplateSchema[];
  docType: string;       // e.g. 'invoice', 'certificate'
  docPath: string;       // e.g. '/invoice'
  selectedId?: number;
  onSelect?: (id: number) => void;
  onProGate?: () => void; // called when free user clicks locked template
  compact?: boolean;
}

export function TemplateGallery({
  templates, docType, docPath, selectedId, onSelect, onProGate, compact = false,
}: TemplateGalleryProps) {
  const { isPro } = useAuth();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleClick = (tmpl: TemplateSchema) => {
    if (tmpl.isPro && !isPro) {
      onProGate?.();
      return;
    }
    onSelect?.(tmpl.id);
  };

  return (
    <div className={`grid ${compact ? 'grid-cols-3 gap-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'}`}>
      {templates.map((tmpl) => {
        const locked = tmpl.isPro && !isPro;
        const selected = selectedId === tmpl.id;
        const hovered = hoveredId === tmpl.id;

        return (
          <div
            key={tmpl.id}
            className={`relative group rounded-xl border-2 overflow-hidden cursor-pointer transition-all
              ${selected ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200 hover:border-gray-300'}
              ${locked ? 'opacity-90' : 'hover:shadow-md hover:-translate-y-0.5'}
            `}
            onClick={() => handleClick(tmpl)}
            onMouseEnter={() => setHoveredId(tmpl.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Thumbnail */}
            <div
              className={`bg-gradient-to-br ${tmpl.previewBg} relative`}
              style={{ height: compact ? '64px' : '90px' }}
            >
              {/* Mock document lines */}
              <div className="absolute inset-2 bg-white/90 rounded-md p-2 shadow-sm">
                <div className="h-2 rounded-sm mb-1.5" style={{ background: tmpl.primaryColor, width: '60%' }} />
                <div className="h-1 rounded-sm bg-gray-200 mb-1 w-full" />
                <div className="h-1 rounded-sm bg-gray-200 mb-1" style={{ width: '80%' }} />
                <div className="h-1 rounded-sm bg-gray-100" style={{ width: '50%' }} />
              </div>

              {/* Hover overlay */}
              {hovered && !locked && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity">
                  <div className="bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-lg text-xs font-medium text-gray-700">
                    <Eye className="h-3 w-3" />
                    {onSelect ? 'Select' : 'Open Editor'}
                  </div>
                </div>
              )}

              {/* Lock overlay */}
              {locked && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center transition-opacity">
                  <Lock className="h-4 w-4 text-white mb-0.5" />
                  <span className="text-white text-[9px] font-bold">PRO</span>
                </div>
              )}

              {/* Selected checkmark */}
              {selected && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 bg-white rounded-full" />
                </div>
              )}

              {/* Pro badge */}
              {tmpl.isPro && (
                <div className="absolute top-1 left-1">
                  <span className="flex items-center gap-0.5 text-[9px] bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                    <Crown className="h-2 w-2" /> PRO
                  </span>
                </div>
              )}
            </div>

            {/* Label */}
            {!compact && (
              <div className="p-2 bg-white">
                <p className="text-xs font-semibold text-gray-800 truncate">{tmpl.templateName}</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{tmpl.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tmpl.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Full Template Gallery Page Section ──────────────────────────────────────

interface FullTemplateGalleryProps {
  docType: string;
  docPath: string;
  templates: TemplateSchema[];
  title: string;
  description?: string;
}

export function FullTemplateGallerySection({ docType, docPath, templates, title, description }: FullTemplateGalleryProps) {
  const { isPro } = useAuth();

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Layers className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500">
            {isPro ? templates.length : templates.filter(t => !t.isPro).length}/{templates.length} available
          </span>
          {!isPro && (
            <Link to="/pricing" className="flex items-center gap-1 text-blue-600 font-medium hover:underline text-xs">
              <Crown className="h-3.5 w-3.5 text-yellow-500" /> Unlock all
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((tmpl) => {
          const locked = tmpl.isPro && !isPro;
          return (
            <Link
              key={tmpl.id}
              to={locked ? '/pricing' : docPath}
              className={`group relative bg-white rounded-xl border-2 overflow-hidden transition-all
                ${locked ? 'border-gray-200 opacity-80 hover:opacity-100' : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'}
              `}
            >
              {/* Thumbnail */}
              <div
                className={`bg-gradient-to-br ${tmpl.previewBg} relative`}
                style={{ height: '100px' }}
              >
                <div className="absolute inset-3 bg-white/90 rounded-lg p-2 shadow">
                  <div className="h-2.5 rounded-sm mb-1.5" style={{ background: tmpl.primaryColor, width: '55%' }} />
                  <div className="h-1 rounded-sm bg-gray-200 mb-1 w-full" />
                  <div className="h-1 rounded-sm bg-gray-200 mb-1" style={{ width: '80%' }} />
                  <div className="h-5 rounded-sm mt-1.5" style={{ background: tmpl.primaryColor + '15', width: '100%' }} />
                  <div className="h-1 rounded-sm bg-gray-100 mt-1" style={{ width: '60%' }} />
                </div>

                {locked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center group-hover:bg-black/50 transition-colors">
                    <Crown className="h-5 w-5 text-yellow-400 mb-1" />
                    <span className="text-white text-[10px] font-bold">Pro Only</span>
                    <span className="text-yellow-200 text-[9px]">Upgrade →</span>
                  </div>
                )}

                {tmpl.isPro && !locked && (
                  <span className="absolute top-1 left-1 text-[9px] bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                    <Crown className="h-2 w-2" /> PRO
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-800">{tmpl.templateName}</p>
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: tmpl.primaryColor }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-1">{tmpl.description}</p>
                <div className="flex gap-1 mt-1.5">
                  {tmpl.tags.slice(0, 2).map(t => (
                    <span key={t} className="text-[9px] bg-gray-50 border border-gray-100 text-gray-500 px-1 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
