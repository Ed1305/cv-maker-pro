import type { CVData } from './schema';

/**
 * Rule-based writing helpers. These do NOT use AI — they tidy formatting and
 * remove common CV mistakes (first-person openings, "Responsible for…",
 * inconsistent capitalisation and punctuation). The UI labels them as
 * "Polish wording" so users know what to expect.
 */

const collapseSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();
const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const FIRST_PERSON_OPENING = /^(?:i|we|my|our)\s+(?:was\s+|am\s+|have\s+|also\s+)?/i;
const RESPONSIBLE_FOR = /^(?:was\s+)?responsible\s+for\s+/i;

/** Tidies one CV bullet: no first person, starts with a capital, no trailing full stop. */
export const polishBullet = (input: string): string => {
  let value = collapseSpaces(input).replace(/^[-•*]\s*/, '');
  if (!value) return '';
  value = value.replace(FIRST_PERSON_OPENING, '').replace(RESPONSIBLE_FOR, '');
  value = value.replace(/[.;,]+$/, '');
  return capitalise(value);
};

/** Tidies a paragraph: single spaces, capitalised sentences, standalone "i" → "I", ends with a full stop. */
export const polishParagraph = (input: string): string => {
  let value = collapseSpaces(input);
  if (!value) return '';
  value = value.replace(/\bi\b/g, 'I');
  value = value.replace(/\s+([,.;:!?])/g, '$1');
  value = value.replace(/(^|[.!?]\s+)([a-z])/g, (_, lead: string, letter: string) => lead + letter.toUpperCase());
  if (!/[.!?]$/.test(value)) value += '.';
  return value;
};

export const splitSentences = (value: string): string[] =>
  collapseSpaces(value)
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

/** Keeps roughly the first half of a paragraph (never fewer than two sentences). */
export const shortenParagraph = (value: string): string => {
  const sentences = splitSentences(value);
  if (sentences.length <= 2) return collapseSpaces(value);
  return sentences.slice(0, Math.max(2, Math.ceil(sentences.length / 2))).join(' ');
};

export interface SummaryAnswers {
  jobType: string;
  yearsExperience: string;
  strongestSkills: string;
  industries: string;
  uniqueValue: string;
  proudOf: string;
}

/** Drafts a summary from the helper questions. Only uses what the user typed — no filler. */
export const draftSummary = (answers: SummaryAnswers): string => {
  const job = answers.jobType.trim();
  const years = answers.yearsExperience.trim().replace(/\+$/, '');
  const industries = answers.industries.trim();
  const skills = answers.strongestSkills.trim();

  let opening = '';
  if (job) {
    opening = years ? `${job} with ${years}+ years of experience` : job;
    if (industries) opening += ` in ${industries}`;
    if (skills) opening += `, specialising in ${skills}`;
  } else if (skills) {
    opening = `Professional specialising in ${skills}`;
  }

  const sentences = [opening, answers.uniqueValue, answers.proudOf]
    .map((part) => part.trim().replace(/[.!]+$/, ''))
    .filter(Boolean)
    .map((part) => `${capitalise(part)}.`);

  return sentences.join(' ');
};

const KEY_SKILLS_PATTERN = /\s*Key skills: [^]*$/;

/**
 * Appends a "Key skills: …" line to the summary so applicant tracking systems
 * see the user's main skills. Safe to run repeatedly: an existing line is replaced.
 */
export const withKeySkills = (summary: string, skills: string[]): string => {
  const base = collapseSpaces(summary).replace(KEY_SKILLS_PATTERN, '');
  const names = skills
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 8);
  if (!names.length) return base;
  const lead = base ? `${base.replace(/[.!]*$/, '')}. ` : '';
  return `${lead}Key skills: ${names.join(', ')}.`;
};

export const IMPACT_TYPES = {
  'Saved time': 'Cut turnaround time by',
  'Reduced costs': 'Reduced costs by',
  'Increased productivity': 'Increased productivity by',
  'Built something new': 'Designed and delivered',
  'Automated a process': 'Automated',
  'Managed people': 'Led a team to deliver',
  'Improved customer experience': 'Improved customer experience by',
  Other: 'Delivered',
} as const;

export type ImpactType = keyof typeof IMPACT_TYPES;

/** Builds an achievement bullet from a prompt like ("Saved time", "automating weekly reports"). */
export const achievementBullet = (impact: ImpactType, change: string): string => {
  const detail = polishBullet(change);
  if (!detail) return '';
  return `${IMPACT_TYPES[impact]} ${detail.charAt(0).toLowerCase()}${detail.slice(1)}`;
};

export const LIMITS = { responsibilities: 3, achievements: 2 } as const;

/** Keeps the summary short and only the top bullets per job. Used by "Trim to key points" (undoable). */
export const trimToKeyPoints = (data: CVData): CVData => ({
  ...data,
  professionalSummary: {
    ...data.professionalSummary,
    summary: shortenParagraph(data.professionalSummary.summary),
  },
  workExperience: data.workExperience.map((job) => ({
    ...job,
    responsibilities: job.responsibilities.filter((b) => b.text.trim()).slice(0, LIMITS.responsibilities),
    achievements: job.achievements.filter((b) => b.text.trim()).slice(0, LIMITS.achievements),
  })),
});

/** Applies polishParagraph / polishBullet across the whole CV. */
export const polishCv = (data: CVData): CVData => ({
  ...data,
  professionalSummary: {
    ...data.professionalSummary,
    summary: polishParagraph(data.professionalSummary.summary),
  },
  workExperience: data.workExperience.map((job) => ({
    ...job,
    responsibilities: job.responsibilities.map((b) => ({ ...b, text: polishBullet(b.text) })),
    achievements: job.achievements.map((b) => ({ ...b, text: polishBullet(b.text) })),
  })),
});
