import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const MedicalTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, certifications, languages } = data;

  return (
    <div className="cv-template cv-medical" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-header-medical">
        {personalInfo.photoUrl && (
          <div className="cv-photo-medical">
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} />
          </div>
        )}
        <div>
          <h1 className="cv-name-medical">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="cv-title-medical">{personalInfo.professionalTitle}</p>
          {(personalInfo.address || personalInfo.city) && (
            <p className="cv-subtitle-medical">{[personalInfo.address, personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</p>
          )}
        </div>
      </header>

      <div className="cv-body-medical">
        <aside className="cv-left-medical">
          {certifications.length > 0 && (
            <section className="cv-section-medical">
              <h2 className="cv-section-title-medical">Professional <span className="highlight-blue">Certifications</span></h2>
              {certifications.map((cert) => <p key={cert.id} className="cv-medical-item">{cert.name} — {cert.organization}</p>)}
            </section>
          )}

          {languages.length > 0 && (
            <section className="cv-section-medical">
              <h2 className="cv-section-title-medical">Languages</h2>
              {languages.map((lang) => <p key={lang.id} className="cv-medical-item">• {lang.language} — {lang.level}</p>)}
            </section>
          )}

          <section className="cv-section-medical">
            <h2 className="cv-section-title-medical">Contact</h2>
            {personalInfo.phone && <p className="cv-medical-item">{personalInfo.phone}</p>}
            {personalInfo.email && <p className="cv-medical-item">{personalInfo.email}</p>}
            {personalInfo.linkedinUrl && <p className="cv-medical-item">LinkedIn</p>}
          </section>
        </aside>

        <main className="cv-right-medical">
          {professionalSummary.summary && (
            <section className="cv-section-medical">
              <h2 className="cv-section-title-medical">Summary</h2>
              <p className="cv-text-medical">{professionalSummary.summary}</p>
            </section>
          )}

          {workExperience.length > 0 && (
            <section className="cv-section-medical">
              <h2 className="cv-section-title-medical">Professional <span className="highlight-blue">Experience</span></h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="cv-exp-medical">
                  <h3>{exp.companyName}</h3>
                  <p className="cv-exp-medical-title">{exp.jobTitle} — {formatDate(exp.startDate)} to {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</p>
                  <ul>{exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>• {item}</li>)}</ul>
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="cv-section-medical">
              <h2 className="cv-section-title-medical">Education and <span className="highlight-blue">Training</span></h2>
              <ul>
                {education.map((edu) => (
                  <li key={edu.id}>{edu.qualification}{edu.fieldOfStudy ? `: ${edu.fieldOfStudy}, ` : ': '}{edu.institution} — {edu.graduationYear || edu.startYear}</li>
                ))}
              </ul>
            </section>
          )}

          {skills.length > 0 && (
            <section className="cv-section-medical">
              <h2 className="cv-section-title-medical">Skills and <span className="highlight-blue">Expertise</span></h2>
              <ul className="cv-skills-medical">{skills.map((skill) => <li key={skill.id}>• {skill.name}</li>)}</ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MedicalTemplate;
