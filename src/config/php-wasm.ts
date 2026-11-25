// Vite settings for php-wasm (the playground's PHP runner). Only PHP 8.4 ships: every other
// version is ~40 MB of WebAssembly the bundler would otherwise emit, so those imports and the
// unused intl assets point at stubs.
import { fileURLToPath } from 'node:url';
import type { AstroUserConfig } from 'astro';

type ViteConfig = NonNullable<AstroUserConfig['vite']>;

const UNUSED_VERSIONS = ['8-5', '8-3', '8-2', '8-1', '8-0', '7-4', '5-2'];

const stub = (file: string) =>
  fileURLToPath(new URL(`../playground/stubs/${file}`, import.meta.url));

const alias = [
  ...UNUSED_VERSIONS.map((version) => ({
    find: `@php-wasm/web-${version}`,
    replacement: stub('php-version.ts'),
  })),
  { find: /^.*(icu\.dat|intl\.so\?url)$/, replacement: stub('empty-asset.ts') },
];

export const phpWasm: ViteConfig = {
  resolve: { alias },
  assetsInclude: [/\.dat$/, /\.so$/, /\.la$/],
  optimizeDeps: { exclude: ['@php-wasm/web'] },
  worker: { format: 'es' },
};
