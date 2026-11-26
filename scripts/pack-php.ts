// Packs the PHP port's sources (ports/php/src/**/*.php) into public/php/mdg-utils.json, a map
// of relative path → source that the playground's PHP runner writes into php-wasm's filesystem.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(ROOT, 'ports', 'php', 'src');
const OUT_DIR = join(ROOT, 'public', 'php');

function phpFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return phpFiles(path);
    return entry.name.endsWith('.php') ? [path] : [];
  });
}

const files = Object.fromEntries(
  phpFiles(SOURCE)
    .sort()
    .map((path) => [relative(SOURCE, path), readFileSync(path, 'utf8')]),
);
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'mdg-utils.json'), JSON.stringify(files));
console.log(`Packed ${String(Object.keys(files).length)} PHP files into public/php/mdg-utils.json`);
