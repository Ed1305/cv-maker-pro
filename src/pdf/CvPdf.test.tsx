// @vitest-environment node
import { renderToBuffer } from '@react-pdf/renderer';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { buildCvDocument } from '../cv/document';
import { sampleCv } from '../test/fixtures';
import CvPdf from './CvPdf';

const extractText = async (buffer: Uint8Array) => {
  const pdf = await getDocument({ data: new Uint8Array(buffer), useSystemFonts: false }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n';
  }
  return { text, pages: pdf.numPages, metadata: await pdf.getMetadata() };
};

describe('CvPdf', () => {
  it('renders a text-based PDF that ATS software can read', async () => {
    const buffer = await renderToBuffer(<CvPdf doc={buildCvDocument(sampleCv())} keywords={['TypeScript']} />);
    expect(buffer.subarray(0, 5).toString()).toBe('%PDF-');

    const { text, pages, metadata } = await extractText(buffer);
    expect(pages).toBe(1);
    expect(text).toContain('Ada Lovelace');
    expect(text).toContain('Lead Engineer');
    expect(text).toContain('Mar 2021 – Present');
    expect(text).toContain('Cut report generation from 2 days to 30 minutes');
    expect(text).toContain('TypeScript');
    // Wide letter-spacing makes extractors read "W O R K"; headings must stay whole words.
    expect(text).toContain('WORK EXPERIENCE');
    expect((metadata.info as Record<string, unknown>).Title).toBe('Ada Lovelace – CV');
  });

  it('flows long CVs onto extra pages instead of cutting them off', async () => {
    const cv = sampleCv();
    cv.workExperience = Array.from({ length: 12 }, (_, i) => ({
      ...cv.workExperience[0],
      id: `job${i}`,
      jobTitle: `Role ${i}`,
    }));
    const buffer = await renderToBuffer(<CvPdf doc={buildCvDocument(cv)} />);
    const { text, pages } = await extractText(buffer);
    expect(pages).toBeGreaterThan(1);
    expect(text).toContain('Role 11');
  });
});
