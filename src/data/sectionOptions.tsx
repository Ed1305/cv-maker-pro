import React from 'react';
import { SectionId } from '../types/cv';

export interface SectionOption {
  id: SectionId;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const icon = (path: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

export const SECTION_OPTIONS: SectionOption[] = [
  {
    id: 'education',
    title: 'Education',
    description: 'Add your degrees and schools. Include your focus, honors, or exchange terms.',
    icon: icon('M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5'),
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Add professional roles and employer history including internships.',
    icon: icon('M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2 M4 8h16v12H4z'),
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Add your hard and soft skills that help you stand out from the crowd today.',
    icon: icon('M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'),
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Add your languages and proficiency level to show your communication range.',
    icon: icon('M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20'),
  },
  {
    id: 'certificates',
    title: 'Certificates',
    description: 'Add your industry certificates or licences. Include issuer and date earned.',
    icon: icon('M12 15l-2 5 2-1 2 1-2-5 M8 7h8 M8 11h8 M6 3h12a2 2 0 0 1 2 2v10H4V5a2 2 0 0 1 2-2z'),
  },
  {
    id: 'interests',
    title: 'Interests',
    description: 'Add relevant personal interests that support your career story and cultural fit.',
    icon: icon('M12 3l1.8 5.5H19l-4.4 3.2 1.7 5.3L12 14.8 7.7 17l1.7-5.3L5 8.5h5.2z'),
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Add key projects you participated in and highlight your challenges, role, and impact.',
    icon: icon('M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'),
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Add online or in-person courses and trainings you joined and completed.',
    icon: icon('M4 19V5 M4 7h16v4H4 M4 15h10'),
  },
  {
    id: 'awards',
    title: 'Awards',
    description: 'Add your awards and recognitions from industry, competitions, or academia.',
    icon: icon('M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0V4z M7 8H4a3 3 0 0 0 3 4 M17 8h3a3 3 0 0 1-3 4'),
  },
  {
    id: 'organisations',
    title: 'Organisations',
    description: 'Add your memberships or volunteering with organisations including your role.',
    icon: icon('M3 21h18 M5 21V8l7-5 7 5v13 M9 21v-6h6v6'),
  },
  {
    id: 'publications',
    title: 'Publications',
    description: 'Add publications, articles, or books you wrote or contributed to.',
    icon: icon('M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'),
  },
  {
    id: 'references',
    title: 'References',
    description: 'Add your references from managers or coworkers, including their contact details.',
    icon: icon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75'),
  },
  {
    id: 'declaration',
    title: 'Declaration',
    description: 'Add your declaration by creating or uploading your personal statement.',
    icon: icon('M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'),
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Add a custom section for anything else, or anything you need uniquely.',
    icon: icon('M12 5v14 M5 12h14'),
  },
];

export const getSectionTitle = (id: SectionId): string =>
  SECTION_OPTIONS.find((option) => option.id === id)?.title || id;
