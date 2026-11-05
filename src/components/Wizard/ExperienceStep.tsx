import { useState } from 'react';
import FormField from '../UI/FormField';
import ItemCard from '../UI/ItemCard';
import { CloseIcon } from '../UI/icons';
import { createId } from '../../cv/id';
import { EMPLOYMENT_TYPES, newBullet, type Bullet, type WorkExperience } from '../../cv/schema';
import { IMPACT_TYPES, achievementBullet, polishBullet, type ImpactType } from '../../cv/text';
import { dateRangeError } from '../../cv/validation';
import { type EditorProps, moveItem, replaceById } from './types';

const EMPLOYMENT_LABELS: Record<WorkExperience['employmentType'], string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

type BulletField = 'responsibilities' | 'achievements';

const emptyJob = (): WorkExperience => ({
  id: createId(),
  companyName: '',
  jobTitle: '',
  location: '',
  employmentType: 'full-time',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: [newBullet()],
  achievements: [newBullet()],
});

interface BulletListProps {
  label: string;
  itemLabel: string;
  placeholder: string;
  bullets: Bullet[];
  onChange: (next: Bullet[], undoLabel?: string) => void;
}

const BulletList = ({ label, itemLabel, placeholder, bullets, onChange }: BulletListProps) => (
  <>
    {bullets.map((bullet, index) => (
      <div key={bullet.id} className="list-item-row">
        <span className="bullet" aria-hidden="true">
          •
        </span>
        <input
          className="form-input"
          value={bullet.text}
          aria-label={`${itemLabel} ${index + 1}`}
          placeholder={placeholder}
          onChange={(e) => onChange(bullets.map((b) => (b.id === bullet.id ? { ...b, text: e.target.value } : b)))}
        />
        {bullets.length > 1 && (
          <button
            type="button"
            className="btn-icon btn-delete-sm"
            aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
            onClick={() =>
              onChange(
                bullets.filter((b) => b.id !== bullet.id),
                `Removed ${itemLabel.toLowerCase()}`,
              )
            }
          >
            <CloseIcon />
          </button>
        )}
      </div>
    ))}
    <button type="button" className="btn-text btn-add" onClick={() => onChange([...bullets, newBullet()])}>
      + Add {label}
    </button>
  </>
);

const ExperienceStep = ({ value: jobs, onChange }: EditorProps<WorkExperience[]>) => {
  const [expandedId, setExpandedId] = useState<string | null>(jobs[0]?.id ?? null);
  const [impactType, setImpactType] = useState<ImpactType>('Saved time');
  const [impactNote, setImpactNote] = useState('');

  const update = (id: string, patch: Partial<WorkExperience>, undoLabel?: string) =>
    onChange(replaceById(jobs, id, patch), undoLabel);

  const addJob = () => {
    const job = emptyJob();
    onChange([...jobs, job]);
    setExpandedId(job.id);
  };

  const setBullets = (job: WorkExperience, field: BulletField) => (next: Bullet[], undoLabel?: string) =>
    update(job.id, { [field]: next }, undoLabel);

  const polish = (job: WorkExperience) =>
    update(
      job.id,
      {
        responsibilities: job.responsibilities.map((b) => ({ ...b, text: polishBullet(b.text) })),
        achievements: job.achievements.map((b) => ({ ...b, text: polishBullet(b.text) })),
      },
      'Polished wording',
    );

  const addResult = (job: WorkExperience) => {
    const text = achievementBullet(impactType, impactNote);
    if (!text) return;
    update(job.id, { achievements: [...job.achievements.filter((b) => b.text.trim()), newBullet(text)] });
    setImpactNote('');
  };

  return (
    <div className="wizard-step">
      {jobs.length === 0 && (
        <div className="empty-state">
          <h3>No work experience added yet</h3>
          <p>Add your most recent position to get started.</p>
        </div>
      )}

      {jobs.map((job, index) => {
        const title = job.jobTitle || 'Untitled position';
        const dateError = dateRangeError(job.startDate, job.endDate, job.currentlyWorking);
        return (
          <ItemCard
            key={job.id}
            title={title}
            subtitle={[job.companyName || 'Company', job.location].filter(Boolean).join(' • ')}
            expanded={expandedId === job.id}
            onToggle={() => setExpandedId(expandedId === job.id ? null : job.id)}
            onRemove={() =>
              onChange(
                jobs.filter((item) => item.id !== job.id),
                `Deleted "${title}"`,
              )
            }
            onMoveUp={index > 0 ? () => onChange(moveItem(jobs, index, -1)) : undefined}
            onMoveDown={index < jobs.length - 1 ? () => onChange(moveItem(jobs, index, 1)) : undefined}
          >
            <div className="form-grid">
              <FormField
                label="Job title"
                value={job.jobTitle}
                onChange={(v) => update(job.id, { jobTitle: v })}
                placeholder="e.g. Senior Developer"
                required
                error={job.jobTitle.trim() ? undefined : 'Add a job title.'}
              />
              <FormField
                label="Company"
                value={job.companyName}
                onChange={(v) => update(job.id, { companyName: v })}
                placeholder="e.g. Acme Ltd"
                required
                error={job.companyName.trim() ? undefined : 'Add the company name.'}
                autoComplete="organization"
              />
            </div>

            <div className="form-grid">
              <FormField
                label="Location"
                value={job.location}
                onChange={(v) => update(job.id, { location: v })}
                placeholder="e.g. Cape Town, SA"
                optional
              />
              <div className="form-field">
                <label className="form-label" htmlFor={`${job.id}-type`}>
                  Employment type
                </label>
                <select
                  id={`${job.id}-type`}
                  className="form-input"
                  value={job.employmentType}
                  onChange={(e) =>
                    update(job.id, { employmentType: e.target.value as WorkExperience['employmentType'] })
                  }
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {EMPLOYMENT_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid form-grid-3">
              <FormField
                label="Start date"
                value={job.startDate}
                onChange={(v) => update(job.id, { startDate: v })}
                type="month"
              />
              {!job.currentlyWorking && (
                <FormField
                  label="End date"
                  value={job.endDate}
                  onChange={(v) => update(job.id, { endDate: v })}
                  type="month"
                  error={dateError}
                  showError={Boolean(dateError)}
                />
              )}
              <div className="form-field checkbox-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={job.currentlyWorking}
                    onChange={(e) => update(job.id, { currentlyWorking: e.target.checked })}
                  />
                  I currently work here
                </label>
              </div>
            </div>

            <div className="bullet-section" role="group" aria-labelledby={`${job.id}-did`}>
              <div className="section-header-inline">
                <h4 id={`${job.id}-did`}>What did you do in this role?</h4>
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => polish(job)}
                  title="Removes “I…”, “Responsible for…” and fixes capitalisation. Undoable."
                >
                  Polish wording
                </button>
              </div>
              <BulletList
                label="responsibility"
                itemLabel="Responsibility"
                placeholder="e.g. Managed the company's call-centre systems"
                bullets={job.responsibilities}
                onChange={setBullets(job, 'responsibilities')}
              />
            </div>

            <div className="bullet-section" role="group" aria-labelledby={`${job.id}-achieved`}>
              <h4 id={`${job.id}-achieved`}>What did you achieve?</h4>
              <div className="impact-helper">
                <p id={`${job.id}-impact`}>
                  Need help phrasing a result? Pick what improved, then describe the change.
                </p>
                <div className="chip-row" role="group" aria-labelledby={`${job.id}-impact`}>
                  {(Object.keys(IMPACT_TYPES) as ImpactType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`role-chip${impactType === type ? ' selected' : ''}`}
                      aria-pressed={impactType === type}
                      onClick={() => setImpactType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="inline-add">
                  <input
                    className="form-input"
                    value={impactNote}
                    aria-label="Describe the change"
                    onChange={(e) => setImpactNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addResult(job)}
                    placeholder="e.g. 60% by automating the weekly report"
                  />
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => addResult(job)}
                    disabled={!impactNote.trim()}
                  >
                    Add result
                  </button>
                </div>
              </div>
              <BulletList
                label="achievement"
                itemLabel="Achievement"
                placeholder="e.g. Reduced manual reporting time by 60%"
                bullets={job.achievements}
                onChange={setBullets(job, 'achievements')}
              />
            </div>
          </ItemCard>
        );
      })}

      <button type="button" className="btn-add-section" onClick={addJob}>
        <span className="plus-icon" aria-hidden="true">
          +
        </span>
        Add work experience
      </button>
    </div>
  );
};

export default ExperienceStep;
