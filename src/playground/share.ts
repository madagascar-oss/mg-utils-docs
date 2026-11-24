// Share links: language, module and code compressed into the URL hash. No backend.
import lzString from 'lz-string'; // CommonJS: named imports do not work during prerendering.
import { MODULES, type LanguageId, type ModuleId } from './types.ts';

const PREFIX = '#v1:';

export interface Snapshot {
  readonly language: LanguageId;
  readonly module: ModuleId;
  readonly code: string;
}

export function toHash(snapshot: Snapshot): string {
  const payload = JSON.stringify({ l: snapshot.language, m: snapshot.module, c: snapshot.code });
  return `${PREFIX}${lzString.compressToEncodedURIComponent(payload)}`;
}

export function fromHash(hash: string): Snapshot | undefined {
  if (!hash.startsWith(PREFIX)) return undefined;
  try {
    const json = lzString.decompressFromEncodedURIComponent(hash.slice(PREFIX.length));
    const data = JSON.parse(json) as { l?: unknown; m?: unknown; c?: unknown };
    const language = data.l === 'php' ? 'php' : 'js';
    const module = MODULES.find((candidate) => candidate === data.m) ?? 'words';
    return typeof data.c === 'string' ? { language, module, code: data.c } : undefined;
  } catch {
    return undefined;
  }
}
