import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const ModernTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, certifications, languages } = data;
  const softSkills = skills.filter((skill) => skill.category === 'soft');
  const technicalSkills = skills.filter((skill) => skill.category !== 'soft');

  return (
    <div className="cv-template cv-modern" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-header-modern">
        {personalInfo.photoUrl && (
          <div className="cv-photo-modern">
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} />
          </div>
        )}
        <div className="cv-header-modern-right">
          <h1 className="cv-name-modern">
            <span className="first-name">{personalInfo.firstName || 'First'}</span>
            <span className="last-name">{personalInfo.lastName || 'Last'}</span>
          </h1>
          {personalInfo.professionalTitle && <div className="cv-title-badge">{personalInfo.professionalTitle}</div>}
        </div>
      </header>

      <div className="cv-contact-modern">
        <div className="cv-contact-left">
          <h2 className="cv-section-title-modern">Contact Info</h2>
          {personalInfo.email && <p>• {personalInfo.email}</p>}
          {personalInfo.phone && <p>• {personalInfo.phone}</p>}
          {personalInfo.portfolioUrl && <p>• {personalInfo.portfolioUrl}</p>}
          {personalInfo.city && <p>• {personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ''}</p>}
        </div>
        <div className="cv-contact-right">
          {professionalSummary.summary && <p className="cv-summary-modern">{professionalSummary.summary}</p>}
        </div>
      </div>

      <div className="cv-divider-modern" />

      <div className="cv-body-modern">
        <div className="cv-left-modern">
          {skills.length > 0 && (
            <section className="cv-section-modern">
              <h2 className="cv-section-title-modern">Skills</h2>
              {softSkills.length > 0 && (
                <>
                  <h3 className="cv-subsection-title">Professional</h3>
                  <ul className="cv-skill-list-modern">{softSkills.map((skill) => <li key={skill.id}>• {skill.name}</li>)}</ul>
                </>
              )}
              {technicalSkills.length > 0 && (
                <>
                  <h3 className="cv-subsection-title">Technical</h3>
                  <ul className="cv-skill-list-modern">{technicalSkills.map((skill) => <li key={skill.id}>• {skill.name}</li>)}</ul>
                </>
              )}
            </section>
          )}

          {education.length > 0 && (
            <section className="cv-section-modern">
              <h2 className="cv-section-title-modern">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="cv-edu-modern">
                  <p className="cv-edu-years">{edu.startYear} — {edu.currentlyStudying ? 'Present' : edu.graduationYear}</p>
                  <p className="cv-edu-degree">{edu.qualification}</p>
                  <p className="cv-edu-school">{edu.institution}</p>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section className="cv-section-modern">
              <h2 className="cv-section-title-modern">Languages</h2>
              {languages.map((lang) => <p key={lang.id} className="cv-lang-item">• {lang.language} — {lang.level}</p>)}
            </section>
          )}
        </div>

        <div className="cv-right-modern">
          {workExperience.length > 0 && (
            <section className="cv-section-modern">
              <h2 className="cv-section-title-modern">Experience</h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="cv-exp-modern">
                  <p className="cv-exp-dates">{formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Current' : formatDate(exp.endDate)}</p>
                  <h3 className="cv-exp-job">{exp.jobTitle} — {exp.companyName}</h3>
                  <ul className="cv-exp-bullets">
                    {exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>• {item}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section className="cv-section-modern">
              <h2 className="cv-section-title-modern">Certifications</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="cv-cert-item">
                  <p><strong>{cert.name}</strong> — {cert.organization}</p>
                  {cert.dateObtained && <p className="cv-cert-date">{formatDate(cert.dateObtained)}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
