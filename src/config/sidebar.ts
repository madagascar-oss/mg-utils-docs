// Left sidebar: grouped like tailwindcss.com/docs. Group labels double as the page kicker
// (see components/PageTitle.astro). Malagasy and French labels are drafts pending native review.
import type { StarlightUserConfig } from '@astrojs/starlight/types';

type Sidebar = NonNullable<StarlightUserConfig['sidebar']>;

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
