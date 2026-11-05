import type { ReactNode } from 'react';
import type { CVData, SectionId } from '../cv/schema';
import EducationStep from '../components/Wizard/EducationStep';
import ExperienceStep from '../components/Wizard/ExperienceStep';
import ProjectsStep from '../components/Wizard/ProjectsStep';
import SkillsStep from '../components/Wizard/SkillsStep';
import {
  AwardsEditor,
  CertificatesEditor,
  CoursesEditor,
  CustomEditor,
  DeclarationEditor,
  InterestsEditor,
  LanguagesEditor,
  OrganisationsEditor,
  PublicationsEditor,
  ReferencesEditor,
} from '../components/Wizard/SectionEditors';

/**
 * UI for each optional CV section: its icon and its editor.
 * Titles, descriptions and "is it empty?" live in src/cv/sections.ts so that
 * non-UI code (validation, the PDF) can use them too.
 */

export type PatchCv = (patch: Partial<CVData>, undoLabel?: string) => void;

export interface SectionUi {
  icon: ReactNode;
  renderEditor: (data: CVData, patch: PatchCv) => ReactNode;
}

const icon = (path: string) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

/** Connects an editor for one CV field to the store. */
const field =
  <K extends keyof CVData>(key: K) =>
  (patch: PatchCv) =>
  (next: CVData[K], undoLabel?: string) =>
    patch({ [key]: next } as Partial<CVData>, undoLabel);

export const SECTION_UI: Record<SectionId, SectionUi> = {
  experience: {
    icon: icon('M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2 M4 8h16v12H4z'),
    renderEditor: (d, p) => <ExperienceStep value={d.workExperience} onChange={field('workExperience')(p)} />,
  },
  education: {
    icon: icon('M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5'),
    renderEditor: (d, p) => <EducationStep value={d.education} onChange={field('education')(p)} />,
  },
  skills: {
    icon: icon(
      'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
    ),
    renderEditor: (d, p) => <SkillsStep value={d.skills} onChange={field('skills')(p)} />,
  },
  languages: {
    icon: icon('M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20'),
    renderEditor: (d, p) => <LanguagesEditor value={d.languages} onChange={field('languages')(p)} />,
  },
  certificates: {
    icon: icon('M12 15l-2 5 2-1 2 1-2-5 M8 7h8 M8 11h8 M6 3h12a2 2 0 0 1 2 2v10H4V5a2 2 0 0 1 2-2z'),
    renderEditor: (d, p) => <CertificatesEditor value={d.certifications} onChange={field('certifications')(p)} />,
  },
  interests: {
    icon: icon('M12 3l1.8 5.5H19l-4.4 3.2 1.7 5.3L12 14.8 7.7 17l1.7-5.3L5 8.5h5.2z'),
    renderEditor: (d, p) => <InterestsEditor value={d.interests} onChange={field('interests')(p)} />,
  },
  projects: {
    icon: icon('M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'),
    renderEditor: (d, p) => <ProjectsStep value={d.projects} onChange={field('projects')(p)} />,
  },
  courses: {
    icon: icon('M4 19V5 M4 7h16v4H4 M4 15h10'),
    renderEditor: (d, p) => <CoursesEditor value={d.courses} onChange={field('courses')(p)} />,
  },
  awards: {
    icon: icon('M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0V4z M7 8H4a3 3 0 0 0 3 4 M17 8h3a3 3 0 0 1-3 4'),
    renderEditor: (d, p) => <AwardsEditor value={d.achievements} onChange={field('achievements')(p)} />,
  },
  organisations: {
    icon: icon('M3 21h18 M5 21V8l7-5 7 5v13 M9 21v-6h6v6'),
    renderEditor: (d, p) => (
      <OrganisationsEditor value={d.volunteerExperience} onChange={field('volunteerExperience')(p)} />
    ),
  },
  publications: {
    icon: icon('M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'),
    renderEditor: (d, p) => <PublicationsEditor value={d.publications} onChange={field('publications')(p)} />,
  },
  references: {
    icon: icon(
      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    ),
    renderEditor: (d, p) => (
      <ReferencesEditor
        value={d.references}
        onChange={field('references')(p)}
        includeReferences={d.includeReferences}
        onIncludeChange={(value) => p({ includeReferences: value })}
      />
    ),
  },
  declaration: {
    icon: icon('M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'),
    renderEditor: (d, p) => <DeclarationEditor value={d.declaration} onChange={field('declaration')(p)} />,
  },
  custom: {
    icon: icon('M12 5v14 M5 12h14'),
    renderEditor: (d, p) => <CustomEditor value={d.customSections} onChange={field('customSections')(p)} />,
  },
};
