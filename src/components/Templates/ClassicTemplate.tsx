import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, languages, references, includeReferences } = data;
  const technicalSkills = skills.filter((skill) => skill.category !== 'soft');
  const softSkills = skills.filter((skill) => skill.category === 'soft');

  return (
    <div className="cv-template cv-classic" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-header-classic">
        {personalInfo.photoUrl && (
          <div className="cv-photo-circle">
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} />
          </div>
        )}
        <div className="cv-name-section">
          <h1 className="cv-name">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="cv-title">{personalInfo.professionalTitle || 'Professional Title'}</p>
        </div>
      </header>

      <div className="cv-body-classic">
        <div className="cv-left-column">
          {professionalSummary.summary && (
            <section className="cv-section">
              <h2 className="cv-section-title">Personal Summary</h2>
              <div className="cv-divider" />
              <p className="cv-text">{professionalSummary.summary}</p>
            </section>
          )}

          {workExperience.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">Experience</h2>
              <div className="cv-divider" />
              {workExperience.map((exp) => (
                <div key={exp.id} className="cv-experience-item">
                  <h3 className="cv-exp-title">{exp.jobTitle}</h3>
                  <p className="cv-exp-company">
                    {exp.companyName}
                    {exp.location ? ` / ${exp.location}` : ''} / {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'present' : formatDate(exp.endDate)}
                  </p>
                  <ul className="cv-list">
                    {exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}
                    {exp.achievements.filter(Boolean).map((item, index) => <li key={`a-${index}`}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">Education</h2>
              <div className="cv-divider" />
              {education.map((edu) => (
                <div key={edu.id} className="cv-education-item">
                  <h3 className="cv-edu-title">{edu.institution}</h3>
                  <p className="cv-edu-detail">{edu.qualification} / {edu.startYear} - {edu.currentlyStudying ? 'Present' : edu.graduationYear}</p>
                  {edu.coursework && <p className="cv-text cv-text-sm">{edu.coursework}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="cv-right-column">
          <section className="cv-section">
            <h2 className="cv-section-title">Contact Details</h2>
            <div className="cv-divider" />
            <div className="cv-contact-list">
              {(personalInfo.address || personalInfo.city) && (
                <p>{[personalInfo.address, personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</p>
              )}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.portfolioUrl && <p>{personalInfo.portfolioUrl}</p>}
            </div>
          </section>

          {softSkills.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">Personal Skills</h2>
              <div className="cv-divider" />
              <ul className="cv-skill-list">{softSkills.map((skill) => <li key={skill.id}>{skill.name}</li>)}</ul>
            </section>
          )}

          {technicalSkills.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">Expertise</h2>
              <div className="cv-divider" />
              <ul className="cv-skill-list">{technicalSkills.map((skill) => <li key={skill.id}>{skill.name}</li>)}</ul>
            </section>
          )}

          {languages.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">Languages</h2>
              <div className="cv-divider" />
              <ul className="cv-skill-list">{languages.map((lang) => <li key={lang.id}>{lang.language} — {lang.level}</li>)}</ul>
            </section>
          )}

          {(personalInfo.linkedinUrl || personalInfo.githubUrl || personalInfo.portfolioUrl) && (
            <section className="cv-section">
              <h2 className="cv-section-title">Portfolio Link</h2>
              <div className="cv-divider" />
              {personalInfo.linkedinUrl && <p className="cv-link-item">{personalInfo.linkedinUrl}</p>}
              {personalInfo.githubUrl && <p className="cv-link-item">{personalInfo.githubUrl}</p>}
              {personalInfo.portfolioUrl && <p className="cv-link-item">{personalInfo.portfolioUrl}</p>}
            </section>
          )}

          {includeReferences && references.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title">References</h2>
              <div className="cv-divider" />
              {references.map((ref) => (
                <p key={ref.id} className="cv-text-sm">{ref.name} — {ref.position}, {ref.company}</p>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
