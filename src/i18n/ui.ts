// UI strings outside Starlight's own translations (header, footer, playground), per locale.
import { en, type UiKey } from './strings/en.ts';
import { fr } from './strings/fr.ts';
import { mg } from './strings/mg.ts';

export type { UiKey };
export type Locale = 'en' | 'mg' | 'fr';

const strings = { en, mg, fr };

export function toLocale(starlightLocale: string | undefined): Locale {
  return starlightLocale === 'mg' || starlightLocale === 'fr' ? starlightLocale : 'en';
}

export function t(locale: Locale, key: UiKey): string {
  return strings[locale][key];
}

/** Site-relative link for a locale, with the base path: `/docs/x/` → `/mg-utils-docs/fr/docs/x/`. */
export function localePath(locale: Locale, path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${base}${prefix}${path}`;
}
