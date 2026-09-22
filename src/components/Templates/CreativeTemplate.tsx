import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const CreativeTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, achievements, references, includeReferences } = data;

  return (
    <div className="cv-template cv-creative" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-creative-header">
        {personalInfo.photoUrl && (
          <div className="cv-creative-photo">
            <img src={personalInfo.photoUrl} alt={personalInfo.fullName} />
          </div>
        )}
        <div>
          <p className="cv-creative-hello">Hello, I'm</p>
          <h1>{personalInfo.fullName || 'Your Name'}</h1>
          <p className="cv-creative-role">{personalInfo.professionalTitle}</p>
        </div>
      </header>

      <div className="cv-creative-grid">
        <section className="cv-creative-card">
          <h2>Contact</h2>
          {personalInfo.phone && <p><span /> {personalInfo.phone}</p>}
          {personalInfo.email && <p><span /> {personalInfo.email}</p>}
          {personalInfo.portfolioUrl && <p><span /> {personalInfo.portfolioUrl}</p>}
          {personalInfo.address && <p><span /> {personalInfo.address}</p>}
        </section>

        {professionalSummary.summary && (
          <section className="cv-creative-card">
            <h2>Personal Info</h2>
            <p>{professionalSummary.summary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section className="cv-creative-card">
            <h2>Skills & Expertise</h2>
            <div className="cv-creative-chips">
              {skills.map((skill) => <span key={skill.id}>{skill.name}</span>)}
            </div>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="cv-creative-card cv-creative-wide">
            <h2>Work Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="cv-creative-row">
                <span className="cv-creative-pill">{formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</span>
                <div>
                  <h3>{exp.jobTitle}</h3>
                  <p>{exp.companyName}{exp.location ? ` • ${exp.location}` : ''}</p>
                  <p>{exp.responsibilities.filter(Boolean).join('. ')}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="cv-creative-card">
            <h2>Education History</h2>
            {education.map((edu) => (
              <div key={edu.id} className="cv-creative-row">
                <span className="cv-creative-pill">{edu.startYear} - {edu.currentlyStudying ? 'Present' : edu.graduationYear}</span>
                <div>
                  <h3>{edu.qualification}</h3>
                  <p>{edu.institution}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {achievements.length > 0 && (
          <section className="cv-creative-card">
            <h2>Awards & Achievement</h2>
            {achievements.map((item) => (
              <div key={item.id} className="cv-creative-row">
                <span className="cv-creative-pill">{formatDate(item.date)}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.organization}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {includeReferences && references.length > 0 && (
          <section className="cv-creative-card">
            <h2>Reference</h2>
            {references.map((ref) => (
              <div key={ref.id}>
                <h3>{ref.name}</h3>
                <p>{ref.position}, {ref.company}</p>
                <p>{ref.email}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;
