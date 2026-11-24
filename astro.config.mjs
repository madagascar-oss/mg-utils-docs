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
      // Madagascar OSS brand kit: the ravinala mark, green on light, light green on dark.
      logo: {
        light: './src/assets/brand/mark-green.svg',
        dark: './src/assets/brand/mark-light-green.svg',
      },
      favicon: '/brand/favicon-32.png',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '192x192',
            href: '/mg-utils-docs/brand/favicon-192.png',
          },
        },
        {
          tag: 'link',
          attrs: { rel: 'apple-touch-icon', href: '/mg-utils-docs/brand/favicon-180.png' },
        },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#08432D' } },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://madagascar-oss.github.io/mg-utils-docs/brand/social-banner.png',
          },
        },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1280' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '640' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ],
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
