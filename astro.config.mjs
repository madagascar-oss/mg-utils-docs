// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import starlightLinksValidator from 'starlight-links-validator';
import starlightTypeDoc from 'starlight-typedoc';
import { defineConfig } from 'astro/config';
import { URL, fileURLToPath } from 'node:url';
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
      plugins: [
        // JS API reference generated from the TSDoc comments of the JS port (every export has one).
        starlightTypeDoc({
          entryPoints: ['words', 'phone', 'ariary', 'date'].map(
            (module) => `./ports/js/packages/${module}/src/index.ts`,
          ),
          tsconfig: './tsconfig.typedoc.json',
          output: 'docs/reference/js',
          sidebar: { label: 'JavaScript API', collapsed: true },
          typeDoc: {
            excludeExternals: true,
            // One page per package, every export on it, titled with the npm name.
            router: 'module',
            pageTitleTemplates: { module: '@madagascar-oss/{name}' },
            disableSources: true,
            plugin: ['./scripts/typedoc-module-names.mjs'],
          },
        }),
        // /play/ is an Astro page, which the validator cannot see; its own e2e tests cover it.
        starlightLinksValidator({ exclude: ['/mg-utils-docs/play/', '/play/'] }),
      ],
      sidebar,
      routeMiddleware: './src/route-middleware.ts',
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    // php-wasm (playground PHP runner): ship only PHP 8.4. Every other version is ~40 MB of
    // WebAssembly that the bundler would otherwise emit, so those imports point at a stub.
    resolve: {
      alias: [
        ...['8-5', '8-3', '8-2', '8-1', '8-0', '7-4', '5-2'].map((version) => ({
          find: `@php-wasm/web-${version}`,
          replacement: fileURLToPath(
            new URL('./src/playground/stubs/php-version.ts', import.meta.url),
          ),
        })),
        {
          find: /^.*(icu\.dat|intl\.so\?url)$/,
          replacement: fileURLToPath(
            new URL('./src/playground/stubs/empty-asset.ts', import.meta.url),
          ),
        },
      ],
    },
    assetsInclude: [/\.dat$/, /\.so$/, /\.la$/],
    optimizeDeps: { exclude: ['@php-wasm/web'] },
    worker: { format: 'es' },
  },
});
