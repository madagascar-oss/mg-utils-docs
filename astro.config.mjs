// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import starlightLinksValidator from 'starlight-links-validator';
import { defineConfig } from 'astro/config';
import { head } from './src/config/head.ts';
import { phpWasm } from './src/config/php-wasm.ts';
import { sidebar } from './src/config/sidebar.ts';
import { typeDocPlugin } from './src/config/typedoc.ts';

// Served from GitHub Pages under /mg-utils-docs/. With a custom domain, drop `base`.
export default defineConfig({
  site: 'https://madagascar-oss.github.io',
  base: '/mg-utils-docs',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'mg-utils',
      description:
        'Malagasy number words, Madagascar phone numbers, Ariary amounts and dates — the same in every language.',
      // Madagascar OSS brand kit: the ravinala mark, green on light, light green on dark.
      logo: {
        light: './src/assets/brand/mark-green.svg',
        dark: './src/assets/brand/mark-light-green.svg',
      },
      favicon: '/brand/favicon-32.png',
      head,
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        mg: { label: 'Malagasy', lang: 'mg' },
        fr: { label: 'Français', lang: 'fr' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/madagascar-oss/mg-utils-docs',
        },
      ],
      customCss: [
        '@fontsource-variable/inter',
        '@fontsource-variable/jetbrains-mono',
        './src/styles/global.css',
      ],
      components: {
        Header: './src/components/Header.astro',
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
      },
      expressiveCode: { defaultProps: { wrap: true } },
      editLink: { baseUrl: 'https://github.com/madagascar-oss/mg-utils-docs/edit/dev/' },
      plugins: [
        typeDocPlugin,
        // /play/ is an Astro page, which the validator cannot see; its own e2e tests cover it.
        // Rules pages exist in English only; translated pages link to their English fallback.
        starlightLinksValidator({
          exclude: ['/mg-utils-docs/play/', '/mg-utils-docs/{mg,fr}/play/'],
          errorOnFallbackPages: false,
        }),
      ],
      sidebar,
      routeMiddleware: './src/route-middleware.ts',
    }),
    react(),
  ],
  vite: { plugins: [tailwindcss()], ...phpWasm },
});
