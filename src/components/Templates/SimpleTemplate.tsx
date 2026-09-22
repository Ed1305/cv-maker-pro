import React from 'react';
import { CVData, SectionId } from '../../types/cv';
import { formatDate } from '../../utils/helpers';

interface TemplateProps {
  data: CVData;
  scale?: number;
}

const yearRange = (start: string, end: string, current?: boolean) => {
  const left = start || '';
  const right = current ? 'Present' : end;
  if (!left && !right) return '';
  if (!right) return left;
  if (!left) return right;
  return `${left}–${right}`;
};

const SimpleTemplate: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const {
    personalInfo,
    professionalSummary,
    workExperience,
    education,
    skills,
    projects,
    certifications,
    languages,
    achievements,
    volunteerExperience,
    references,
    includeReferences,
    interests,
    courses,
    publications,
    customSections,
    declaration,
    enabledSections,
  } = data;

  const location = [personalInfo.city, personalInfo.country].filter(Boolean).join(', ')
    || personalInfo.address;

  const isOn = (id: SectionId) => enabledSections.includes(id);

  return (
    <div className="cv-template cv-simple" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
      <header className="cv-simple-header">
        <h1>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.professionalTitle && <p className="cv-simple-title">{personalInfo.professionalTitle}</p>}
        <div className="cv-simple-contact">
          {personalInfo.phone && (
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.email && (
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {personalInfo.email}
            </span>
          )}
          {location && (
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {location}
            </span>
          )}
          {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
        </div>
      </header>

      <div className="cv-simple-rule" />

      {professionalSummary.summary && (
        <section className="cv-simple-section">
          <h2>About Me</h2>
          <p>{professionalSummary.summary}</p>
        </section>
      )}

      {isOn('education') && education.length > 0 && (
        <section className="cv-simple-section">
          <h2>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[edu.institution, yearRange(edu.startYear, edu.graduationYear, edu.currentlyStudying)].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">
                {[edu.qualification, edu.fieldOfStudy].filter(Boolean).join(' — ')}
              </p>
              {(edu.coursework || edu.academicAchievements || edu.grade) && (
                <p>
                  {[edu.grade && `Grade: ${edu.grade}`, edu.coursework, edu.academicAchievements].filter(Boolean).join(' ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {isOn('experience') && workExperience.length > 0 && (
        <section className="cv-simple-section">
          <h2>Work Experience</h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[exp.companyName, yearRange(formatDate(exp.startDate), formatDate(exp.endDate), exp.currentlyWorking)].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">{exp.jobTitle}</p>
              <ul>
                {exp.responsibilities.filter(Boolean).map((item, index) => <li key={`r-${index}`}>{item}</li>)}
                {exp.achievements.filter(Boolean).map((item, index) => <li key={`a-${index}`}>{item}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {isOn('skills') && skills.length > 0 && (
        <section className="cv-simple-section">
          <h2>Skills</h2>
          <ul className="cv-simple-skills">
            {skills.map((skill) => <li key={skill.id}>{skill.name}</li>)}
          </ul>
        </section>
      )}

      {isOn('languages') && languages.length > 0 && (
        <section className="cv-simple-section">
          <h2>Languages</h2>
          <ul className="cv-simple-skills">
            {languages.map((lang) => (
              <li key={lang.id}>{lang.language}{lang.level ? ` — ${lang.level}` : ''}</li>
            ))}
          </ul>
        </section>
      )}

      {isOn('certificates') && certifications.length > 0 && (
        <section className="cv-simple-section">
          <h2>Certificates</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[cert.organization, formatDate(cert.dateObtained)].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">{cert.name}</p>
            </div>
          ))}
        </section>
      )}

      {isOn('interests') && interests.length > 0 && (
        <section className="cv-simple-section">
          <h2>Interests</h2>
          <ul className="cv-simple-skills">
            {interests.map((item) => <li key={item.id}>{item.name}</li>)}
          </ul>
        </section>
      )}

      {isOn('projects') && projects.length > 0 && (
        <section className="cv-simple-section">
          <h2>Projects</h2>
          {projects.map((project) => (
            <div key={project.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[project.role || project.technologies, formatDate(project.date)].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">{project.name}</p>
              {project.description && <p>{project.description}</p>}
            </div>
          ))}
        </section>
      )}

      {isOn('courses') && courses.length > 0 && (
        <section className="cv-simple-section">
          <h2>Courses</h2>
          {courses.map((course) => (
            <div key={course.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[course.organization, formatDate(course.date)].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">{course.name}</p>
            </div>
          ))}
        </section>
      )}

      {isOn('awards') && achievements.length > 0 && (
        <section className="cv-simple-section">
          <h2>Awards</h2>
          {achievements.map((award) => (
            <div key={award.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[award.organization, formatDate(award.date)].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">{award.title}</p>
              {award.description && <p>{award.description}</p>}
            </div>
          ))}
        </section>
      )}

      {isOn('organisations') && volunteerExperience.length > 0 && (
        <section className="cv-simple-section">
          <h2>Organisations</h2>
          {volunteerExperience.map((org) => (
            <div key={org.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[org.organization, yearRange(formatDate(org.startDate), formatDate(org.endDate))].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">{org.role}</p>
              <ul>
                {org.responsibilities.filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {isOn('publications') && publications.length > 0 && (
        <section className="cv-simple-section">
          <h2>Publications</h2>
          {publications.map((pub) => (
            <div key={pub.id} className="cv-simple-item">
              <p className="cv-simple-item-meta">
                {[pub.publisher, formatDate(pub.date)].filter(Boolean).join(' | ')}
              </p>
              <p className="cv-simple-item-title">{pub.title}</p>
            </div>
          ))}
        </section>
      )}

      {isOn('references') && (
        <section className="cv-simple-section">
          <h2>References</h2>
          {includeReferences && references.length > 0 ? (
            references.map((ref) => (
              <div key={ref.id} className="cv-simple-item">
                <p className="cv-simple-item-title">{ref.name}</p>
                <p>{[ref.position, ref.company].filter(Boolean).join(', ')}</p>
                <p>{[ref.phone, ref.email].filter(Boolean).join(' • ')}</p>
              </div>
            ))
          ) : (
            <p>References available upon request.</p>
          )}
        </section>
      )}

      {isOn('declaration') && declaration && (
        <section className="cv-simple-section">
          <h2>Declaration</h2>
          <p>{declaration}</p>
        </section>
      )}

      {isOn('custom') && customSections.filter((section) => section.title || section.content).map((section) => (
        <section key={section.id} className="cv-simple-section">
          <h2>{section.title || 'Custom'}</h2>
          {section.content && <p>{section.content}</p>}
        </section>
      ))}
    </div>
  );
};

export default SimpleTemplate;
