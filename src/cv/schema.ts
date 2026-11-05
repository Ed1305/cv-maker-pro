import { z } from 'zod';
import { createId } from './id';

/**
 * Single source of truth for the CV data shape.
 *
 * Every field is lenient: missing or wrongly typed values fall back to a
 * default instead of failing. This lets us load data saved by older versions
 * of the app (or a hand-edited backup file) without losing the parts that are
 * still valid.
 */

const text = () => z.string().catch('');
const flag = () => z.boolean().catch(false);
const id = () =>
  z
    .string()
    .min(1)
    .catch(() => createId());
const list = <T extends z.ZodType>(item: T) => z.array(item).catch([]);

export const BulletSchema = z.preprocess(
  // v1 stored bullets as plain strings.
  (value) => (typeof value === 'string' ? { id: createId(), text: value } : value),
  z.object({ id: id(), text: text() }),
);

export const PersonalInfoSchema = z.object({
  fullName: text(),
  professionalTitle: text(),
  email: text(),
  phone: text(),
  city: text(),
  country: text(),
  linkedinUrl: text(),
});

export const ProfessionalSummarySchema = z.object({
  summary: text(),
  jobType: text(),
  yearsExperience: text(),
  strongestSkills: text(),
  industries: text(),
  uniqueValue: text(),
  proudOf: text(),
});

export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance'] as const;

export const WorkExperienceSchema = z.object({
  id: id(),
  companyName: text(),
  jobTitle: text(),
  location: text(),
  employmentType: z.enum(EMPLOYMENT_TYPES).catch('full-time'),
  startDate: text(),
  endDate: text(),
  currentlyWorking: flag(),
  responsibilities: list(BulletSchema),
  achievements: list(BulletSchema),
});

export const EducationSchema = z.object({
  id: id(),
  institution: text(),
  qualification: text(),
  fieldOfStudy: text(),
  startYear: text(),
  graduationYear: text(),
  currentlyStudying: flag(),
  grade: text(),
  coursework: text(),
  academicAchievements: text(),
});

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const SkillSchema = z.object({
  id: id(),
  name: text(),
  category: z.enum(['technical', 'soft', 'language', 'tool']).catch('technical'),
  proficiency: z.enum(SKILL_LEVELS).catch('intermediate'),
});

export const ProjectSchema = z.object({
  id: id(),
  name: text(),
  description: text(),
  role: text(),
  technologies: text(),
  problem: text(),
  contribution: text(),
  projectUrl: text(),
  githubUrl: text(),
  date: text(),
});

export const CertificationSchema = z.object({
  id: id(),
  name: text(),
  organization: text(),
  dateObtained: text(),
  expirationDate: text(),
});

export const LANGUAGE_LEVELS = ['native', 'fluent', 'professional', 'intermediate', 'basic'] as const;

export const LanguageSchema = z.object({
  id: id(),
  language: text(),
  level: z.enum(LANGUAGE_LEVELS).catch('intermediate'),
});

export const AchievementSchema = z.object({
  id: id(),
  title: text(),
  organization: text(),
  date: text(),
  description: text(),
});

export const VolunteerExperienceSchema = z.object({
  id: id(),
  organization: text(),
  role: text(),
  startDate: text(),
  endDate: text(),
  responsibilities: list(text()),
});

export const ReferenceSchema = z.object({
  id: id(),
  name: text(),
  position: text(),
  company: text(),
  phone: text(),
  email: text(),
});

export const InterestSchema = z.object({ id: id(), name: text() });

export const CourseSchema = z.object({ id: id(), name: text(), organization: text(), date: text() });

export const PublicationSchema = z.object({
  id: id(),
  title: text(),
  publisher: text(),
  date: text(),
  url: text(),
});

export const CustomSectionSchema = z.object({ id: id(), title: text(), content: text() });

export const SECTION_IDS = [
  'education',
  'experience',
  'skills',
  'languages',
  'certificates',
  'interests',
  'projects',
  'courses',
  'awards',
  'organisations',
  'publications',
  'references',
  'declaration',
  'custom',
] as const;

export const SectionIdSchema = z.enum(SECTION_IDS);

export const DEFAULT_SECTIONS: SectionId[] = ['experience', 'education', 'skills'];

const defaultPersonalInfo = () => PersonalInfoSchema.parse({});
const defaultSummary = () => ProfessionalSummarySchema.parse({});

export const CVDataSchema = z.object({
  personalInfo: PersonalInfoSchema.catch(defaultPersonalInfo),
  professionalSummary: ProfessionalSummarySchema.catch(defaultSummary),
  workExperience: list(WorkExperienceSchema),
  education: list(EducationSchema),
  skills: list(SkillSchema),
  projects: list(ProjectSchema),
  certifications: list(CertificationSchema),
  languages: list(LanguageSchema),
  achievements: list(AchievementSchema),
  volunteerExperience: list(VolunteerExperienceSchema),
  references: list(ReferenceSchema),
  includeReferences: flag(),
  interests: list(InterestSchema),
  courses: list(CourseSchema),
  publications: list(PublicationSchema),
  customSections: list(CustomSectionSchema),
  declaration: text(),
  /** Sections shown on the CV, in display order. */
  enabledSections: z
    .array(z.unknown())
    .transform((ids) => [
      ...new Set(ids.filter((value): value is SectionId => SectionIdSchema.safeParse(value).success)),
    ])
    .catch(() => [...DEFAULT_SECTIONS]),
});

export type Bullet = z.infer<typeof BulletSchema>;
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type ProfessionalSummary = z.infer<typeof ProfessionalSummarySchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type VolunteerExperience = z.infer<typeof VolunteerExperienceSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type Interest = z.infer<typeof InterestSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Publication = z.infer<typeof PublicationSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type SectionId = (typeof SECTION_IDS)[number];
export type CVData = z.infer<typeof CVDataSchema>;

export const createEmptyCv = (): CVData => CVDataSchema.parse({ enabledSections: DEFAULT_SECTIONS });

export const newBullet = (value = ''): Bullet => ({ id: createId(), text: value });
