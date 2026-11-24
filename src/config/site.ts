// Facts shown in the header and footer, read from the pinned port submodules.
import utilsPackage from '../../ports/js/packages/utils/package.json' with { type: 'json' };

const packageVersion: string = utilsPackage.version;
export const versionLabel = `v${packageVersion.split('.').slice(0, 2).join('.')}`;

export const links = {
  github: 'https://github.com/madagascar-oss',
  spec: 'https://github.com/madagascar-oss/mg-utils-spec',
  js: 'https://github.com/madagascar-oss/mg-utils-js',
  php: 'https://github.com/madagascar-oss/mg-utils-php',
  docs: 'https://github.com/madagascar-oss/mg-utils-docs',
  npm: 'https://www.npmjs.com/package/@madagascar-oss/utils',
  packagist: 'https://packagist.org/packages/madagascar-oss/mg-utils',
} as const;
