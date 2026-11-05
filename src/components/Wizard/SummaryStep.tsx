import { useState } from 'react';
import FormField from '../UI/FormField';
import type { ProfessionalSummary } from '../../cv/schema';
import { draftSummary, polishParagraph, shortenParagraph } from '../../cv/text';
import type { EditorProps } from './types';

const SummaryStep = ({ value: data, onChange }: EditorProps<ProfessionalSummary>) => {
  const [showHelper, setShowHelper] = useState(!data.summary);
  const set = (field: keyof ProfessionalSummary) => (next: string) => onChange({ ...data, [field]: next });
  const rewrite = (summary: string, label: string) => {
    if (summary !== data.summary) onChange({ ...data, summary }, label);
  };

  const draft = draftSummary(data);

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2 tabIndex={-1}>About me</h2>
        <p>
          Write two or three sentences about who you are and what you're good at — or answer a few questions and we'll
          draft it.
        </p>
      </div>

      {showHelper && (
        <div className="helper-card">
          <h3>Draft my summary</h3>
          <p>We only use these answers to draft the paragraph. Nothing is sent anywhere.</p>

          <div className="form-grid">
            <FormField
              label="What job are you looking for?"
              value={data.jobType}
              onChange={set('jobType')}
              placeholder="e.g. Systems Developer"
            />
            <FormField
              label="Years of experience"
              value={data.yearsExperience}
              onChange={set('yearsExperience')}
              placeholder="e.g. 3"
              inputMode="numeric"
            />
          </div>
          <FormField
            label="Your strongest skills"
            value={data.strongestSkills}
            onChange={set('strongestSkills')}
            placeholder="e.g. Python, React and team leadership"
          />
          <div className="form-grid">
            <FormField
              label="Industries you've worked in"
              value={data.industries}
              onChange={set('industries')}
              placeholder="e.g. finance and retail"
            />
            <FormField
              label="What makes you different?"
              value={data.uniqueValue}
              onChange={set('uniqueValue')}
              placeholder="e.g. I bridge technical and business teams"
            />
          </div>
          <FormField
            label="What are you most proud of?"
            value={data.proudOf}
            onChange={set('proudOf')}
            placeholder="e.g. Built a system that saved 60% of manual effort"
          />

          <button
            type="button"
            className="btn-primary btn-generate"
            disabled={!draft}
            onClick={() => {
              rewrite(draft, 'Replaced summary with draft');
              setShowHelper(false);
            }}
          >
            Use this as my summary
          </button>
          {draft && <p className="draft-preview">{draft}</p>}
        </div>
      )}

      <FormField
        label="About me"
        value={data.summary}
        onChange={set('summary')}
        multiline
        rows={5}
        placeholder="e.g. Accountant with 5+ years of experience in retail finance. Known for turning month-end close from 10 days into 4."
        helperText={`${data.summary.trim().split(/\s+/).filter(Boolean).length} words · 40–80 words works well`}
      />

      <div className="tool-row">
        {!showHelper && (
          <button type="button" className="btn-secondary btn-sm" onClick={() => setShowHelper(true)}>
            Draft from questions
          </button>
        )}
        <button
          type="button"
          className="btn-secondary btn-sm"
          disabled={!data.summary.trim()}
          onClick={() => rewrite(shortenParagraph(data.summary), 'Shortened summary')}
        >
          Shorten
        </button>
        <button
          type="button"
          className="btn-secondary btn-sm"
          disabled={!data.summary.trim()}
          title="Fixes spacing, capitalisation and punctuation."
          onClick={() => rewrite(polishParagraph(data.summary), 'Tidied summary')}
        >
          Tidy punctuation
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;
