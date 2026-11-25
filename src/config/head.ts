// Extra <head> tags from the Madagascar OSS brand kit: icons, theme colour, link previews.
import type { StarlightUserConfig } from '@astrojs/starlight/types';

const SITE = 'https://madagascar-oss.github.io/mg-utils-docs';
const BRAND_COLOR = '#08432D';

export const head: NonNullable<StarlightUserConfig['head']> = [
  {
    tag: 'link',
    attrs: {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      href: '/mg-utils-docs/brand/favicon-192.png',
    },
  },
  { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/mg-utils-docs/brand/favicon-180.png' } },
  { tag: 'meta', attrs: { name: 'theme-color', content: BRAND_COLOR } },
  { tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/brand/social-banner.png` } },
  { tag: 'meta', attrs: { property: 'og:image:width', content: '1280' } },
  { tag: 'meta', attrs: { property: 'og:image:height', content: '640' } },
  { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
];
