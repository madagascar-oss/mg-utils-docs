// Bundles the JS port from its sources into one browser ES module, public/js/mg-utils.js.
// The playground maps every `@madagascar-oss/*` import to it: `utils` re-exports all modules.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PACKAGES = `${ROOT}ports/js/packages`;

await build({
  entryPoints: [`${PACKAGES}/utils/src/index.ts`],
  outfile: `${ROOT}public/js/mg-utils.js`,
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
        builder.onResolve({ filter: /^@madagascar-oss\/[a-z]+$/ }, (args) => ({
          path: `${PACKAGES}/${args.path.split('/')[1] ?? ''}/src/index.ts`,
        }));
      },
    },
  ],
});
console.log('Bundled the JS port into public/js/mg-utils.js');
