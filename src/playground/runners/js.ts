// JavaScript and TypeScript runner: strips types with sucrase, points @madagascar-oss/* imports
// at the bundled port (public/js/mg-utils.js), and runs the result in a module Web Worker.
import {
  RUN_TIMEOUT_MS,
  type LogLine,
  type RunError,
  type RunResult,
  type Runner,
} from '../types.ts';

const PACKAGE_IMPORT = /(from\s*|import\s*\(\s*|import\s+)(['"])@madagascar-oss\/[a-z]+\2/g;

function bundleUrl(): string {
  return new URL(`${import.meta.env.BASE_URL}js/mg-utils.js`, location.href).href;
}

/** TypeScript → JavaScript, with package imports pointing at the bundle. sucrase loads on first run. */
async function prepare(code: string): Promise<string> {
  const { transform } = await import('sucrase');
  const { code: javascript } = transform(code, {
    transforms: ['typescript'],
    disableESTransforms: true,
  });
  return javascript.replace(
    PACKAGE_IMPORT,
    (_match, keyword: string, quote: string) => `${keyword}${quote}${bundleUrl()}${quote}`,
  );
}

function newWorker(): Worker {
  return new Worker(new URL('../workers/js.worker.ts', import.meta.url), { type: 'module' });
}

export function createJsRunner(): Runner {
  let worker = newWorker();

  return {
    id: 'js',
    label: 'JavaScript',
    load: () => Promise.resolve(),
    async run(code: string): Promise<RunResult> {
      const started = performance.now();
      const logs: LogLine[] = [];
      let javascript: string;
      try {
        javascript = await prepare(code);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { logs, error: { message: `SyntaxError: ${message}` }, durationMs: 0 };
      }

      return new Promise((resolve) => {
        const finish = (error?: RunError) => {
          clearTimeout(timer);
          worker.removeEventListener('message', onMessage);
          resolve({ logs, durationMs: performance.now() - started, ...(error ? { error } : {}) });
        };
        const onMessage = (
          event: MessageEvent<{
            type: string;
            kind?: LogLine['kind'];
            text?: string;
            error?: RunError;
          }>,
        ) => {
          const data = event.data;
          if (data.type === 'log') logs.push({ kind: data.kind ?? 'log', text: data.text ?? '' });
          if (data.type === 'done') finish(data.error);
        };
        const timer = setTimeout(() => {
          worker.terminate();
          worker = newWorker();
          finish({ message: `Stopped after ${String(RUN_TIMEOUT_MS / 1000)} s (infinite loop?).` });
        }, RUN_TIMEOUT_MS);
        worker.addEventListener('message', onMessage);
        worker.postMessage({ code: javascript });
      });
    },
  };
}
