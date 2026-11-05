import {
  buildChecklist,
  completionPercent,
  isValidPhone,
  isValidUrl,
  toHref,
  validateCv,
  validatePersonalInfo,
} from './validation';
import { createEmptyCv } from './schema';
import { sampleCv } from '../test/fixtures';

describe('validatePersonalInfo', () => {
  it('requires a name and a valid email', () => {
    const errors = validatePersonalInfo(createEmptyCv().personalInfo);
    expect(errors.fullName).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(validatePersonalInfo({ ...sampleCv().personalInfo, email: 'ada@' }).email).toMatch(/incomplete/);
    expect(validatePersonalInfo(sampleCv().personalInfo)).toEqual({});
  });

  it('accepts international phone formats', () => {
    expect(isValidPhone('+27 (82) 123-4567')).toBe(true);
    expect(isValidPhone('12')).toBe(false);
    expect(isValidPhone('call me')).toBe(false);
  });
});

it('validates and normalises links', () => {
  expect(isValidUrl('linkedin.com/in/ada')).toBe(true);
  expect(isValidUrl('https://github.com/ada/engine')).toBe(true);
  expect(isValidUrl('not a link')).toBe(false);
  expect(toHref('github.com/ada')).toBe('https://github.com/ada');
  expect(toHref('http://x.io')).toBe('http://x.io');
});

describe('validateCv', () => {
  it('has no errors for a complete CV', () => {
    expect(validateCv(sampleCv()).filter((i) => i.level === 'error')).toEqual([]);
  });

  it('flags end dates before start dates', () => {
    const cv = sampleCv();
    cv.workExperience[0] = {
      ...cv.workExperience[0],
      currentlyWorking: false,
      startDate: '2022-05',
      endDate: '2021-01',
    };
    expect(validateCv(cv)).toContainEqual(
      expect.objectContaining({
        level: 'error',
        section: 'experience',
        message: expect.stringMatching(/before the start/),
      }),
    );
  });

  it('warns about enabled sections that are empty', () => {
    const cv = { ...sampleCv(), enabledSections: [...sampleCv().enabledSections, 'languages' as const] };
    expect(validateCv(cv)).toContainEqual(expect.objectContaining({ level: 'warning', section: 'languages' }));
  });
});

it('completeness counts empty sections as incomplete', () => {
  const cv = { ...sampleCv(), enabledSections: [...sampleCv().enabledSections, 'languages' as const] };
  const checklist = buildChecklist(cv);
  expect(checklist.find((item) => item.section === 'languages')?.complete).toBe(false);
  expect(completionPercent(checklist)).toBe(83);
  expect(completionPercent(buildChecklist(createEmptyCv()))).toBe(0);
});
