import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfText = async (path: string) => {
  const pdf = await getDocument({ data: new Uint8Array(await readFile(path)) }).promise;
  const pages = await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)));
  const contents = await Promise.all(pages.map((page) => page.getTextContent()));
  return contents.flatMap((content) => content.items.map((item) => ('str' in item ? item.str : ''))).join(' ');
};

/** On phones the step bar is hidden; use Next/Back instead. */
const goToStep = async (page: Page, step: number) => {
  const stepButton = page.getByRole('button', { name: new RegExp(`^Step ${step}:`) });
  if (await stepButton.isVisible()) return stepButton.click();
  const current = Number((await page.getByText(/^Step \d of 4$/).innerText()).match(/\d/)![0]);
  for (let i = current; i < step; i += 1) await page.getByRole('button', { name: 'Next' }).click();
  for (let i = current; i > step; i -= 1) await page.getByRole('button', { name: 'Back' }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('build a CV and download a text-based PDF', async ({ page }) => {
  await page.getByLabel('Full name').fill('Ada Lovelace');
  await page.getByLabel('Professional title').fill('Software Engineer');
  await page.getByLabel('Email').fill('ada@example.com');
  await page.getByLabel('City').fill('London');

  await goToStep(page, 2);
  await page.getByLabel('About me', { exact: true }).fill('Engineer who ships reliable software.');

  await goToStep(page, 3);
  await page.getByRole('button', { name: 'Edit Work Experience' }).click();
  await page.getByRole('button', { name: 'Add work experience' }).click();
  await page.getByLabel('Job title').fill('Lead Engineer');
  await page.getByLabel('Company').fill('Analytical Engines');
  await page.getByLabel('Start date').fill('2021-03');
  await page.getByLabel('I currently work here').check();
  await page.getByLabel('Responsibility 1').fill('I was responsible for the payment platform.');
  await page.getByRole('button', { name: 'Polish wording' }).click();
  await expect(page.getByLabel('Responsibility 1')).toHaveValue('The payment platform');

  await goToStep(page, 4);
  await expect(page.getByText('CV completeness')).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('main').getByRole('button', { name: 'Download PDF' }).first().click(),
  ]);
  expect(download.suggestedFilename()).toBe('Ada_Lovelace_CV.pdf');
  const path = await download.path();
  const text = await pdfText(path);
  expect(text).toContain('Ada Lovelace');
  expect(text).toContain('Mar 2021 – Present');
  expect(text).toContain('The payment platform');
});

test('work survives a reload', async ({ page }) => {
  await page.getByLabel('Full name').fill('Grace Hopper');
  await page.waitForTimeout(600); // debounced save
  await page.reload();
  await expect(page.getByLabel('Full name')).toHaveValue('Grace Hopper');
});

test('backup can be exported and restored', async ({ page }) => {
  await page.getByLabel('Full name').fill('Grace Hopper');
  await page.getByText('Your data').click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /download backup/i }).click(),
  ]);
  const backup = await download.path();

  await page.getByText('Your data').click();
  await page.getByRole('button', { name: 'Start a new CV' }).click();
  await expect(page.getByLabel('Full name')).toHaveValue('');

  await page.locator('input[type=file]').setInputFiles(backup);
  await goToStep(page, 1);
  await expect(page.getByLabel('Full name')).toHaveValue('Grace Hopper');
});

test('has no detectable accessibility violations', async ({ page }) => {
  const scan = async () => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  };
  await scan();
  await goToStep(page, 3);
  await page.getByRole('button', { name: 'Edit Work Experience' }).click();
  await page.getByRole('button', { name: 'Add work experience' }).click();
  await scan();
  await goToStep(page, 4);
  await scan();
});
