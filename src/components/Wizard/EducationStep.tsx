import { useState } from 'react';
import FormField from '../UI/FormField';
import ItemCard from '../UI/ItemCard';
import { createId } from '../../cv/id';
import type { Education } from '../../cv/schema';
import { dateRangeError } from '../../cv/validation';
import { type EditorProps, moveItem, replaceById } from './types';

const emptyEducation = (): Education => ({
  id: createId(),
  institution: '',
  qualification: '',
  fieldOfStudy: '',
  startYear: '',
  graduationYear: '',
  currentlyStudying: false,
  grade: '',
  coursework: '',
  academicAchievements: '',
});

const EducationStep = ({ value: list, onChange }: EditorProps<Education[]>) => {
  const [expandedId, setExpandedId] = useState<string | null>(list[0]?.id ?? null);
  const update = (id: string, patch: Partial<Education>) => onChange(replaceById(list, id, patch));

  const add = () => {
    const edu = emptyEducation();
    onChange([...list, edu]);
    setExpandedId(edu.id);
  };

  return (
    <div className="wizard-step">
      {list.length === 0 && (
        <div className="empty-state">
          <h3>No education added yet</h3>
          <p>Add your qualifications to strengthen your CV.</p>
        </div>
      )}

      {list.map((edu, index) => {
        const title = edu.qualification || 'Untitled qualification';
        const dateError = dateRangeError(edu.startYear, edu.graduationYear, edu.currentlyStudying);
        return (
          <ItemCard
            key={edu.id}
            title={title}
            subtitle={[edu.institution || 'Institution', edu.fieldOfStudy].filter(Boolean).join(' • ')}
            expanded={expandedId === edu.id}
            onToggle={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            onRemove={() =>
              onChange(
                list.filter((item) => item.id !== edu.id),
                `Deleted "${title}"`,
              )
            }
            onMoveUp={index > 0 ? () => onChange(moveItem(list, index, -1)) : undefined}
            onMoveDown={index < list.length - 1 ? () => onChange(moveItem(list, index, 1)) : undefined}
          >
            <div className="form-grid">
              <FormField
                label="Qualification / degree"
                value={edu.qualification}
                onChange={(v) => update(edu.id, { qualification: v })}
                placeholder="e.g. Diploma in Information Technology"
                required
              />
              <FormField
                label="Institution"
                value={edu.institution}
                onChange={(v) => update(edu.id, { institution: v })}
                placeholder="e.g. University of Cape Town"
                required
              />
            </div>
            <FormField
              label="Field of study"
              value={edu.fieldOfStudy}
              onChange={(v) => update(edu.id, { fieldOfStudy: v })}
              placeholder="e.g. Computer Science"
              optional
            />
            <div className="form-grid form-grid-3">
              <FormField
                label="Start year"
                value={edu.startYear}
                onChange={(v) => update(edu.id, { startYear: v })}
                placeholder="e.g. 2022"
                inputMode="numeric"
              />
              {!edu.currentlyStudying && (
                <FormField
                  label="Graduation year"
                  value={edu.graduationYear}
                  onChange={(v) => update(edu.id, { graduationYear: v })}
                  placeholder="e.g. 2025"
                  inputMode="numeric"
                  error={dateError}
                  showError={Boolean(dateError)}
                />
              )}
              <div className="form-field checkbox-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={edu.currentlyStudying}
                    onChange={(e) => update(edu.id, { currentlyStudying: e.target.checked })}
                  />
                  Currently studying
                </label>
              </div>
            </div>
            <FormField
              label="Grade / GPA"
              value={edu.grade}
              onChange={(v) => update(edu.id, { grade: v })}
              placeholder="e.g. 3.8 / 4.0 or Cum Laude"
              optional
            />
            <FormField
              label="Relevant coursework"
              value={edu.coursework}
              onChange={(v) => update(edu.id, { coursework: v })}
              placeholder="e.g. Data Structures, Algorithms"
              optional
            />
            <FormField
              label="Academic achievements"
              value={edu.academicAchievements}
              onChange={(v) => update(edu.id, { academicAchievements: v })}
              placeholder="e.g. Dean's List"
              optional
            />
          </ItemCard>
        );
      })}

      <button type="button" className="btn-add-section" onClick={add}>
        <span className="plus-icon" aria-hidden="true">
          +
        </span>
        Add education
      </button>
    </div>
  );
};

export default EducationStep;
