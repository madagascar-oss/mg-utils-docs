// Bundles the JS port from its sources into one browser ES module, public/js/mdg-utils.js.
// The playground maps every `@mdgascar/*` import to it: `utils` re-exports all modules.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PACKAGES = `${ROOT}ports/js/packages`;

await build({
  entryPoints: [`${PACKAGES}/utils/src/index.ts`],
  outfile: `${ROOT}public/js/mdg-utils.js`,
  bundle: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  logLevel: 'warning',
  plugins: [
    {
      name: 'workspace-packages',
      setup(builder) {
        builder.onResolve({ filter: /^@mdgascar\/[a-z]+$/ }, (args) => ({
          path: `${PACKAGES}/${args.path.split('/')[1] ?? ''}/src/index.ts`,
        }));
      },
    },
  ],
});
console.log('Bundled the JS port into public/js/mdg-utils.js');
