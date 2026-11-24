// Left sidebar: grouped like tailwindcss.com/docs. Group labels double as the page kicker
// (see components/PageTitle.astro). Malagasy and French labels are drafts pending native review.
import type { StarlightUserConfig } from '@astrojs/starlight/types';

type Sidebar = NonNullable<StarlightUserConfig['sidebar']>;

const modules = [
  { slug: 'words', label: 'Number words', mg: 'Isa an-teny', fr: 'Nombres en lettres' },
  { slug: 'phone', label: 'Phone numbers', mg: 'Laharan-telefaonina', fr: 'Numéros de téléphone' },
  { slug: 'ariary', label: 'Ariary amounts', mg: 'Vola ariary', fr: 'Montants en ariary' },
  { slug: 'date', label: 'Dates', mg: 'Daty', fr: 'Dates' },
];

export const sidebar: Sidebar = [
  {
    label: 'Getting started',
    translations: { mg: 'Fanombohana', fr: 'Prise en main' },
    items: [
      {
        label: 'Installation',
        translations: { mg: 'Fametrahana', fr: 'Installation' },
        link: '/docs/installation/using-npm/',
      },
      {
        label: 'Parsing and errors',
        translations: { mg: 'Famakiana sy hadisoana', fr: 'Analyse et erreurs' },
        link: '/docs/parsing-and-errors/',
      },
      {
        label: 'Versioning',
        translations: { mg: 'Kinova', fr: 'Versions' },
        link: '/docs/versioning/',
      },
    ],
  },
  {
    label: 'Modules',
    translations: { mg: 'Môdily', fr: 'Modules' },
    items: modules.map((module) => ({
      label: module.label,
      translations: { mg: module.mg, fr: module.fr },
      collapsed: true,
      items: [
        {
          label: 'Usage',
          translations: { mg: 'Fampiasana', fr: 'Utilisation' },
          link: `/docs/${module.slug}/`,
        },
        {
          label: 'Rules and sources',
          translations: { mg: 'Fitsipika sy loharano', fr: 'Règles et sources' },
          link: `/docs/${module.slug}/rules/`,
        },
      ],
    })),
  },
  {
    label: 'Reference',
    translations: { mg: 'Fanondroana', fr: 'Référence' },
    items: [
      {
        label: 'JavaScript API',
        translations: { mg: 'API JavaScript', fr: 'API JavaScript' },
        items: modules.map((module) => ({
          label: `@madagascar-oss/${module.slug}`,
          link: `/docs/reference/js/${module.slug}/`,
        })),
      },
      {
        label: 'PHP API',
        translations: { mg: 'API PHP', fr: 'API PHP' },
        link: '/docs/reference/php/',
      },
    ],
  },
  {
    label: 'Spec',
    translations: { mg: 'Famaritana', fr: 'Spécification' },
    items: [
      {
        label: 'One spec, every language',
        translations: {
          mg: 'Famaritana iray ho an’ny fiteny rehetra',
          fr: 'Une spécification, tous les langages',
        },
        link: '/docs/spec/',
      },
    ],
  },
];
