import { CVData, CVDataSchema, DEFAULT_SECTIONS, SectionId, createEmptyCv } from './schema';

export const STORAGE_KEY = 'cv-maker-pro:cv';
/** Key used by v1 of the app, which stored raw CV data without a version. */
export const LEGACY_STORAGE_KEY = 'cvData';
export const SCHEMA_VERSION = 2;

interface SavedEnvelope {
  app: 'cv-maker-pro';
  version: number;
  savedAt: string;
  data: CVData;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** v1 data had no `enabledSections`; work out which sections were in use. */
const inferEnabledSections = (raw: Record<string, unknown>): SectionId[] => {
  const has = (key: string) => Array.isArray(raw[key]) && (raw[key] as unknown[]).length > 0;
  const inferred: SectionId[] = [];
  if (has('workExperience')) inferred.push('experience');
  if (has('education')) inferred.push('education');
  if (has('skills')) inferred.push('skills');
  if (has('languages')) inferred.push('languages');
  if (has('certifications')) inferred.push('certificates');
  if (has('interests')) inferred.push('interests');
  if (has('projects')) inferred.push('projects');
  if (has('courses')) inferred.push('courses');
  if (has('achievements')) inferred.push('awards');
  if (has('volunteerExperience')) inferred.push('organisations');
  if (has('publications')) inferred.push('publications');
  if (has('references') || raw.includeReferences === true) inferred.push('references');
  if (typeof raw.declaration === 'string' && raw.declaration) inferred.push('declaration');
  if (has('customSections')) inferred.push('custom');
  return inferred.length ? inferred : [...DEFAULT_SECTIONS];
};

/**
 * Turns anything we might find on disk (current envelope, v1 raw data, or a
 * backup file) into valid CV data. Unknown fields are dropped and invalid
 * values fall back to defaults.
 */
export const migrate = (input: unknown): CVData => {
  if (!isRecord(input)) return createEmptyCv();

  const raw = isRecord(input.data) && typeof input.version === 'number' ? input.data : input;
  const withSections =
    Array.isArray(raw.enabledSections) && raw.enabledSections.length > 0
      ? raw
      : { ...raw, enabledSections: inferEnabledSections(raw) };

  return CVDataSchema.parse(withSections);
};

export const serialize = (data: CVData): string => {
  const envelope: SavedEnvelope = {
    app: 'cv-maker-pro',
    version: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    data,
  };
  return JSON.stringify(envelope);
};

export class BackupFormatError extends Error {}

/** Parses a user-supplied backup file. Throws BackupFormatError if it isn't one. */
export const parseBackup = (json: string): CVData => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new BackupFormatError('That file is not valid JSON.');
  }
  if (!isRecord(parsed) || !('personalInfo' in (isRecord(parsed.data) ? parsed.data : parsed))) {
    throw new BackupFormatError("That file doesn't look like a CV Maker backup.");
  }
  return migrate(parsed);
};

export const loadCv = (storage: Pick<Storage, 'getItem'> = localStorage): CVData => {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current) return migrate(JSON.parse(current));
    const legacy = storage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) return migrate(JSON.parse(legacy));
  } catch {
    // Corrupt or unreadable storage: start fresh rather than crash.
  }
  return createEmptyCv();
};

/** Returns false if the browser refused to save (private mode, quota full). */
export const saveCv = (data: CVData, storage: Pick<Storage, 'setItem' | 'removeItem'> = localStorage): boolean => {
  try {
    storage.setItem(STORAGE_KEY, serialize(data));
    storage.removeItem(LEGACY_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};

export const backupFileName = (data: CVData): string => {
  const name =
    data.personalInfo.fullName
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-|-$/g, '') || 'cv';
  return `${name}-cv-backup.json`;
};
