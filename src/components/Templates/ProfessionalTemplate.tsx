import React from 'react';
import { CVData } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const { personalInfo, professionalSummary, workExperience, skills, achievements, references, includeReferences, projects } = data;
  const technicalSkills = skills.filter((skill) => skill.category !== 'soft');

  return (
    <div className="cv-template cv-professional" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-header-pro-min">
        <div className="cv-pro-min-contact">
          {personalInfo.phone && <p>P: {personalInfo.phone}</p>}
          {personalInfo.email && <p>E: {personalInfo.email}</p>}
          {personalInfo.city && <p>{personalInfo.city}{personalInfo.country ? `, ${personalInfo.country}` : ''}</p>}
          {personalInfo.portfolioUrl && <p>{personalInfo.portfolioUrl}</p>}
        </div>
        <div className="cv-pro-min-nameblock">
          <h1>
            <span>{personalInfo.firstName || 'First'}</span>
            <strong>{personalInfo.lastName || 'Last'}</strong>
          </h1>
          <p>{personalInfo.professionalTitle}</p>
        </div>
      </header>

      {professionalSummary.summary && <p className="cv-pro-min-summary">{professionalSummary.summary}</p>}

      <div className="cv-pro-min-body">
        <aside>
          {achievements.length > 0 && (
            <section>
              <h2>Award</h2>
              {achievements.map((item) => (
                <div key={item.id} className="cv-pro-min-block">
                  <p className="muted">{formatDate(item.date)}</p>
                  <p><strong>{item.title}</strong></p>
                  <p>{item.organization}</p>
                </div>
              ))}
            </section>
          )}

          {technicalSkills.length > 0 && (
            <section>
              <h2>Skills</h2>
              <p className="muted">Technical</p>
              <ul>{technicalSkills.map((skill) => <li key={skill.id}>{skill.name}</li>)}</ul>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2>Interests</h2>
              <ul>{projects.map((project) => <li key={project.id}>{project.name}</li>)}</ul>
            </section>
          )}
        </aside>

        <main>
          {workExperience.length > 0 && (
            <section>
              <h2>Experience</h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="cv-pro-min-exp">
                  <p className="muted">{formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}</p>
                  <h3>{exp.jobTitle} — {exp.companyName}</h3>
                  <ul>
                    {exp.responsibilities.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {includeReferences && references.length > 0 && (
            <section>
              <h2>References</h2>
              <div className="cv-pro-min-refs">
                {references.map((ref) => (
                  <div key={ref.id}>
                    <p><strong>{ref.name}</strong></p>
                    <p>{ref.position} / {ref.company}</p>
                    <p>P: {ref.phone}</p>
                    <p>E: {ref.email}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {!includeReferences && <p className="cv-ref-note">References available upon request</p>}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
