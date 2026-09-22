import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, languages } = data;
  const softSkills = skills.filter((skill) => skill.category === 'soft');

  return (
    <div className="cv-template cv-executive" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-exec-header">
        <h1>
          <span>{(personalInfo.firstName || 'First').toUpperCase()}</span>
          <strong>{(personalInfo.lastName || 'Last').toUpperCase()}</strong>
        </h1>
        <p className="cv-exec-meta">
          {[personalInfo.email, personalInfo.linkedinUrl, personalInfo.city, personalInfo.phone].filter(Boolean).join(' | ')}
        </p>
      </header>

      {professionalSummary.summary && (
        <section className="cv-exec-section">
          <h2>Professional Profile</h2>
          <div className="cv-exec-profile">
            <p>{professionalSummary.summary}</p>
            {softSkills.length > 0 && (
              <aside>
                {softSkills.slice(0, 4).map((skill) => <p key={skill.id}>{skill.name}</p>)}
              </aside>
            )}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="cv-exec-section">
          <h2>Skills</h2>
          <p>{skills.map((skill) => skill.name).join('  •  ')}</p>
        </section>
      )}

      {workExperience.length > 0 && (
        <section className="cv-exec-section">
          <h2>Professional Experience</h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="cv-exec-exp">
              <div>
                <h3>{exp.jobTitle}</h3>
                <p>{exp.companyName}{exp.location ? ` | ${exp.location}` : ''}</p>
                <ul>
                  {exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
              <span>{formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="cv-exec-section">
          <h2>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-exec-exp">
              <div>
                <h3>{edu.qualification}</h3>
                <p>{edu.institution}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ''}</p>
              </div>
              <span>{edu.startYear} — {edu.currentlyStudying ? 'Present' : edu.graduationYear}</span>
            </div>
          ))}
        </section>
      )}

      {languages.length > 0 && (
        <section className="cv-exec-section">
          <h2>Languages</h2>
          <p>{languages.map((lang) => `${lang.language} (${lang.level})`).join('  •  ')}</p>
        </section>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
