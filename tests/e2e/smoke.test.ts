import { expect, test } from '@playwright/test';

const locales = [
  { prefix: '', lang: 'en' },
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
  await page.goBack();
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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`@mdgascar/${module}`);
  });
}

test('the language tab choice is shared across code blocks', async ({ page }) => {
  await page.goto('docs/ariary/');
  await page.getByRole('tab', { name: 'PHP' }).first().click();
  await expect(page.getByText('Ariary::fromInt(1500)->spell()').first()).toBeVisible();
});

test('translated pages are written in their language', async ({ page }) => {
  await page.goto('fr/docs/installation/using-composer/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Bien démarrer avec mdg-utils pour PHP',
  );
  await expect(page.getByRole('link', { name: /Avec Composer/ })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('untranslated pages fall back to English with a notice', async ({ page }) => {
  await page.goto('fr/docs/phone/rules/');
  await expect(
    page.getByText('Ce contenu n’est pas encore disponible dans votre langue.'),
  ).toBeVisible();
});

test('the landing types real calls and fills the preview', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Malagasy data, right in one call.',
  );
  const demo = page.getByRole('region', { name: 'Code typed live, with its result' });
  await expect(demo.getByText('Ar 150 000')).toBeVisible();
  await expect(demo.locator('[data-field="date"]')).not.toHaveClass(/is-empty/, {
    timeout: 15_000,
  });
  await expect(demo.locator('[data-field="date"]')).toContainText('Alatsinainy 23 Novambra 2026');
  await demo.getByRole('tab', { name: 'receipt.php' }).click();
  await expect(demo.getByText('MalagasyDate::fromString', { exact: false })).toBeVisible({
    timeout: 15_000,
  });
});

test('the landing shows where it runs, and the guides show every framework', async ({ page }) => {
  await page.goto('');
  await expect(page.getByRole('heading', { name: 'Works in any project' })).toBeVisible();
  await expect(page.getByText('composer require mdgascar/mdg-utils-laravel')).toBeVisible();
  await expect(page.getByText('composer require mdgascar/mdg-utils-bundle')).toBeVisible();
  await page.goto('docs/guides/frameworks/');
  for (const name of ['React', 'Vue', 'Angular', 'Svelte', 'Laravel', 'Symfony']) {
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await page.goto('docs/guides/use-cases/');
  await expect(page.getByText('UNKNOWN_OPERATOR', { exact: false })).toBeVisible();
  await expect(page.getByText('telo safatsiroa', { exact: false })).toBeVisible();
});
