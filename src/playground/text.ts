import type { ModuleId } from './types.ts';

/** Translated labels of the playground, one set per site language. */
export interface PlaygroundText {
  readonly title: string;
  readonly run: string;
  readonly share: string;
  readonly copied: string;
  readonly reset: string;
  readonly output: string;
  readonly empty: string;
  readonly loading: string;
  readonly ranIn: string;
  readonly noOutput: string;
  readonly docs: string;
  readonly modules: Record<ModuleId, string>;
}
