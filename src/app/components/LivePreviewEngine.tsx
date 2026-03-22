/**
 * LivePreviewEngine.tsx
 * ─────────────────────────────────────────────────────────────
 * Real-time PDF preview pipeline component.
 * Form changes → debounce → re-render template → show preview
 * This acts as the shared preview panel used by all document pages.
 * ─────────────────────────────────────────────────────────────
 */
import { useRef, useState, useEffect, ReactNode } from 'react';
import {
  Eye, EyeOff, Download, Share2, MessageCircle, Mail,
  Loader2, Maximize2, Minimize2, ZoomIn, ZoomOut, Copy, CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';

interface LivePreviewEngineProps {
  /** Unique DOM ID for the preview element (used by pdfGenerator) */
  previewId: string;
  /** The rendered template component */
  templateComponent: ReactNode;
  /** Filename for PDF download */
  filename: string;
  /** Triggered when download button pressed */
  onDownload: () => Promise<void>;
  /** Triggered when WhatsApp share pressed */
  onWhatsApp?: () => void;
  /** Triggered when email share pressed */
  onEmail?: () => void;
  /** Is downloading in progress */
  isDownloading?: boolean;
  /** Show the watermark notice */
  isWatermarked?: boolean;
  /** Additional action buttons */
  extraActions?: ReactNode;
}

export function LivePreviewEngine({
  previewId, templateComponent, filename, onDownload, onWhatsApp, onEmail,
  isDownloading = false, isWatermarked = false, extraActions,
}: LivePreviewEngineProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.5); // 0.5 = 50% scale
  const [copyDone, setCopyDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle fullscreen toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  // Adjust default zoom based on screen width
  useEffect(() => {
    const updateZoom = () => {
      const w = window.innerWidth;
      if (w < 768) setZoom(0.38);
      else if (w < 1024) setZoom(0.42);
      else setZoom(0.5);
    };
    updateZoom();
    window.addEventListener('resize', updateZoom);
    return () => window.removeEventListener('resize', updateZoom);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      // fallback
    }
  };

  const scalePercent = Math.round(zoom * 100);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4' : ''}`}>
      <div
        ref={panelRef}
        className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all ${
          isFullscreen ? 'w-full max-w-4xl max-h-[95vh] flex flex-col' : ''
        }`}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                isVisible ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-gray-100'
              }`}
            >
              {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {isVisible ? 'Preview On' : 'Preview Off'}
            </button>

            {isVisible && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1 py-0.5">
                <button
                  onClick={() => setZoom(z => Math.max(0.25, z - 0.1))}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={zoom <= 0.25}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-medium text-gray-600 min-w-[32px] text-center">{scalePercent}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(1, z + 0.1))}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={zoom >= 1}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isWatermarked && (
              <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                Watermark (Free)
              </span>
            )}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle fullscreen preview"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Preview area */}
        {isVisible && (
          <div
            className={`overflow-auto bg-gray-100 ${isFullscreen ? 'flex-1' : ''}`}
            style={{ maxHeight: isFullscreen ? undefined : '600px', minHeight: isFullscreen ? undefined : '200px' }}
          >
            <div
              className="flex justify-center py-4 px-2"
              style={{ minWidth: `${800 * zoom + 32}px` }}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  width: '800px',
                  flexShrink: 0,
                }}
              >
                {/* This is the element captured by pdfGenerator */}
                <div id={previewId} className="bg-white shadow-lg">
                  {templateComponent}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center gap-2 bg-white flex-shrink-0">
          <Button
            onClick={onDownload}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs px-4 py-2 h-auto"
          >
            {isDownloading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
            ) : (
              <><Download className="h-3.5 w-3.5" /> Download PDF</>
            )}
          </Button>

          {onWhatsApp && (
            <Button
              onClick={onWhatsApp}
              variant="outline"
              className="gap-1.5 text-xs px-3 py-2 h-auto border-green-300 text-green-700 hover:bg-green-50"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </Button>
          )}

          {onEmail && (
            <Button
              onClick={onEmail}
              variant="outline"
              className="gap-1.5 text-xs px-3 py-2 h-auto"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </Button>
          )}

          <Button
            onClick={handleCopyLink}
            variant="ghost"
            className="gap-1.5 text-xs px-3 py-2 h-auto text-gray-500"
          >
            {copyDone ? (
              <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy Link</>
            )}
          </Button>

          {extraActions}
        </div>
      </div>
    </div>
  );
}
