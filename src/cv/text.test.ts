import {
  achievementBullet,
  draftSummary,
  polishBullet,
  polishParagraph,
  shortenParagraph,
  trimToKeyPoints,
  withKeySkills,
} from './text';
import { newBullet } from './schema';
import { sampleCv } from '../test/fixtures';

describe('polishBullet', () => {
  it.each([
    ['I was responsible for managing the help desk.', 'Managing the help desk'],
    ['responsible for onboarding', 'Onboarding'],
    ['  we   built a new  CRM ', 'Built a new CRM'],
    ['- led a team of 5;', 'Led a team of 5'],
    ['Used Python to automate reports', 'Used Python to automate reports'],
    ['', ''],
  ])('%j → %j', (input, expected) => {
    expect(polishBullet(input)).toBe(expected);
  });

  it('does not swap in buzzwords', () => {
    expect(polishBullet('helped customers and used good tools')).toBe('Helped customers and used good tools');
  });
});

describe('polishParagraph', () => {
  it('fixes spacing, capitals and the final full stop', () => {
    expect(polishParagraph('i am a developer .  i like  testing')).toBe('I am a developer. I like testing.');
  });
  it('leaves an already tidy paragraph alone', () => {
    expect(polishParagraph('Engineer. Ships software!')).toBe('Engineer. Ships software!');
  });
});

describe('shortenParagraph', () => {
  it('keeps about half the sentences, at least two', () => {
    expect(shortenParagraph('One. Two. Three. Four. Five.')).toBe('One. Two. Three.');
    expect(shortenParagraph('One. Two.')).toBe('One. Two.');
  });
});

describe('draftSummary', () => {
  const empty = { jobType: '', yearsExperience: '', strongestSkills: '', industries: '', uniqueValue: '', proudOf: '' };

  it('uses only what the user typed', () => {
    expect(
      draftSummary({
        ...empty,
        jobType: 'Accountant',
        yearsExperience: '5',
        industries: 'retail',
        strongestSkills: 'IFRS and Excel',
        proudOf: 'cut month-end close to 4 days.',
      }),
    ).toBe(
      'Accountant with 5+ years of experience in retail, specialising in IFRS and Excel. Cut month-end close to 4 days.',
    );
  });

  it('returns nothing when nothing was answered', () => {
    expect(draftSummary(empty)).toBe('');
  });
});

describe('withKeySkills', () => {
  it('appends a key skills line once, even when run repeatedly', () => {
    const once = withKeySkills('Engineer who ships.', ['TypeScript', 'React']);
    expect(once).toBe('Engineer who ships. Key skills: TypeScript, React.');
    expect(withKeySkills(once, ['TypeScript', 'React', 'Go'])).toBe(
      'Engineer who ships. Key skills: TypeScript, React, Go.',
    );
  });
  it('works without a summary', () => {
    expect(withKeySkills('', ['SQL'])).toBe('Key skills: SQL.');
  });
});

it('achievementBullet builds a result line', () => {
  expect(achievementBullet('Saved time', '60% by automating reports.')).toBe(
    'Cut turnaround time by 60% by automating reports',
  );
  expect(achievementBullet('Saved time', '  ')).toBe('');
});

it('trimToKeyPoints keeps only the top bullets', () => {
  const cv = sampleCv();
  cv.workExperience[0].responsibilities = ['a', 'b', 'c', 'd', ''].map((t) => newBullet(t));
  const trimmed = trimToKeyPoints(cv);
  expect(trimmed.workExperience[0].responsibilities.map((b) => b.text)).toEqual(['a', 'b', 'c']);
  expect(cv.workExperience[0].responsibilities).toHaveLength(5); // original untouched
});
