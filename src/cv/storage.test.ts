import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  BackupFormatError,
  loadCv,
  migrate,
  parseBackup,
  saveCv,
  serialize,
} from './storage';
import { createEmptyCv } from './schema';
import { sampleCv } from '../test/fixtures';

const memoryStorage = (initial: Record<string, string> = {}) => {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    store,
  };
};

/** Shape saved by v1 of the app (no version, string bullets, extra fields). */
const legacyV1 = {
  personalInfo: { fullName: 'Ada Lovelace', email: 'ada@example.com', photoUrl: 'x', twitterUrl: '' },
  professionalSummary: { summary: 'Hi.' },
  workExperience: [
    {
      id: 'j1',
      companyName: 'Acme',
      jobTitle: 'Dev',
      employmentType: 'full-time',
      startDate: '2020-01',
      currentlyWorking: true,
      responsibilities: ['Built things', ''],
      achievements: ['Shipped'],
    },
  ],
  skills: [{ id: 's1', name: 'Go', category: 'technical', proficiency: 'advanced' }],
  includeReferences: false,
};

describe('migrate', () => {
  it('upgrades v1 data: bullets become objects and sections are inferred', () => {
    const cv = migrate(legacyV1);
    expect(cv.workExperience[0].responsibilities.map((b) => b.text)).toEqual(['Built things', '']);
    expect(cv.workExperience[0].responsibilities[0].id).toBeTruthy();
    expect(cv.enabledSections).toEqual(['experience', 'skills']);
    expect(cv.personalInfo).not.toHaveProperty('photoUrl');
    expect(cv.personalInfo.city).toBe('');
  });

  it('falls back to defaults for wrong types instead of throwing', () => {
    const cv = migrate({
      personalInfo: 'nope',
      skills: 'nope',
      enabledSections: ['skills', 'bogus', 'skills'],
      workExperience: [{ employmentType: 'pirate' }],
    });
    expect(cv.personalInfo.fullName).toBe('');
    expect(cv.skills).toEqual([]);
    expect(cv.enabledSections).toEqual(['skills']);
    expect(cv.workExperience[0].employmentType).toBe('full-time');
    expect(cv.workExperience[0].id).toBeTruthy();
  });

  it('returns an empty CV for non-objects', () => {
    expect(migrate(null)).toEqual(createEmptyCv());
  });
});

describe('load / save', () => {
  it('round-trips through storage', () => {
    const storage = memoryStorage();
    const cv = sampleCv();
    expect(saveCv(cv, storage)).toBe(true);
    expect(JSON.parse(storage.store.get(STORAGE_KEY)!).version).toBe(2);
    expect(loadCv(storage)).toEqual(cv);
  });

  it('reads the legacy key and removes it after the next save', () => {
    const storage = memoryStorage({ [LEGACY_STORAGE_KEY]: JSON.stringify(legacyV1) });
    const cv = loadCv(storage);
    expect(cv.personalInfo.fullName).toBe('Ada Lovelace');
    saveCv(cv, storage);
    expect(storage.store.has(LEGACY_STORAGE_KEY)).toBe(false);
  });

  it('survives corrupt storage', () => {
    expect(loadCv(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toEqual(createEmptyCv());
  });

  it('reports a failed save instead of throwing', () => {
    const full = {
      setItem: () => {
        throw new Error('QuotaExceeded');
      },
      removeItem: () => {},
    };
    expect(saveCv(sampleCv(), full)).toBe(false);
  });
});

describe('parseBackup', () => {
  it('accepts an exported backup', () => {
    const cv = sampleCv();
    expect(parseBackup(serialize(cv))).toEqual(cv);
  });
  it('rejects files that are not backups', () => {
    expect(() => parseBackup('not json')).toThrow(BackupFormatError);
    expect(() => parseBackup('{"hello": 1}')).toThrow("doesn't look like a CV Maker backup");
  });
});
