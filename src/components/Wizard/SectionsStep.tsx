import React, { useState } from 'react';
import { CVData, SectionId } from '../../types/cv';
import { SECTION_OPTIONS, getSectionTitle } from '../../data/sectionOptions';
import { generateId } from '../../utils/helpers';
import EducationStep from './EducationStep';
import ExperienceStep from './ExperienceStep';
import SkillsStep from './SkillsStep';
import ProjectsStep from './ProjectsStep';
import {
  AwardsEditor,
  CertificatesEditor,
  CoursesEditor,
  CustomEditor,
  DeclarationEditor,
  InterestsEditor,
  LanguagesEditor,
  OrganisationsEditor,
  PublicationsEditor,
  ReferencesEditor,
} from './SectionEditors';

interface SectionsStepProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const SectionsStep: React.FC<SectionsStepProps> = ({ data, onChange }) => {
  const [editing, setEditing] = useState<SectionId | null>(null);

  const enableSection = (id: SectionId) => {
    const next = data.enabledSections.includes(id) ? data.enabledSections : [...data.enabledSections, id];
    const updates: Partial<CVData> = { enabledSections: next };

    if (id === 'custom' && data.customSections.length === 0) {
      updates.customSections = [{ id: generateId(), title: '', content: '' }];
    }

    onChange({ ...data, ...updates });
    setEditing(id);
  };

  const removeSection = (id: SectionId) => {
    onChange({
      ...data,
      enabledSections: data.enabledSections.filter((section) => section !== id),
    });
    if (editing === id) setEditing(null);
  };

  const available = SECTION_OPTIONS.filter((option) => option.id === 'custom' || !data.enabledSections.includes(option.id));
  const added = SECTION_OPTIONS.filter((option) => data.enabledSections.includes(option.id));

  if (editing) {
    return (
      <div className="wizard-step">
        <button type="button" className="btn-back-sections" onClick={() => setEditing(null)}>
          ← All sections
        </button>
        {editing === 'education' && <EducationStep data={data.education} onChange={(value) => onChange({ ...data, education: value })} />}
        {editing === 'experience' && <ExperienceStep data={data.workExperience} onChange={(value) => onChange({ ...data, workExperience: value })} />}
        {editing === 'skills' && <SkillsStep data={data.skills} onChange={(value) => onChange({ ...data, skills: value })} />}
        {editing === 'projects' && <ProjectsStep data={data.projects} onChange={(value) => onChange({ ...data, projects: value })} />}
        {editing === 'languages' && (
          <>
            <div className="step-header">
              <h2>Languages</h2>
              <p>Add your languages and proficiency level.</p>
            </div>
            <LanguagesEditor data={data.languages} onChange={(value) => onChange({ ...data, languages: value })} />
          </>
        )}
        {editing === 'certificates' && (
          <>
            <div className="step-header">
              <h2>Certificates</h2>
              <p>Add industry certificates or licences.</p>
            </div>
            <CertificatesEditor data={data.certifications} onChange={(value) => onChange({ ...data, certifications: value })} />
          </>
        )}
        {editing === 'interests' && (
          <>
            <div className="step-header">
              <h2>Interests</h2>
              <p>Add interests that support your career story.</p>
            </div>
            <InterestsEditor data={data.interests} onChange={(value) => onChange({ ...data, interests: value })} />
          </>
        )}
        {editing === 'courses' && (
          <>
            <div className="step-header">
              <h2>Courses</h2>
              <p>Add online or in-person courses and training.</p>
            </div>
            <CoursesEditor data={data.courses} onChange={(value) => onChange({ ...data, courses: value })} />
          </>
        )}
        {editing === 'awards' && (
          <>
            <div className="step-header">
              <h2>Awards</h2>
              <p>Add awards and recognitions.</p>
            </div>
            <AwardsEditor data={data.achievements} onChange={(value) => onChange({ ...data, achievements: value })} />
          </>
        )}
        {editing === 'organisations' && (
          <>
            <div className="step-header">
              <h2>Organisations</h2>
              <p>Add memberships or volunteering.</p>
            </div>
            <OrganisationsEditor data={data.volunteerExperience} onChange={(value) => onChange({ ...data, volunteerExperience: value })} />
          </>
        )}
        {editing === 'publications' && (
          <>
            <div className="step-header">
              <h2>Publications</h2>
              <p>Add publications, articles, or books.</p>
            </div>
            <PublicationsEditor data={data.publications} onChange={(value) => onChange({ ...data, publications: value })} />
          </>
        )}
        {editing === 'references' && (
          <>
            <div className="step-header">
              <h2>References</h2>
              <p>Add references or keep them available on request.</p>
            </div>
            <ReferencesEditor
              data={data.references}
              includeReferences={data.includeReferences}
              onChange={(value) => onChange({ ...data, references: value })}
              onIncludeChange={(value) => onChange({ ...data, includeReferences: value })}
            />
          </>
        )}
        {editing === 'declaration' && (
          <>
            <div className="step-header">
              <h2>Declaration</h2>
              <p>Add a short personal declaration.</p>
            </div>
            <DeclarationEditor value={data.declaration} onChange={(value) => onChange({ ...data, declaration: value })} />
          </>
        )}
        {editing === 'custom' && (
          <>
            <div className="step-header">
              <h2>Custom</h2>
              <p>Add any extra section you need.</p>
            </div>
            <CustomEditor data={data.customSections} onChange={(value) => onChange({ ...data, customSections: value })} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Add sections</h2>
        <p>Keep the CV simple. Add only the sections you need — the preview updates immediately.</p>
      </div>

      {added.length > 0 && (
        <div className="added-sections">
          <h3>On your CV</h3>
          <div className="added-section-list">
            {added.map((section) => (
              <div key={section.id} className="added-section-row">
                <span className="added-section-icon">{section.icon}</span>
                <span className="added-section-name">{getSectionTitle(section.id)}</span>
                <button type="button" className="btn-text" onClick={() => setEditing(section.id)}>Edit</button>
                <button type="button" className="btn-text btn-remove-section" onClick={() => removeSection(section.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {available.length > 0 && (
        <>
          <h3 className="section-options-heading">{added.length > 0 ? 'Add more' : 'Choose sections'}</h3>
          <div className="section-options-grid">
            {available.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`section-option-card ${option.id === 'custom' ? 'is-custom' : ''}`}
                onClick={() => enableSection(option.id)}
              >
                <span className="section-option-icon">{option.icon}</span>
                <span className="section-option-title">{option.title}</span>
                <span className="section-option-desc">{option.description}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SectionsStep;
