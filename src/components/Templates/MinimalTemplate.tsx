import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const MinimalTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, certifications, languages } = data;

  return (
    <div className="cv-template cv-minimal" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header>
        <h1>{personalInfo.fullName || 'Your Name'}</h1>
        <p className="cv-minimal-title">{personalInfo.professionalTitle}</p>
        <p className="cv-minimal-meta">
          {[personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.linkedinUrl].filter(Boolean).join('  •  ')}
        </p>
      </header>

      {professionalSummary.summary && (
        <section>
          <h2>Summary</h2>
          <p>{professionalSummary.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2>Skills</h2>
          <p>{skills.map((skill) => skill.name).join(', ')}</p>
        </section>
      )}

      {workExperience.length > 0 && (
        <section>
          <h2>Experience</h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="cv-minimal-item">
              <div className="cv-minimal-row">
                <strong>{exp.jobTitle}</strong>
                <span>{formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <p>{exp.companyName}{exp.location ? ` | ${exp.location}` : ''}</p>
              <ul>{exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}</ul>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-minimal-row">
              <div>
                <strong>{edu.qualification}</strong>
                <p>{edu.institution}</p>
              </div>
              <span>{edu.startYear} — {edu.currentlyStudying ? 'Present' : edu.graduationYear}</span>
            </div>
          ))}
        </section>
      )}

      {certifications.length > 0 && (
        <section>
          <h2>Certifications</h2>
          {certifications.map((cert) => <p key={cert.id}>{cert.name} — {cert.organization}</p>)}
        </section>
      )}

      {languages.length > 0 && (
        <section>
          <h2>Languages</h2>
          <p>{languages.map((lang) => `${lang.language} (${lang.level})`).join(', ')}</p>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
