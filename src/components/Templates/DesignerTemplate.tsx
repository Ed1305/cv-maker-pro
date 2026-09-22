import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const DesignerTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills } = data;
  const softSkills = skills.filter((skill) => skill.category === 'soft');
  const technicalSkills = skills.filter((skill) => skill.category !== 'soft');

  return (
    <div className="cv-template cv-designer" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-designer-header">
        {personalInfo.photoUrl && (
          <div className="cv-designer-photo">
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} />
          </div>
        )}
        <div className="cv-designer-namewrap">
          <div className="cv-designer-bar" />
          <h1>
            {(personalInfo.firstName || 'First').toUpperCase()}
            <br />
            {(personalInfo.lastName || 'Last').toUpperCase()}
          </h1>
          <p className="cv-designer-title">{personalInfo.professionalTitle}</p>
          <div className="cv-designer-contact">
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.city && <p>{personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ''}</p>}
          </div>
        </div>
      </header>

      {professionalSummary.summary && (
        <section className="cv-designer-profile">
          <h2>Profile</h2>
          <p>{professionalSummary.summary}</p>
        </section>
      )}

      <div className="cv-designer-body">
        <aside>
          {education.length > 0 && (
            <section>
              <h2>Education</h2>
              {education.map((edu) => (
                <div key={edu.id}>
                  <p><strong>{edu.qualification}</strong></p>
                  <p>{edu.institution}</p>
                  <p className="muted">{edu.startYear} — {edu.currentlyStudying ? 'Present' : edu.graduationYear}</p>
                </div>
              ))}
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2>Skills</h2>
              {softSkills.length > 0 && <p className="muted">Professional</p>}
              {softSkills.map((skill) => <p key={skill.id}>{skill.name}</p>)}
              {technicalSkills.length > 0 && <p className="muted">Technical</p>}
              {technicalSkills.map((skill) => <p key={skill.id}>{skill.name}</p>)}
            </section>
          )}
        </aside>
        <main>
          {workExperience.length > 0 && (
            <section>
              <h2>Experience</h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="cv-designer-exp">
                  <h3>{exp.jobTitle} | {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</h3>
                  <p>{exp.companyName}</p>
                  <ul>{exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}</ul>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DesignerTemplate;
