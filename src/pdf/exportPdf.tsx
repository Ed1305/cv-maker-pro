import { buildCvDocument, pdfFileName } from '../cv/document';
import type { CVData } from '../cv/schema';
import { downloadBlob } from '../lib/download';

/**
 * Builds the PDF in the browser and starts a download.
 *
 * This module is only imported when the user clicks Download, so the PDF
 * engine (~1 MB) never slows down the first page load.
 */

let fontsReady = false;

const registerFonts = async () => {
  if (fontsReady) return;
  const [{ Font }, regular, bold] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@fontsource/inter/files/inter-latin-400-normal.woff?url'),
    import('@fontsource/inter/files/inter-latin-700-normal.woff?url'),
  ]);
  Font.register({
    family: 'Inter',
    fonts: [
      { src: regular.default, fontWeight: 400 },
      { src: bold.default, fontWeight: 700 },
    ],
  });
  // Don't split words with hyphens — it looks odd on a CV.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
};

export const renderCvPdf = async (data: CVData): Promise<Blob> => {
  const [{ pdf }, { default: CvPdf }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./CvPdf'),
    registerFonts(),
  ]);
  const doc = buildCvDocument(data);
  const keywords = data.skills.map((skill) => skill.name).filter(Boolean);
  return pdf(<CvPdf doc={doc} fontFamily="Inter" keywords={keywords} />).toBlob();
};

export const exportCvPdf = async (data: CVData): Promise<void> => {
  const blob = await renderCvPdf(data);
  downloadBlob(blob, pdfFileName(data));
};
