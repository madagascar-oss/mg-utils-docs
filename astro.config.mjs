// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { sidebar } from './src/config/sidebar.ts';

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
      logo: { src: './src/assets/logo.svg' },
      favicon: '/favicon.svg',
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
      sidebar,
      routeMiddleware: './src/route-middleware.ts',
    }),
    react(),
  ],
  vite: { plugins: [tailwindcss()] },
});
