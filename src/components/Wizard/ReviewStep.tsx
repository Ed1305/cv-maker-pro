import React from 'react';
import { CVData } from '../../types/cv';
import { getSectionTitle } from '../../data/sectionOptions';
import TemplateRenderer from '../Templates/TemplateRenderer';

interface ReviewStepProps {
  data: CVData;
  onDownload: () => void;
  onGoToStep: (step: number) => void;
  onImproveAll: () => void;
  onMakeATS: () => void;
  onShorten: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, onDownload, onGoToStep, onImproveAll, onMakeATS, onShorten }) => {
  const { personalInfo, professionalSummary, enabledSections } = data;

  const sections = [
    { name: 'Personal Information', step: 1, complete: !!personalInfo.fullName && !!personalInfo.email },
    { name: 'About Me', step: 2, complete: !!professionalSummary.summary },
    { name: 'CV Sections', step: 3, complete: enabledSections.length > 0 },
    ...enabledSections.map((id) => ({
      name: getSectionTitle(id),
      step: 3,
      complete: true,
    })),
  ];

  const completionRate = Math.round((sections.filter((section) => section.complete).length / sections.length) * 100);

  return (
    <div className="wizard-step review-step">
      <div className="step-header">
        <h2>Review Your CV</h2>
        <p>Check every section, polish with one-click tools, then download a high-quality A4 PDF.</p>
      </div>

      <div className="completion-meter">
        <div className="completion-header">
          <span>CV Completeness</span>
          <span className="completion-percentage">{completionRate}%</span>
        </div>
        <div className="completion-bar">
          <div className="completion-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <div className="summary-actions" style={{ marginBottom: 24 }}>
        <button type="button" className="btn-secondary btn-sm" onClick={onImproveAll}>Improve my CV</button>
        <button type="button" className="btn-secondary btn-sm" onClick={onMakeATS}>Make it ATS-friendly</button>
        <button type="button" className="btn-secondary btn-sm" onClick={onShorten}>Shorten to 1 page</button>
      </div>

      <div className="review-checklist">
        {sections.map((section, index) => (
          <div key={`${section.name}-${index}`} className={`review-item ${section.complete ? 'complete' : 'incomplete'}`} onClick={() => onGoToStep(section.step)}>
            <span className="review-name">{section.name}</span>
            <span className={`review-status ${section.complete ? 'done' : 'missing'}`}>
              {section.complete ? 'Complete' : 'Missing'}
            </span>
            <span className="review-edit">Edit →</span>
          </div>
        ))}
      </div>

      <div className="review-preview">
        <h3>Full CV Preview</h3>
        <div className="review-preview-container">
          <TemplateRenderer data={data} scale={0.65} />
        </div>
      </div>

      <div className="download-section">
        <button type="button" className="btn-download-large" onClick={onDownload}>
          Download High-Quality PDF
        </button>
        <p className="download-note">Generated as a high-resolution A4 PDF</p>
      </div>
    </div>
  );
};

export default ReviewStep;
