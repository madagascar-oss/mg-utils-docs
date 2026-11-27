// Facts shown in the header and footer, read from the pinned port submodules.
import utilsPackage from '../../ports/js/packages/utils/package.json' with { type: 'json' };

const packageVersion: string = utilsPackage.version;
export const versionLabel = `v${packageVersion.split('.').slice(0, 2).join('.')}`;

export const links = {
  github: 'https://github.com/mdgascar',
  spec: 'https://github.com/mdgascar/mdg-utils-spec',
  js: 'https://github.com/mdgascar/mdg-utils-js',
  php: 'https://github.com/mdgascar/mdg-utils-php',
  laravel: 'https://github.com/mdgascar/mdg-utils-laravel',
  symfony: 'https://github.com/mdgascar/mdg-utils-bundle',
  docs: 'https://github.com/mdgascar/mdg-utils-docs',
  npm: 'https://www.npmjs.com/package/@mdgascar/utils',
  packagist: 'https://packagist.org/packages/mdgascar/mdg-utils',
} as const;
