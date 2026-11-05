import { formatDateRange, formatYearMonth } from './dates';
import type { CVData, SectionId } from './schema';
import { SECTION_META } from './sections';
import { toHref } from './validation';

/**
 * A renderer-neutral description of what goes on the printed CV.
 *
 * Both the on-screen preview (HTML) and the downloaded PDF (react-pdf) render
 * this same structure, so they can't drift apart in content — only in styling.
 */

export interface CvLink {
  text: string;
  href: string;
}

export interface CvEntry {
  /** Bold first line, e.g. "Acme Corp · London | Mar 2021 – Present". */
  heading: string;
  /** Bold second line, e.g. the job title. */
  title: string;
  body: string;
  bullets: string[];
  links: CvLink[];
}

export type CvBlock =
  { kind: 'entries'; entries: CvEntry[] } | { kind: 'list'; items: string[] } | { kind: 'text'; text: string };

export interface CvSection {
  id: SectionId | 'summary' | `custom-${string}`;
  title: string;
  block: CvBlock;
}

export interface CvDocument {
  name: string;
  title: string;
  contacts: CvLink[];
  sections: CvSection[];
}

const join = (separator: string, ...parts: (string | false | undefined)[]) =>
  parts
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .join(separator);

const entry = (partial: Partial<CvEntry>): CvEntry => ({
  heading: '',
  title: '',
  body: '',
  bullets: [],
  links: [],
  ...partial,
});

const hasContent = (e: CvEntry) => Boolean(e.heading || e.title || e.body || e.bullets.length || e.links.length);

const entries = (list: CvEntry[]): CvBlock | null => {
  const filled = list.filter(hasContent);
  return filled.length ? { kind: 'entries', entries: filled } : null;
};

const items = (values: string[]): CvBlock | null => {
  const filled = values.map((value) => value.trim()).filter(Boolean);
  return filled.length ? { kind: 'list', items: filled } : null;
};

const paragraph = (value: string): CvBlock | null => (value.trim() ? { kind: 'text', text: value.trim() } : null);

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const EMPLOYMENT_LABEL: Record<string, string> = {
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

const prettyLink = (url: string) =>
  url
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/\/$/, '');

const buildBlock = (id: SectionId, data: CVData): CvBlock | null => {
  switch (id) {
    case 'experience':
      return entries(
        data.workExperience.map((job) =>
          entry({
            heading: join(
              ' | ',
              join(', ', job.companyName, job.location),
              formatDateRange(job.startDate, job.endDate, job.currentlyWorking),
            ),
            title: join(' · ', job.jobTitle, EMPLOYMENT_LABEL[job.employmentType]),
            bullets: [...job.responsibilities, ...job.achievements].map((b) => b.text.trim()).filter(Boolean),
          }),
        ),
      );
    case 'education':
      return entries(
        data.education.map((edu) =>
          entry({
            heading: join(
              ' | ',
              edu.institution,
              formatDateRange(edu.startYear, edu.graduationYear, edu.currentlyStudying),
            ),
            title: join(' — ', edu.qualification, edu.fieldOfStudy),
            body: join(
              ' ',
              edu.grade && `Grade: ${edu.grade}.`,
              edu.coursework && `Coursework: ${edu.coursework}.`,
              edu.academicAchievements,
            ),
          }),
        ),
      );
    case 'skills':
      return items(data.skills.map((skill) => skill.name));
    case 'languages':
      return items(
        data.languages.filter((l) => l.language.trim()).map((l) => `${l.language.trim()} — ${capitalise(l.level)}`),
      );
    case 'interests':
      return items(data.interests.map((interest) => interest.name));
    case 'certificates':
      return entries(
        data.certifications.map((cert) =>
          entry({
            heading: join(
              ' | ',
              cert.organization,
              formatYearMonth(cert.dateObtained),
              cert.expirationDate && `Valid until ${formatYearMonth(cert.expirationDate)}`,
            ),
            title: cert.name,
          }),
        ),
      );
    case 'projects':
      return entries(
        data.projects.map((project) =>
          entry({
            heading: join(' | ', project.role, project.technologies, formatYearMonth(project.date)),
            title: project.name,
            body: project.description,
            links: [project.projectUrl, project.githubUrl]
              .filter((url) => url.trim())
              .map((url) => ({ text: prettyLink(url), href: toHref(url) })),
          }),
        ),
      );
    case 'courses':
      return entries(
        data.courses.map((course) =>
          entry({ heading: join(' | ', course.organization, formatYearMonth(course.date)), title: course.name }),
        ),
      );
    case 'awards':
      return entries(
        data.achievements.map((award) =>
          entry({
            heading: join(' | ', award.organization, formatYearMonth(award.date)),
            title: award.title,
            body: award.description,
          }),
        ),
      );
    case 'organisations':
      return entries(
        data.volunteerExperience.map((org) =>
          entry({
            heading: join(' | ', org.organization, formatDateRange(org.startDate, org.endDate)),
            title: org.role,
            bullets: org.responsibilities.map((line) => line.trim()).filter(Boolean),
          }),
        ),
      );
    case 'publications':
      return entries(
        data.publications.map((pub) =>
          entry({
            heading: join(' | ', pub.publisher, formatYearMonth(pub.date)),
            title: pub.title,
            links: pub.url.trim() ? [{ text: prettyLink(pub.url), href: toHref(pub.url) }] : [],
          }),
        ),
      );
    case 'references':
      if (!data.includeReferences) return paragraph('References available upon request.');
      return (
        entries(
          data.references.map((ref) =>
            entry({
              title: ref.name,
              heading: '',
              body: join(' · ', join(', ', ref.position, ref.company), ref.phone, ref.email),
            }),
          ),
        ) ?? paragraph('References available upon request.')
      );
    case 'declaration':
      return paragraph(data.declaration);
    case 'custom':
      // Custom sections are expanded separately (each has its own heading).
      return null;
  }
};

export const buildCvDocument = (data: CVData): CvDocument => {
  const { personalInfo: info } = data;

  const contacts: CvLink[] = [];
  if (info.phone.trim()) contacts.push({ text: info.phone.trim(), href: `tel:${info.phone.replace(/[^\d+]/g, '')}` });
  if (info.email.trim()) contacts.push({ text: info.email.trim(), href: `mailto:${info.email.trim()}` });
  const location = join(', ', info.city, info.country);
  if (location) contacts.push({ text: location, href: '' });
  if (info.linkedinUrl.trim()) contacts.push({ text: prettyLink(info.linkedinUrl), href: toHref(info.linkedinUrl) });

  const sections: CvSection[] = [];
  const summary = paragraph(data.professionalSummary.summary);
  if (summary) sections.push({ id: 'summary', title: 'About Me', block: summary });

  for (const id of data.enabledSections) {
    if (id === 'custom') {
      for (const custom of data.customSections) {
        if (!custom.title.trim() && !custom.content.trim()) continue;
        sections.push({
          id: `custom-${custom.id}`,
          title: custom.title.trim() || 'Additional Information',
          block: { kind: 'text', text: custom.content.trim() },
        });
      }
      continue;
    }
    const block = buildBlock(id, data);
    if (block) sections.push({ id, title: SECTION_META[id].title, block });
  }

  return {
    name: info.fullName.trim(),
    title: info.professionalTitle.trim(),
    contacts,
    sections,
  };
};

export const pdfFileName = (data: CVData): string => {
  const name = data.personalInfo.fullName
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_|_$/g, '');
  return `${name || 'My'}_CV.pdf`;
};
