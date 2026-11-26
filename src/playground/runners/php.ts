// PHP runner: php-wasm in a Web Worker, booted once (about 8 MB, cached by the browser).
import {
  RUN_TIMEOUT_MS,
  type LogLine,
  type RunError,
  type RunResult,
  type Runner,
} from '../types.ts';

/** First boot downloads PHP; give it longer than a normal run. */
const BOOT_TIMEOUT_MS = 60_000;

interface Reply {
  readonly type: 'ready' | 'done';
  readonly stdout?: string;
  readonly error?: { readonly code: string | null; readonly message: string };
}

function newWorker(): Worker {
  return new Worker(new URL('../workers/php.worker.ts', import.meta.url), { type: 'module' });
}

function libraryUrl(): string {
  return new URL(`${import.meta.env.BASE_URL}php/mdg-utils.json`, location.href).href;
}

/** Sends one request and waits for its reply, or for the timeout. */
function ask(worker: Worker, message: object, timeoutMs: number): Promise<Reply | undefined> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      worker.removeEventListener('message', onMessage);
      resolve(undefined);
    }, timeoutMs);
    const onMessage = (event: MessageEvent<Reply>) => {
      clearTimeout(timer);
      worker.removeEventListener('message', onMessage);
      resolve(event.data);
    };
    worker.addEventListener('message', onMessage);
    worker.postMessage(message);
  });
}

export function createPhpRunner(): Runner {
  let worker = newWorker();
  let booting: Promise<void> | undefined;

  const load = () => {
    booting ??= ask(worker, { type: 'boot', libraryUrl: libraryUrl() }, BOOT_TIMEOUT_MS).then(
      (reply) => {
        if (reply?.type !== 'ready') {
          booting = undefined;
          throw new Error('PHP could not be loaded.');
        }
      },
    );
    return booting;
  };

  return {
    id: 'php',
    label: 'PHP',
    load,
    async run(code: string): Promise<RunResult> {
      const started = performance.now();
      try {
        await load();
      } catch (error) {
        return {
          logs: [],
          error: { message: error instanceof Error ? error.message : String(error) },
          durationMs: 0,
        };
      }
      const reply = await ask(worker, { type: 'run', code }, RUN_TIMEOUT_MS);
      if (reply === undefined) {
        // Runaway code: drop this PHP instance and boot a fresh one next time.
        worker.terminate();
        worker = newWorker();
        booting = undefined;
        return {
          logs: [],
          error: { message: `Stopped after ${String(RUN_TIMEOUT_MS / 1000)} s (infinite loop?).` },
          durationMs: performance.now() - started,
        };
      }
      const stdout = (reply.stdout ?? '').replace(/\n$/, '');
      const logs: LogLine[] =
        stdout === '' ? [] : stdout.split('\n').map((text) => ({ kind: 'log', text }));
      const error: RunError | undefined = reply.error
        ? { message: reply.error.message, ...(reply.error.code ? { code: reply.error.code } : {}) }
        : undefined;
      return { logs, durationMs: performance.now() - started, ...(error ? { error } : {}) };
    },
  };
}
