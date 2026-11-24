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
    'play.title': 'Playground',
    'play.run': 'Run',
    'play.share': 'Share',
    'play.copied': 'Link copied',
    'play.reset': 'Reset',
    'play.output': 'Output',
    'play.empty': 'Run the code to see its output here.',
    'play.loading': 'Loading the runtime…',
    'play.ranIn': 'Ran in {ms} ms',
    'play.noOutput': 'No output. Use console.log (JavaScript) or echo (PHP).',
    'play.module.words': 'Number words',
    'play.module.phone': 'Phone numbers',
    'play.module.ariary': 'Ariary amounts',
    'play.module.date': 'Dates',
    'play.docs': 'Docs',
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
    'play.title': 'Toerana fanandramana',
    'play.run': 'Alefa',
    'play.share': 'Zarao',
    'play.copied': 'Voadika ny rohy',
    'play.reset': 'Averina',
    'play.output': 'Valiny',
    'play.empty': 'Alefaso ny kaody mba hahitana ny valiny eto.',
    'play.loading': 'Mampiditra ny fitaovana…',
    'play.ranIn': 'Vita tao anatin’ny {ms} ms',
    'play.noOutput': 'Tsy misy valiny. Ampiasao console.log (JavaScript) na echo (PHP).',
    'play.module.words': 'Isa an-teny',
    'play.module.phone': 'Laharan-telefaonina',
    'play.module.ariary': 'Vola ariary',
    'play.module.date': 'Daty',
    'play.docs': 'Torolalana',
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
    'play.title': 'Bac à sable',
    'play.run': 'Exécuter',
    'play.share': 'Partager',
    'play.copied': 'Lien copié',
    'play.reset': 'Réinitialiser',
    'play.output': 'Sortie',
    'play.empty': 'Exécutez le code pour voir sa sortie ici.',
    'play.loading': 'Chargement de l’environnement…',
    'play.ranIn': 'Exécuté en {ms} ms',
    'play.noOutput': 'Aucune sortie. Utilisez console.log (JavaScript) ou echo (PHP).',
    'play.module.words': 'Nombres en lettres',
    'play.module.phone': 'Numéros de téléphone',
    'play.module.ariary': 'Montants en ariary',
    'play.module.date': 'Dates',
    'play.docs': 'Docs',
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
