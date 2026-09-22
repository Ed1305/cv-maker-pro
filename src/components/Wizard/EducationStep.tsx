import React, { useState } from 'react';
import FormField from '../UI/FormField';
import { Education } from '../../types/cv';
import { generateId } from '../../utils/helpers';

interface EducationStepProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationStep: React.FC<EducationStepProps> = ({ data, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      qualification: '',
      fieldOfStudy: '',
      startYear: '',
      graduationYear: '',
      currentlyStudying: false,
      grade: '',
      coursework: '',
      academicAchievements: '',
    };
    onChange([...data, newEdu]);
    setExpandedId(newEdu.id);
  };

  const updateEducation = (id: string, field: keyof Education, value: unknown) => {
    onChange(data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Education</h2>
        <p>Add your educational background, starting with your most recent qualification.</p>
      </div>

      {data.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No education added yet</h3>
          <p>Add your qualifications to strengthen your CV</p>
        </div>
      )}

      {data.map((edu) => (
        <div key={edu.id} className={`experience-card ${expandedId === edu.id ? 'expanded' : ''}`}>
          <div className="experience-card-header" onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}>
            <div className="experience-card-info">
              <h3>{edu.qualification || 'Untitled Qualification'}</h3>
              <p>{edu.institution || 'Institution'}{edu.fieldOfStudy ? ` • ${edu.fieldOfStudy}` : ''}</p>
            </div>
            <div className="experience-card-actions">
              <button type="button" className="btn-icon btn-delete" onClick={(e) => { e.stopPropagation(); onChange(data.filter((item) => item.id !== edu.id)); }}>🗑</button>
              <span className={`chevron ${expandedId === edu.id ? 'open' : ''}`}>▼</span>
            </div>
          </div>

          {expandedId === edu.id && (
            <div className="experience-card-body">
              <div className="form-grid">
                <FormField label="Qualification / Degree" value={edu.qualification} onChange={(v) => updateEducation(edu.id, 'qualification', v)} placeholder="e.g. Diploma in Information Technology" required />
                <FormField label="Institution" value={edu.institution} onChange={(v) => updateEducation(edu.id, 'institution', v)} placeholder="e.g. Cape Peninsula University of Technology" required />
              </div>
              <FormField label="Field of Study" value={edu.fieldOfStudy} onChange={(v) => updateEducation(edu.id, 'fieldOfStudy', v)} placeholder="e.g. Computer Science, Information Technology" />
              <div className="form-grid form-grid-3">
                <FormField label="Start Year" value={edu.startYear} onChange={(v) => updateEducation(edu.id, 'startYear', v)} placeholder="e.g. 2022" />
                {!edu.currentlyStudying && (
                  <FormField label="Graduation Year" value={edu.graduationYear} onChange={(v) => updateEducation(edu.id, 'graduationYear', v)} placeholder="e.g. 2025" />
                )}
                <div className="form-field checkbox-field">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={edu.currentlyStudying} onChange={(e) => updateEducation(edu.id, 'currentlyStudying', e.target.checked)} />
                    Currently studying
                  </label>
                </div>
              </div>
              <FormField label="Grade / GPA" value={edu.grade} onChange={(v) => updateEducation(edu.id, 'grade', v)} placeholder="e.g. 3.8 / 4.0 or Cum Laude" optional />
              <FormField label="Relevant Coursework" value={edu.coursework} onChange={(v) => updateEducation(edu.id, 'coursework', v)} placeholder="e.g. Data Structures, Algorithms, Database Systems" optional />
              <FormField label="Academic Achievements" value={edu.academicAchievements} onChange={(v) => updateEducation(edu.id, 'academicAchievements', v)} placeholder="e.g. Dean's List, Academic Excellence Award" optional />
            </div>
          )}
        </div>
      ))}

      <button type="button" className="btn-add-section" onClick={addEducation}>
        <span className="plus-icon">+</span>
        Add Education
      </button>
    </div>
  );
};

export default EducationStep;
