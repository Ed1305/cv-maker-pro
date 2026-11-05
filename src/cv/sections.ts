import type { CVData, SectionId } from './schema';

export interface SectionMeta {
  /** Heading printed on the CV. */
  title: string;
  /** Short explanation shown when choosing sections. */
  description: string;
  /** Intro line shown above the section's editor. */
  intro: string;
  /** True when the section has nothing to print yet. */
  isEmpty: (data: CVData) => boolean;
}

const hasText = (value: string) => value.trim().length > 0;

export const SECTION_META: Record<SectionId, SectionMeta> = {
  experience: {
    title: 'Work Experience',
    description: 'Professional roles and employer history, including internships.',
    intro: 'Start with your most recent role. Describe what you did, then add results.',
    isEmpty: (d) => !d.workExperience.some((job) => hasText(job.jobTitle) || hasText(job.companyName)),
  },
  education: {
    title: 'Education',
    description: 'Degrees, diplomas and schools. Include your focus or honours.',
    intro: 'Add your qualifications, starting with the most recent.',
    isEmpty: (d) => !d.education.some((edu) => hasText(edu.qualification) || hasText(edu.institution)),
  },
  skills: {
    title: 'Skills',
    description: 'Hard and soft skills that help you stand out.',
    intro: 'Pick skills from the categories or add your own.',
    isEmpty: (d) => !d.skills.some((skill) => hasText(skill.name)),
  },
  languages: {
    title: 'Languages',
    description: 'Languages you speak and how well.',
    intro: 'Add your languages and proficiency level.',
    isEmpty: (d) => !d.languages.some((lang) => hasText(lang.language)),
  },
  certificates: {
    title: 'Certificates',
    description: 'Industry certificates or licences, with issuer and date.',
    intro: 'Add industry certificates or licences.',
    isEmpty: (d) => !d.certifications.some((cert) => hasText(cert.name)),
  },
  interests: {
    title: 'Interests',
    description: 'Personal interests that support your story.',
    intro: 'Add interests that support your career story.',
    isEmpty: (d) => !d.interests.some((item) => hasText(item.name)),
  },
  projects: {
    title: 'Projects',
    description: 'Key projects: the problem, your role and the impact.',
    intro: 'Showcase your best work — especially useful for developers and designers.',
    isEmpty: (d) => !d.projects.some((project) => hasText(project.name)),
  },
  courses: {
    title: 'Courses',
    description: 'Online or in-person courses and training.',
    intro: 'Add courses and training you completed.',
    isEmpty: (d) => !d.courses.some((course) => hasText(course.name)),
  },
  awards: {
    title: 'Awards',
    description: 'Awards and recognition from work, competitions or study.',
    intro: 'Add awards and recognition.',
    isEmpty: (d) => !d.achievements.some((award) => hasText(award.title)),
  },
  organisations: {
    title: 'Organisations',
    description: 'Memberships and volunteering, including your role.',
    intro: 'Add memberships or volunteer work.',
    isEmpty: (d) => !d.volunteerExperience.some((org) => hasText(org.organization) || hasText(org.role)),
  },
  publications: {
    title: 'Publications',
    description: 'Articles, papers or books you wrote or contributed to.',
    intro: 'Add publications, articles or books.',
    isEmpty: (d) => !d.publications.some((pub) => hasText(pub.title)),
  },
  references: {
    title: 'References',
    description: 'Managers or colleagues who can vouch for you.',
    intro: 'Add references, or show "available upon request".',
    // "Available upon request" is printed when details are off, so never empty.
    isEmpty: (d) => d.includeReferences && !d.references.some((ref) => hasText(ref.name)),
  },
  declaration: {
    title: 'Declaration',
    description: 'A short statement that your details are true.',
    intro: 'Add a short personal declaration.',
    isEmpty: (d) => !hasText(d.declaration),
  },
  custom: {
    title: 'Custom',
    description: 'Anything else you need — give it your own heading.',
    intro: 'Add any extra section you need.',
    isEmpty: (d) => !d.customSections.some((section) => hasText(section.title) || hasText(section.content)),
  },
};
