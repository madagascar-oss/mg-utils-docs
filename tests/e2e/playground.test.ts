import { expect, test } from '@playwright/test';
import lzString from 'lz-string';

/** Opens the playground with the given code, the way a share link does. */
function playUrl(language: 'js' | 'php', module: string, code: string): string {
  const payload = JSON.stringify({ l: language, m: module, c: code });
  return `play/#v1:${lzString.compressToEncodedURIComponent(payload)}`;
}

test('runs the JavaScript starter for every module', async ({ page }) => {
  const expected = {
    words: 'iraika amby roapolo',
    phone: 'UNKNOWN_OPERATOR',
    ariary: 'dimanjato sy arivo ariary',
    date: 'Alatsinainy 23 Novambra 2026',
  };
  await page.goto('play/');
  const output = page.getByTestId('output');
  await expect(output).toContainText('iraika amby roapolo');
  for (const [module, text] of Object.entries(expected)) {
    await page.selectOption('#play-module', module);
    await expect(output).toContainText(text);
  }
});

test('a share link restores the code', async ({ page, context }) => {
  await page.goto('play/');
  // Wait for the first run, so the app is hydrated before the module changes.
  await expect(page.getByTestId('output')).toContainText('iraika amby roapolo');
  await page.selectOption('#play-module', 'date');
  await expect(page.getByTestId('output')).toContainText('Jona');
  const shared = await context.newPage();
  await shared.goto(page.url());
  await expect(shared.locator('#play-module')).toHaveValue('date');
  await expect(shared.getByTestId('output')).toContainText('Jona');
});

test('shows the spec error code of an uncaught error', async ({ page }) => {
  const code = "import { parseAriary } from '@madagascar-oss/ariary';\n\nparseAriary('1,500');\n";
  await page.goto(playUrl('js', 'ariary', code));
  await expect(page.getByTestId('error')).toContainText('INVALID_FORMAT');
});

test('stops an infinite loop', async ({ page }) => {
  await page.goto(playUrl('js', 'words', 'while (true) {}\n'));
  await expect(page.getByTestId('error')).toContainText('Stopped after', { timeout: 10_000 });
});

test('the playground UI is translated', async ({ page }) => {
  await page.goto('fr/play/');
  await expect(page.getByRole('button', { name: 'Exécuter' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('a Try it widget updates and opens the playground', async ({ page }) => {
  await page.goto('docs/ariary/');
  const result = page.getByTestId('try-result');
  await page.getByRole('textbox', { name: 'Input' }).fill('1,500');
  await expect(result).toHaveText('INVALID_FORMAT');
  await page.getByRole('textbox', { name: 'Input' }).fill('1.500 Ar');
  await expect(result).toContainText('dimanjato sy arivo ariary');
  await page.getByRole('link', { name: /Open in the playground/ }).click();
  await expect(page.getByTestId('output')).toContainText('Ar 1 500');
});

test.describe('PHP', () => {
  // The first PHP run downloads the runtime (~8 MB).
  test.setTimeout(120_000);

  test('prints the same results as JavaScript for every module', async ({ page }) => {
    await page.goto('play/');
    const output = page.getByTestId('output');
    await expect(output).toContainText('iraika amby roapolo');
    for (const module of ['words', 'phone', 'ariary', 'date']) {
      await page.getByRole('radio', { name: 'JavaScript' }).click();
      await page.selectOption('#play-module', module);
      await expect(output).not.toContainText('Run the code');
      await expect(page.getByText(/Ran in/)).toBeVisible();
      const javascript = (await output.innerText()).trim();

      await page.getByRole('radio', { name: 'PHP' }).click();
      await expect
        .poll(async () => (await output.innerText()).trim(), { timeout: 90_000 })
        .toBe(javascript);
    }
  });

  test('reports the spec error code of an uncaught exception', async ({ page }) => {
    const code =
      "<?php\n\nuse Madagascar\\MgUtils\\Ariary\\Ariary;\n\necho Ariary::parse('1,500')->amount;\n";
    await page.goto(playUrl('php', 'ariary', code));
    await expect(page.getByTestId('error')).toContainText('INVALID_FORMAT', { timeout: 90_000 });
  });
});
