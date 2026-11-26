// JavaScript API reference generated from the TSDoc comments of the JS port (every export has one).
import starlightTypeDoc from 'starlight-typedoc';

const MODULES = ['words', 'phone', 'ariary', 'date'];

export const typeDocPlugin = starlightTypeDoc({
  entryPoints: MODULES.map((module) => `./ports/js/packages/${module}/src/index.ts`),
  tsconfig: './tsconfig.typedoc.json',
  output: 'docs/reference/js',
  sidebar: { label: 'JavaScript API', collapsed: true },
  typeDoc: {
    excludeExternals: true,
    // One page per package, every export on it, titled with the npm name.
    router: 'module',
    pageTitleTemplates: { module: '@mdgascar/{name}' },
    disableSources: true,
    plugin: ['./scripts/typedoc-module-names.mjs'],
  },
});
