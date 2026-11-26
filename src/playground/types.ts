export type LanguageId = 'js' | 'php';
export type ModuleId = 'words' | 'phone' | 'ariary' | 'date';

export const MODULES: readonly ModuleId[] = ['words', 'phone', 'ariary', 'date'];

export interface LogLine {
  readonly kind: 'log' | 'warn' | 'error';
  readonly text: string;
}

export interface RunError {
  /** Spec error code (INVALID_FORMAT, …) when the code threw an mdg-utils error. */
  readonly code?: string;
  readonly message: string;
}

export interface RunResult {
  readonly logs: readonly LogLine[];
  readonly error?: RunError;
  readonly durationMs: number;
}

/**
 * Runs code for one language. Browser runners (JS, PHP; later Python, Ruby) and remote
 * runners (later Go, Java, .NET) all implement this, so the playground never changes.
 */
export interface Runner {
  readonly id: LanguageId;
  readonly label: string;
  /** Prepares the runtime; resolves when `run` can be called. Safe to call more than once. */
  load(onProgress?: (fraction: number) => void): Promise<void>;
  run(code: string): Promise<RunResult>;
}

/** Longest a snippet may run before its worker is stopped. */
export const RUN_TIMEOUT_MS = 3000;
