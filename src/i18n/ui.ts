// UI strings outside Starlight's own translations. Malagasy and French are drafts pending native review.
export type Locale = 'en' | 'mg' | 'fr';

const strings = {
  en: {
    'nav.docs': 'Docs',
    'nav.play': 'Play',
    'nav.spec': 'Spec',
    'footer.docs': 'Documentation',
    'footer.packages': 'Packages',
    'footer.community': 'Community',
    'footer.installation': 'Installation',
    'footer.playground': 'Playground',
    'footer.license': 'Released under the MIT License.',
    'install.methods': 'Installation methods',
  },
  mg: {
    'nav.docs': 'Torolalana',
    'nav.play': 'Andramo',
    'nav.spec': 'Famaritana',
    'footer.docs': 'Torolalana',
    'footer.packages': 'Fonosana',
    'footer.community': 'Fiaraha-monina',
    'footer.installation': 'Fametrahana',
    'footer.playground': 'Toerana fanandramana',
    'footer.license': 'Navoaka eo ambanin’ny fahazoan-dalana MIT.',
    'install.methods': 'Fomba fametrahana',
  },
  fr: {
    'nav.docs': 'Docs',
    'nav.play': 'Essayer',
    'nav.spec': 'Spécification',
    'footer.docs': 'Documentation',
    'footer.packages': 'Paquets',
    'footer.community': 'Communauté',
    'footer.installation': 'Installation',
    'footer.playground': 'Bac à sable',
    'footer.license': 'Publié sous licence MIT.',
    'install.methods': 'Méthodes d’installation',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof strings)['en'];

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
