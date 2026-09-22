import React, { useState } from 'react';
import { CVData } from '../../types/cv';
import TemplateRenderer from '../Templates/TemplateRenderer';

interface LivePreviewProps {
  data: CVData;
  onDownload: () => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({ data, onDownload }) => {
  const [previewScale, setPreviewScale] = useState(0.48);

  return (
    <div className="live-preview-panel">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <div className="preview-controls">
          <button type="button" className="btn-icon-sm" onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.05))}>−</button>
          <span className="zoom-label">{Math.round(previewScale * 100)}%</span>
          <button type="button" className="btn-icon-sm" onClick={() => setPreviewScale(Math.min(0.8, previewScale + 0.05))}>+</button>
        </div>
      </div>
      <div className="preview-scroll-container">
        <div className="preview-paper-wrapper">
          <div className="preview-paper">
            <TemplateRenderer data={data} scale={previewScale} />
          </div>
        </div>
      </div>
      <div className="preview-footer">
        <button type="button" className="btn-download" onClick={onDownload}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default LivePreview;
