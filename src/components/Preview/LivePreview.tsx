import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { buildCvDocument } from '../../cv/document';
import type { CVData } from '../../cv/schema';
import CvSheet from './CvSheet';

interface LivePreviewProps {
  data: CVData;
  exporting: boolean;
  onDownload: () => void;
}

/** A4 width in CSS pixels (210mm at 96dpi). */
const SHEET_WIDTH_PX = (210 / 25.4) * 96;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;
const STEP = 0.1;
const PADDING_PX = 40;

const clamp = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

const LivePreview = ({ data, exporting, onDownload }: LivePreviewProps) => {
  // Typing stays responsive: the preview re-renders at lower priority.
  const deferred = useDeferredValue(data);
  const doc = useMemo(() => buildCvDocument(deferred), [deferred]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [fitZoom, setFitZoom] = useState(0.5);
  /** null = follow the panel width. */
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const zoom = manualZoom ?? fitZoom;

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setFitZoom(clamp((entry.contentRect.width - PADDING_PX) / SHEET_WIDTH_PX));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="live-preview-panel">
      <div className="preview-header">
        <h2 className="preview-title">Preview</h2>
        <div className="preview-controls" role="group" aria-label="Zoom">
          <button
            type="button"
            className="btn-icon-sm"
            aria-label="Zoom out"
            onClick={() => setManualZoom(clamp(zoom - STEP))}
            disabled={zoom <= MIN_ZOOM}
          >
            −
          </button>
          <span className="zoom-label" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            className="btn-icon-sm"
            aria-label="Zoom in"
            onClick={() => setManualZoom(clamp(zoom + STEP))}
            disabled={zoom >= MAX_ZOOM}
          >
            +
          </button>
          <button type="button" className="btn-text" onClick={() => setManualZoom(null)} disabled={manualZoom === null}>
            Fit
          </button>
        </div>
      </div>
      <div className="preview-scroll-container" ref={containerRef}>
        {/* CSS zoom (unlike transform: scale) also shrinks the layout box, so scrolling works. */}
        <div className="preview-paper" style={{ zoom }}>
          <CvSheet doc={doc} />
        </div>
      </div>
      <div className="preview-footer">
        <p className="preview-note">Page breaks in the PDF may differ slightly from this preview.</p>
        <button type="button" className="btn-download" onClick={onDownload} disabled={exporting}>
          {exporting ? 'Preparing PDF…' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
};

export default LivePreview;
