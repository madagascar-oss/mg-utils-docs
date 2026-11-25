// Runs code through the language's runner. Only the latest run updates the result, so a slow
// earlier run never overwrites a newer one.
import { useCallback, useRef, useState } from 'react';
import { runnerFor } from '../runners/index.ts';
import type { LanguageId, RunResult } from '../types.ts';

export interface RunnerState {
  readonly result: RunResult | undefined;
  readonly busy: boolean;
  readonly run: (language: LanguageId, code: string) => Promise<void>;
  readonly clear: () => void;
}

export function useRunner(): RunnerState {
  const [result, setResult] = useState<RunResult | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const latest = useRef(0);

  const run = useCallback(async (language: LanguageId, code: string) => {
    const ticket = ++latest.current;
    setBusy(true);
    const runner = runnerFor(language);
    await runner.load();
    const outcome = await runner.run(code);
    if (ticket === latest.current) {
      setResult(outcome);
      setBusy(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(undefined);
  }, []);

  return { result, busy, run, clear };
}
