import React, { useState } from 'react';
import FormField from '../UI/FormField';
import { CVData, JobTarget, Skill } from '../../types/cv';
import { findMissingSkills, generateId, tailorSummary } from '../../utils/helpers';

interface JobTargetStepProps {
  data: JobTarget;
  cvData: CVData;
  onChange: (data: JobTarget) => void;
  onApplyTailoring: (updates: { summary: string; skills: Skill[] }) => void;
}

const roleTypes = [
  'Software Development', 'IT Support', 'Systems Administration', 'Data / Analytics',
  'Project Management', 'Design / UX', 'Sales', 'Marketing', 'Finance', 'Healthcare',
  'Engineering', 'Education', 'Human Resources', 'Operations', 'Other',
];

const JobTargetStep: React.FC<JobTargetStepProps> = ({ data, cvData, onChange, onApplyTailoring }) => {
  const [missing, setMissing] = useState<string[]>([]);
  const [tailored, setTailored] = useState(false);

  const update = (field: keyof JobTarget, value: string) => onChange({ ...data, [field]: value });

  const handleTailor = () => {
    const extraSkills = findMissingSkills(data.jobDescription, cvData.skills.map((skill) => skill.name));
    setMissing(extraSkills);
    const summary = tailorSummary(cvData.professionalSummary.summary, data.jobTitle, data.industry, data.jobDescription);
    const skills = [
      ...cvData.skills,
      ...extraSkills.map((name) => ({ id: generateId(), name, category: 'technical' as const, proficiency: 'intermediate' as const })),
    ];
    onApplyTailoring({ summary, skills });
    setTailored(true);
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Job Target</h2>
        <p>Tell us about the role so we can emphasize the right skills and experience.</p>
      </div>

      <div className="target-card">
        <FormField label="What job are you applying for?" value={data.jobTitle} onChange={(v) => update('jobTitle', v)} placeholder="e.g. Systems Developer" />
        <FormField label="What industry?" value={data.industry} onChange={(v) => update('industry', v)} placeholder="e.g. Information Technology" />

        <div className="form-field">
          <label className="form-label">What type of role?</label>
          <div className="role-type-grid">
            {roleTypes.map((role) => (
              <button key={role} type="button" className={`role-chip ${data.roleType === role ? 'selected' : ''}`} onClick={() => update('roleType', role)}>
                {role}
              </button>
            ))}
          </div>
        </div>

        <FormField
          label="Paste the job description"
          value={data.jobDescription}
          onChange={(v) => update('jobDescription', v)}
          multiline
          rows={6}
          placeholder="Paste the full job description here... We'll use this to tailor your CV."
          optional
        />

        <button type="button" className="btn-primary btn-generate" onClick={handleTailor} disabled={!data.jobTitle && !data.jobDescription}>
          Tailor my CV to this job
        </button>

        {(data.jobDescription || tailored) && (
          <div className="ai-suggestion-box">
            <h4>Smart Suggestions</h4>
            {tailored ? (
              <p>Your summary was updated and matching keywords were emphasized.</p>
            ) : (
              <p>Based on the job description, consider highlighting relevant skills, similar roles, and matching projects.</p>
            )}
            {missing.length > 0 && (
              <>
                <p>Suggested skills added from the job description:</p>
                <ul>{missing.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTargetStep;
