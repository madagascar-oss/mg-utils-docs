import { expect, test } from '@playwright/test';

const locales = [
  { prefix: '', lang: 'en' },
  { prefix: 'mg/', lang: 'mg' },
  { prefix: 'fr/', lang: 'fr' },
];

for (const { prefix, lang } of locales) {
  test(`installation page renders in ${lang}`, async ({ page }) => {
    await page.goto(`${prefix}docs/installation/using-npm/`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.mg-kicker')).toBeVisible();
    await expect(page.locator('.sl-steps > li')).toHaveCount(4);
  });
}

test('install methods link to each other', async ({ page }) => {
  await page.goto('docs/installation/using-npm/');
  await page.getByRole('link', { name: /Using Composer/ }).click();
  await expect(page).toHaveURL(/using-composer\/$/);
  await expect(page.getByRole('link', { name: /Using Composer/ })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('header links to docs, playground and spec', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the header nav is in the mobile menu');
  await page.goto('');
  const nav = page.getByRole('navigation', { name: 'Site' });
  await nav.getByRole('link', { name: 'Play' }).click();
  await expect(page).toHaveURL(/\/play\/$/);
  await nav.getByRole('link', { name: 'Spec' }).click();
  await expect(page).toHaveURL(/\/docs\/spec\/$/);
});

for (const module of ['words', 'phone', 'ariary', 'date']) {
  test(`${module}: usage page, rules page and JS reference`, async ({ page }) => {
    await page.goto(`docs/${module}/`);
    await expect(page.locator('.mg-kicker')).toHaveText('Modules');
    await expect(page.locator('table.mg-api tr').first()).toBeVisible();

    await page.goto(`docs/${module}/rules/`);
    await expect(page.getByRole('heading', { level: 2, name: 'Rules' })).toBeVisible();

    await page.goto(`docs/reference/js/${module}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`@madagascar-oss/${module}`);
  });
}

test('the language tab choice is shared across code blocks', async ({ page }) => {
  await page.goto('docs/ariary/');
  await page.getByRole('tab', { name: 'PHP' }).first().click();
  await expect(page.getByText('Ariary::fromInt(1500)->toWords()').first()).toBeVisible();
});
