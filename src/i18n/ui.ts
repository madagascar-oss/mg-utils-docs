// UI strings outside Starlight's own translations (header, footer, playground), per locale.
import { en, type UiKey } from './strings/en.ts';
import { fr } from './strings/fr.ts';

export type { UiKey };
export type Locale = 'en' | 'fr';

const strings = { en, fr };

export function toLocale(starlightLocale: string | undefined): Locale {
  return starlightLocale === 'fr' ? 'fr' : 'en';
}

export function t(locale: Locale, key: UiKey): string {
  return strings[locale][key];
}

/** Site-relative link for a locale, with the base path: `/docs/x/` → `/mdg-utils-docs/fr/docs/x/`. */
export function localePath(locale: Locale, path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${base}${prefix}${path}`;
}
