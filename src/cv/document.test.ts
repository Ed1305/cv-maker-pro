import { buildCvDocument, pdfFileName } from './document';
import { createEmptyCv } from './schema';
import { sampleCv } from '../test/fixtures';

describe('buildCvDocument', () => {
  it('orders sections as the user chose', () => {
    const cv = { ...sampleCv(), enabledSections: ['skills', 'education', 'experience'] as const };
    const doc = buildCvDocument({ ...cv, enabledSections: [...cv.enabledSections] });
    expect(doc.sections.map((s) => s.id)).toEqual(['summary', 'skills', 'education', 'experience']);
  });

  it('builds job entries with formatted dates and all bullets', () => {
    const doc = buildCvDocument(sampleCv());
    const experience = doc.sections.find((s) => s.id === 'experience')!;
    expect(experience.block).toEqual({
      kind: 'entries',
      entries: [
        expect.objectContaining({
          heading: 'Analytical Engines Ltd, London | Mar 2021 – Present',
          title: 'Lead Engineer',
          bullets: [
            'Designed the payment platform',
            'Mentored four engineers',
            'Cut report generation from 2 days to 30 minutes',
          ],
        }),
      ],
    });
  });

  it('makes contact links clickable', () => {
    expect(buildCvDocument(sampleCv()).contacts).toEqual([
      { text: '+44 20 7946 0958', href: 'tel:+442079460958' },
      { text: 'ada@example.com', href: 'mailto:ada@example.com' },
      { text: 'London, UK', href: '' },
      { text: 'linkedin.com/in/ada', href: 'https://linkedin.com/in/ada' },
    ]);
  });

  it('skips enabled sections that are empty', () => {
    const cv = { ...createEmptyCv(), enabledSections: ['experience', 'skills'] as never };
    expect(buildCvDocument(cv).sections).toEqual([]);
  });

  it('prints "available upon request" when reference details are off', () => {
    const doc = buildCvDocument({ ...createEmptyCv(), enabledSections: ['references'] });
    expect(doc.sections[0].block).toEqual({ kind: 'text', text: 'References available upon request.' });
  });

  it('gives each custom section its own heading', () => {
    const doc = buildCvDocument({
      ...createEmptyCv(),
      enabledSections: ['custom'],
      customSections: [
        { id: 'a', title: 'Volunteering', content: 'Weekends at the shelter.' },
        { id: 'b', title: '', content: '' },
      ],
    });
    expect(doc.sections).toEqual([
      { id: 'custom-a', title: 'Volunteering', block: { kind: 'text', text: 'Weekends at the shelter.' } },
    ]);
  });
});

it('pdfFileName is safe and readable', () => {
  expect(pdfFileName(sampleCv())).toBe('Ada_Lovelace_CV.pdf');
  expect(pdfFileName({ ...sampleCv(), personalInfo: { ...sampleCv().personalInfo, fullName: "José / O'Neil" } })).toBe(
    'José_O_Neil_CV.pdf',
  );
  expect(pdfFileName(createEmptyCv())).toBe('My_CV.pdf');
});
