import { isEndBeforeStart } from './dates';
import type { CVData, PersonalInfo, SectionId } from './schema';
import { SECTION_META } from './sections';

export type IssueLevel = 'error' | 'warning';

export interface Issue {
  level: IssueLevel;
  message: string;
  /** Wizard step that fixes it. */
  step: 1 | 2 | 3;
  section?: SectionId;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_LIKE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export const isValidEmail = (value: string) => EMAIL.test(value.trim());
export const isValidUrl = (value: string) => URL_LIKE.test(value.trim());
/** Phone numbers vary a lot by country, so only check it is mostly digits. */
export const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return /^[\d\s()+\-./]+$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15;
};

/** Ensures a link has a protocol so it is clickable in the PDF. */
export const toHref = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export type PersonalInfoErrors = Partial<Record<keyof PersonalInfo, string>>;

export const validatePersonalInfo = (info: PersonalInfo): PersonalInfoErrors => {
  const errors: PersonalInfoErrors = {};
  if (!info.fullName.trim()) errors.fullName = 'Add your name.';
  if (!info.email.trim()) errors.email = 'Add an email so employers can reach you.';
  else if (!isValidEmail(info.email)) errors.email = 'This email address looks incomplete.';
  if (info.phone.trim() && !isValidPhone(info.phone)) errors.phone = 'Use digits, spaces, +, - or brackets only.';
  if (info.linkedinUrl.trim() && !isValidUrl(info.linkedinUrl))
    errors.linkedinUrl = 'Enter a web address, e.g. linkedin.com/in/you.';
  return errors;
};

export const dateRangeError = (start: string, end: string, current: boolean): string | undefined =>
  !current && isEndBeforeStart(start, end) ? 'End date is before the start date.' : undefined;

/** All problems with the CV, most important first. */
export const validateCv = (data: CVData): Issue[] => {
  const issues: Issue[] = [];

  for (const message of Object.values(validatePersonalInfo(data.personalInfo))) {
    issues.push({ level: 'error', message: `Personal details: ${message}`, step: 1 });
  }

  if (!data.professionalSummary.summary.trim()) {
    issues.push({
      level: 'warning',
      message: 'Add a short "About me" summary — it is the first thing recruiters read.',
      step: 2,
    });
  }

  const on = (id: SectionId) => data.enabledSections.includes(id);

  if (on('experience')) {
    data.workExperience.forEach((job, index) => {
      const label = job.jobTitle || job.companyName || `Job ${index + 1}`;
      if (!job.jobTitle.trim() || !job.companyName.trim()) {
        issues.push({
          level: 'error',
          message: `${label}: add both a job title and a company.`,
          step: 3,
          section: 'experience',
        });
      }
      const range = dateRangeError(job.startDate, job.endDate, job.currentlyWorking);
      if (range) issues.push({ level: 'error', message: `${label}: ${range}`, step: 3, section: 'experience' });
    });
  }

  if (on('education')) {
    data.education.forEach((edu, index) => {
      const label = edu.qualification || edu.institution || `Education ${index + 1}`;
      const range = dateRangeError(edu.startYear, edu.graduationYear, edu.currentlyStudying);
      if (range) issues.push({ level: 'error', message: `${label}: ${range}`, step: 3, section: 'education' });
    });
  }

  if (on('projects')) {
    data.projects.forEach((project) => {
      for (const url of [project.projectUrl, project.githubUrl]) {
        if (url.trim() && !isValidUrl(url)) {
          issues.push({
            level: 'error',
            message: `${project.name || 'Project'}: "${url}" is not a valid link.`,
            step: 3,
            section: 'projects',
          });
        }
      }
    });
  }

  for (const id of data.enabledSections) {
    if (SECTION_META[id].isEmpty(data)) {
      issues.push({
        level: 'warning',
        message: `${SECTION_META[id].title} is on your CV but has nothing in it yet.`,
        step: 3,
        section: id,
      });
    }
  }

  return issues;
};

export interface ChecklistItem {
  label: string;
  complete: boolean;
  step: 1 | 2 | 3;
  section?: SectionId;
}

export const buildChecklist = (data: CVData): ChecklistItem[] => {
  const personalErrors = validatePersonalInfo(data.personalInfo);
  return [
    { label: 'Personal details', complete: Object.keys(personalErrors).length === 0, step: 1 },
    { label: 'About me', complete: data.professionalSummary.summary.trim().length > 0, step: 2 },
    ...data.enabledSections.map((id) => ({
      label: SECTION_META[id].title,
      complete: !SECTION_META[id].isEmpty(data),
      step: 3 as const,
      section: id,
    })),
  ];
};

export const completionPercent = (items: ChecklistItem[]): number =>
  items.length ? Math.round((items.filter((item) => item.complete).length / items.length) * 100) : 0;
