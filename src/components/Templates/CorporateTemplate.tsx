import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const CorporateTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, certifications, languages, references, includeReferences } = data;

  return (
    <div className="cv-template cv-corporate" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-header-corporate">
        <div>
          <h1 className="cv-name-corporate">
            <span className="cv-fname">{personalInfo.firstName || 'First'}</span>{' '}
            <span className="cv-lname">{personalInfo.lastName || 'Last'}</span>
          </h1>
          <p className="cv-title-corporate">{personalInfo.professionalTitle}</p>
        </div>
        <div className="cv-contact-corporate">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.city && <span>{personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ''}</span>}
          {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
        </div>
      </header>

      {professionalSummary.summary && (
        <section className="cv-section-corporate">
          <h2 className="cv-heading-corporate">Professional Profile</h2>
          <p className="cv-text-corporate">{professionalSummary.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="cv-section-corporate">
          <h2 className="cv-heading-corporate">Skills</h2>
          <div className="cv-skills-corporate">
            {skills.map((skill) => <span key={skill.id} className="cv-skill-corporate-item">{skill.name}</span>)}
          </div>
        </section>
      )}

      {workExperience.length > 0 && (
        <section className="cv-section-corporate">
          <h2 className="cv-heading-corporate">Professional Experience</h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="cv-exp-corporate">
              <div className="cv-exp-corporate-header">
                <div>
                  <h3 className="cv-exp-corporate-title">{exp.jobTitle}</h3>
                  <p className="cv-exp-corporate-company">{exp.companyName}{exp.location ? ` | ${exp.location}` : ''}</p>
                </div>
                <span className="cv-exp-corporate-dates">{formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <ul className="cv-exp-corporate-list">
                {exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}
              </ul>
              {exp.achievements.filter(Boolean).length > 0 && (
                <ul className="cv-exp-corporate-list achievements">
                  {exp.achievements.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="cv-section-corporate">
          <h2 className="cv-heading-corporate">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-edu-corporate">
              <div className="cv-edu-corporate-header">
                <div>
                  <h3>{edu.qualification}</h3>
                  <p>{edu.institution}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ''}</p>
                </div>
                <span>{edu.startYear} - {edu.currentlyStudying ? 'Present' : edu.graduationYear}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="cv-section-corporate">
          <h2 className="cv-heading-corporate">Certifications</h2>
          {certifications.map((cert) => (
            <p key={cert.id} className="cv-cert-corporate">{cert.name} — {cert.organization} ({formatDate(cert.dateObtained)})</p>
          ))}
        </section>
      )}

      {languages.length > 0 && (
        <section className="cv-section-corporate">
          <h2 className="cv-heading-corporate">Languages</h2>
          <div className="cv-langs-corporate">
            {languages.map((lang) => <span key={lang.id}>{lang.language} ({lang.level})</span>)}
          </div>
        </section>
      )}

      {includeReferences && references.length > 0 ? (
        <section className="cv-section-corporate">
          <h2 className="cv-heading-corporate">References</h2>
          <div className="cv-ref-grid-corporate">
            {references.map((ref) => (
              <div key={ref.id}>
                <p><strong>{ref.name}</strong></p>
                <p>{ref.position}, {ref.company}</p>
                <p>{ref.phone} | {ref.email}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="cv-ref-corporate">References available upon request</p>
      )}
    </div>
  );
};

export default CorporateTemplate;
