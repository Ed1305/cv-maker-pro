import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const ElegantTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, certifications, languages, references, includeReferences } = data;
  const technicalSkills = skills.filter((skill) => skill.category !== 'soft');
  const softSkills = skills.filter((skill) => skill.category === 'soft');

  return (
    <div className="cv-template cv-elegant" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-header-elegant">
        <div>
          <h1 className="cv-name-elegant">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="cv-subtitle-elegant">{personalInfo.professionalTitle}</p>
        </div>
        <div className="cv-header-elegant-right">
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.city && <p>{personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ''}</p>}
        </div>
      </header>

      <div className="cv-divider-elegant" />

      {professionalSummary.summary && (
        <section className="cv-summary-elegant">
          <h2 className="cv-section-title-elegant">Personal Profile</h2>
          <div className="cv-elegant-underline" />
          <p>{professionalSummary.summary}</p>
        </section>
      )}

      <div className="cv-body-elegant">
        <div className="cv-left-elegant">
          {education.length > 0 && (
            <section className="cv-section-elegant">
              <h2 className="cv-section-title-elegant">Education</h2>
              <div className="cv-elegant-underline" />
              {education.map((edu) => (
                <div key={edu.id} className="cv-edu-elegant">
                  <p className="cv-edu-elegant-degree">{edu.qualification}</p>
                  <p className="cv-edu-elegant-school">{edu.institution}</p>
                  <p className="cv-edu-elegant-years">{edu.startYear} — {edu.currentlyStudying ? 'Present' : edu.graduationYear}</p>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section className="cv-section-elegant">
              <h2 className="cv-section-title-elegant">Skills</h2>
              <div className="cv-elegant-underline" />
              {softSkills.length > 0 && <h3 className="cv-elegant-subsection">Professional</h3>}
              {softSkills.map((skill) => <p key={skill.id} className="cv-elegant-skill">{skill.name}</p>)}
              {technicalSkills.length > 0 && <h3 className="cv-elegant-subsection">Technical</h3>}
              {technicalSkills.map((skill) => <p key={skill.id} className="cv-elegant-skill">{skill.name}</p>)}
            </section>
          )}

          {languages.length > 0 && (
            <section className="cv-section-elegant">
              <h2 className="cv-section-title-elegant">Languages</h2>
              <div className="cv-elegant-underline" />
              {languages.map((lang) => <p key={lang.id} className="cv-elegant-skill">{lang.language} — {lang.level}</p>)}
            </section>
          )}
        </div>

        <div className="cv-right-elegant">
          {workExperience.length > 0 && (
            <section className="cv-section-elegant">
              <h2 className="cv-section-title-elegant">Work Experience</h2>
              <div className="cv-elegant-underline" />
              {workExperience.map((exp) => (
                <div key={exp.id} className="cv-exp-elegant">
                  <div className="cv-exp-elegant-dot" />
                  <h3 className="cv-exp-elegant-company">{exp.companyName}</h3>
                  <p className="cv-exp-elegant-location">{exp.location}</p>
                  <p className="cv-exp-elegant-title">{exp.jobTitle}</p>
                  <div className="cv-exp-elegant-dates">
                    {formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                  </div>
                  <p className="cv-exp-elegant-desc">{exp.responsibilities.filter(Boolean).join('. ')}</p>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section className="cv-section-elegant">
              <h2 className="cv-section-title-elegant">Certifications</h2>
              <div className="cv-elegant-underline" />
              {certifications.map((cert) => (
                <div key={cert.id} className="cv-cert-elegant">
                  <p><strong>{cert.name}</strong></p>
                  <p>{cert.organization} — {formatDate(cert.dateObtained)}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {includeReferences && references.length > 0 ? (
        <section className="cv-references-elegant">
          <h2 className="cv-section-title-elegant">References</h2>
          <div className="cv-elegant-underline" />
          <div className="cv-ref-grid">
            {references.map((ref) => (
              <div key={ref.id} className="cv-ref-item">
                <p><strong>{ref.name}</strong></p>
                <p>{ref.position}, {ref.company}</p>
                {ref.phone && <p>P: {ref.phone}</p>}
                {ref.email && <p>E: {ref.email}</p>}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="cv-ref-note-elegant">References available upon request</p>
      )}
    </div>
  );
};

export default ElegantTemplate;
