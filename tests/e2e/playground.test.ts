import { expect, test } from '@playwright/test';

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
  await page.goto('play/');
  await page.locator('.cm-content').click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(
    "import { parseAriary } from '@madagascar-oss/ariary';\nparseAriary('1,500');",
  );
  await expect(page.getByTestId('error')).toContainText('INVALID_FORMAT');
});

test('stops an infinite loop', async ({ page }) => {
  await page.goto('play/');
  await page.locator('.cm-content').click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('while (true) {}');
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
