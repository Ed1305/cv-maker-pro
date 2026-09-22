import React, { useState } from 'react';
import FormField from '../UI/FormField';
import { ProfessionalSummary } from '../../types/cv';
import { generateSummary, makeSummaryMoreProfessional, shortenText } from '../../utils/helpers';

interface SummaryStepProps {
  data: ProfessionalSummary;
  onChange: (data: ProfessionalSummary) => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ data, onChange }) => {
  const [showHelper, setShowHelper] = useState(!data.summary);

  const update = (field: keyof ProfessionalSummary, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleGenerate = () => {
    update(
      'summary',
      generateSummary(data.jobType, data.yearsExperience, data.strongestSkills, data.industries, data.uniqueValue, data.proudOf)
    );
    setShowHelper(false);
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Professional Summary</h2>
        <p>Answer a few questions and we will write a recruiter-ready summary you can edit.</p>
      </div>

      {showHelper && (
        <div className="summary-helper">
          <div className="helper-card">
            <h3>Let's build your summary</h3>
            <p>These answers stay private. We only use them to draft the paragraph on your CV.</p>

            <div className="form-grid">
              <FormField label="What type of job are you looking for?" value={data.jobType} onChange={(v) => update('jobType', v)} placeholder="e.g. Systems Developer, Project Manager" />
              <FormField label="How many years of experience do you have?" value={data.yearsExperience} onChange={(v) => update('yearsExperience', v)} placeholder="e.g. 3" />
            </div>

            <FormField label="What are your strongest professional skills?" value={data.strongestSkills} onChange={(v) => update('strongestSkills', v)} placeholder="e.g. Python, React, Cloud Architecture, Team Leadership" />

            <div className="form-grid">
              <FormField label="What industries have you worked in?" value={data.industries} onChange={(v) => update('industries', v)} placeholder="e.g. Information Technology, Finance" />
              <FormField label="What makes you different from other candidates?" value={data.uniqueValue} onChange={(v) => update('uniqueValue', v)} placeholder="e.g. Bridge between technical and business teams" />
            </div>

            <FormField label="What are you most proud of professionally?" value={data.proudOf} onChange={(v) => update('proudOf', v)} placeholder="e.g. Built a system that saved 60% manual effort" />

            <button type="button" className="btn-primary btn-generate" onClick={handleGenerate}>
              Generate Professional Summary
            </button>
          </div>
        </div>
      )}

      <div className="summary-editor">
        <FormField
          label="Your Professional Summary"
          value={data.summary}
          onChange={(v) => update('summary', v)}
          multiline
          rows={5}
          placeholder="A compelling 2-3 sentence summary of your professional background, key skills, and career objectives..."
        />

        <div className="summary-actions">
          <button type="button" className="btn-secondary btn-sm" onClick={() => setShowHelper(true)}>Regenerate</button>
          <button type="button" className="btn-secondary btn-sm" onClick={() => update('summary', shortenText(data.summary))}>Shorter</button>
          <button type="button" className="btn-secondary btn-sm" onClick={() => update('summary', makeSummaryMoreProfessional(data.summary))}>More Professional</button>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
