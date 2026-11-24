// Stands in for the PHP versions the playground does not ship (see astro.config.mjs).
// Only PHP 8.4 is bundled; each version is about 40 MB of WebAssembly.
export function getPHPLoaderModule(): never {
  throw new Error('Only PHP 8.4 is available in the playground.');
}

export function getIntlExtensionPath(): never {
  throw new Error('The intl extension is not bundled in the playground.');
}
