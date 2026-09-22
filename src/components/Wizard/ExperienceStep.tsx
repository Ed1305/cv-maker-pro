import React, { useState } from 'react';
import FormField from '../UI/FormField';
import { WorkExperience } from '../../types/cv';
import { generateAchievementBullet, generateId, improveText } from '../../utils/helpers';

interface ExperienceStepProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

const IMPACT_TYPES = [
  'Saved time',
  'Reduced costs',
  'Increased productivity',
  'Built something new',
  'Automated a process',
  'Managed people',
  'Improved customer experience',
  'Other',
];

const ExperienceStep: React.FC<ExperienceStepProps> = ({ data, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);
  const [impactType, setImpactType] = useState<string>('Saved time');
  const [impactNote, setImpactNote] = useState('');

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: generateId(),
      companyName: '',
      jobTitle: '',
      location: '',
      employmentType: 'full-time',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      responsibilities: [''],
      achievements: [''],
    };
    onChange([...data, newExp]);
    setExpandedId(newExp.id);
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: unknown) => {
    onChange(data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };

  const removeExperience = (id: string) => onChange(data.filter((exp) => exp.id !== id));

  const updateList = (expId: string, field: 'responsibilities' | 'achievements', index: number, value: string) => {
    const exp = data.find((item) => item.id === expId);
    if (!exp) return;
    const next = [...exp[field]];
    next[index] = value;
    updateExperience(expId, field, next);
  };

  const addListItem = (expId: string, field: 'responsibilities' | 'achievements') => {
    const exp = data.find((item) => item.id === expId);
    if (exp) updateExperience(expId, field, [...exp[field], '']);
  };

  const removeListItem = (expId: string, field: 'responsibilities' | 'achievements', index: number) => {
    const exp = data.find((item) => item.id === expId);
    if (exp) updateExperience(expId, field, exp[field].filter((_, i) => i !== index));
  };

  const improveResponsibilities = (expId: string) => {
    const exp = data.find((item) => item.id === expId);
    if (exp) updateExperience(expId, 'responsibilities', exp.responsibilities.map((item) => (item ? improveText(item) : item)));
  };

  const addImpactAchievement = (expId: string) => {
    if (!impactNote.trim()) return;
    const exp = data.find((item) => item.id === expId);
    if (!exp) return;
    const bullet = generateAchievementBullet(impactType, impactNote);
    const cleaned = exp.achievements.filter(Boolean);
    updateExperience(expId, 'achievements', [...cleaned, bullet]);
    setImpactNote('');
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const next = [...data];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= next.length) return;
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onChange(next);
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Work Experience</h2>
        <p>Start with your most recent role. Describe what you did, then turn results into strong bullets.</p>
      </div>

      {data.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No work experience added yet</h3>
          <p>Add your first position to get started</p>
        </div>
      )}

      {data.map((exp, index) => (
        <div key={exp.id} className={`experience-card ${expandedId === exp.id ? 'expanded' : ''}`}>
          <div className="experience-card-header" onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
            <div className="experience-card-info">
              <h3>{exp.jobTitle || 'Untitled Position'}</h3>
              <p>{exp.companyName || 'Company Name'}{exp.location ? ` • ${exp.location}` : ''}</p>
            </div>
            <div className="experience-card-actions">
              {index > 0 && <button type="button" className="btn-icon" onClick={(e) => { e.stopPropagation(); moveExperience(index, 'up'); }}>↑</button>}
              {index < data.length - 1 && <button type="button" className="btn-icon" onClick={(e) => { e.stopPropagation(); moveExperience(index, 'down'); }}>↓</button>}
              <button type="button" className="btn-icon btn-delete" onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}>🗑</button>
              <span className={`chevron ${expandedId === exp.id ? 'open' : ''}`}>▼</span>
            </div>
          </div>

          {expandedId === exp.id && (
            <div className="experience-card-body">
              <div className="form-grid">
                <FormField label="Job Title" value={exp.jobTitle} onChange={(v) => updateExperience(exp.id, 'jobTitle', v)} placeholder="e.g. Senior Developer" required />
                <FormField label="Company Name" value={exp.companyName} onChange={(v) => updateExperience(exp.id, 'companyName', v)} placeholder="e.g. Google" required />
              </div>

              <div className="form-grid form-grid-3">
                <FormField label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, 'location', v)} placeholder="e.g. Cape Town, SA" />
                <div className="form-field">
                  <label className="form-label">Employment Type</label>
                  <select className="form-input" value={exp.employmentType} onChange={(e) => updateExperience(exp.id, 'employmentType', e.target.value)}>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div />
              </div>

              <div className="form-grid form-grid-3">
                <FormField label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, 'startDate', v)} type="month" />
                {!exp.currentlyWorking && (
                  <FormField label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, 'endDate', v)} type="month" />
                )}
                <div className="form-field checkbox-field">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={exp.currentlyWorking} onChange={(e) => updateExperience(exp.id, 'currentlyWorking', e.target.checked)} />
                    Currently working here
                  </label>
                </div>
              </div>

              <div className="responsibilities-section">
                <div className="section-header-inline">
                  <h4>What did you do in this role?</h4>
                  <button type="button" className="btn-text" onClick={() => improveResponsibilities(exp.id)}>Improve with AI</button>
                </div>
                {exp.responsibilities.map((resp, rIndex) => (
                  <div key={`${exp.id}-r-${rIndex}`} className="list-item-row">
                    <span className="bullet">•</span>
                    <input className="form-input" value={resp} onChange={(e) => updateList(exp.id, 'responsibilities', rIndex, e.target.value)} placeholder="Managed Vicidial systems" />
                    {exp.responsibilities.length > 1 && (
                      <button type="button" className="btn-icon btn-delete-sm" onClick={() => removeListItem(exp.id, 'responsibilities', rIndex)}>×</button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-text btn-add" onClick={() => addListItem(exp.id, 'responsibilities')}>+ Add responsibility</button>
              </div>

              <div className="achievements-section">
                <h4>What did you accomplish in this role?</h4>
                <div className="impact-helper">
                  <p>Did you improve something?</p>
                  <div className="role-type-grid">
                    {IMPACT_TYPES.map((type) => (
                      <button key={type} type="button" className={`role-chip ${impactType === type ? 'selected' : ''}`} onClick={() => setImpactType(type)}>
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="add-custom-skill" style={{ marginTop: 12 }}>
                    <input className="form-input" value={impactNote} onChange={(e) => setImpactNote(e.target.value)} placeholder="Tell us what you changed, e.g. reporting that took 2 days now takes 30 minutes" />
                    <button type="button" className="btn-primary btn-sm" onClick={() => addImpactAchievement(exp.id)}>Add result</button>
                  </div>
                </div>
                {exp.achievements.map((ach, aIndex) => (
                  <div key={`${exp.id}-a-${aIndex}`} className="list-item-row">
                    <span className="bullet">★</span>
                    <input className="form-input" value={ach} onChange={(e) => updateList(exp.id, 'achievements', aIndex, e.target.value)} placeholder="Reduced manual reporting time by 60%" />
                    {exp.achievements.length > 1 && (
                      <button type="button" className="btn-icon btn-delete-sm" onClick={() => removeListItem(exp.id, 'achievements', aIndex)}>×</button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-text btn-add" onClick={() => addListItem(exp.id, 'achievements')}>+ Add achievement</button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button type="button" className="btn-add-section" onClick={addExperience}>
        <span className="plus-icon">+</span>
        Add Work Experience
      </button>
    </div>
  );
};

export default ExperienceStep;
