// Left sidebar: grouped like tailwindcss.com/docs. Group labels double as the page kicker
// (see components/PageTitle.astro). French labels are drafts pending native review.
import type { StarlightUserConfig } from '@astrojs/starlight/types';

type Sidebar = NonNullable<StarlightUserConfig['sidebar']>;

const modules = [
  { slug: 'words', label: 'Number words', fr: 'Nombres en lettres' },
  { slug: 'phone', label: 'Phone numbers', fr: 'Numéros de téléphone' },
  { slug: 'ariary', label: 'Ariary amounts', fr: 'Montants en ariary' },
  { slug: 'date', label: 'Dates', fr: 'Dates' },
];

export const sidebar: Sidebar = [
  {
    label: 'Getting started',
    translations: { fr: 'Prise en main' },
    items: [
      {
        label: 'Installation',
        translations: { fr: 'Installation' },
        link: '/docs/installation/using-npm/',
      },
      {
        label: 'Parsing and errors',
        translations: { fr: 'Analyse et erreurs' },
        link: '/docs/parsing-and-errors/',
      },
      {
        label: 'Versioning',
        translations: { fr: 'Versions' },
        link: '/docs/versioning/',
      },
      {
        label: 'Changelog',
        translations: { fr: 'Journal des modifications' },
        link: '/docs/changelog/',
      },
    ],
  },
  {
    label: 'Guides',
    translations: { fr: 'Guides' },
    items: [
      {
        label: 'Frameworks',
        translations: { fr: 'Frameworks' },
        link: '/docs/guides/frameworks/',
      },
      {
        label: 'Use cases',
        translations: { fr: 'Cas d’usage' },
        link: '/docs/guides/use-cases/',
      },
    ],
  },
  {
    label: 'Modules',
    translations: { fr: 'Modules' },
    items: modules.map((module) => ({
      label: module.label,
      translations: { fr: module.fr },
      collapsed: true,
      items: [
        {
          label: 'Usage',
          translations: { fr: 'Utilisation' },
          link: `/docs/${module.slug}/`,
        },
        {
          label: 'Rules and sources',
          translations: { fr: 'Règles et sources' },
          link: `/docs/${module.slug}/rules/`,
        },
      ],
    })),
  },
  {
    label: 'Reference',
    translations: { fr: 'Référence' },
    items: [
      {
        label: 'JavaScript API',
        translations: { fr: 'API JavaScript' },
        items: modules.map((module) => ({
          label: `@mdgascar/${module.slug}`,
          link: `/docs/reference/js/${module.slug}/`,
        })),
      },
      {
        label: 'PHP API',
        translations: { fr: 'API PHP' },
        link: '/docs/reference/php/',
      },
    ],
  },
  {
    label: 'Spec',
    translations: { fr: 'Spécification' },
    items: [
      {
        label: 'One spec, every language',
        translations: { fr: 'Une spécification, tous les langages' },
        link: '/docs/spec/',
      },
    ],
  },
];
