// Runs one JavaScript snippet as an ES module. console output is sent back line by line.
/// <reference lib="webworker" />

interface RunMessage {
  readonly code: string;
}

type Kind = 'log' | 'warn' | 'error';

function show(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Error) {
    const code = (value as { code?: unknown }).code;
    return `${value.name}${typeof code === 'string' ? ` [${code}]` : ''}: ${value.message}`;
  }
  if (value === undefined) return 'undefined';
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
  if (typeof value === 'bigint') return `${value.toString()}n`;
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

function capture(kind: Kind) {
  return (...values: unknown[]): void => {
    postMessage({ type: 'log', kind, text: values.map(show).join(' ') });
  };
}

console.log = capture('log');
console.info = capture('log');
console.warn = capture('warn');
console.error = capture('error');

addEventListener('message', (event: MessageEvent<RunMessage>) => {
  const url = URL.createObjectURL(new Blob([event.data.code], { type: 'text/javascript' }));
  import(/* @vite-ignore */ url)
    .then(() => {
      postMessage({ type: 'done' });
    })
    .catch((error: unknown) => {
      const code = (error as { code?: unknown }).code;
      postMessage({
        type: 'done',
        error: {
          code: typeof code === 'string' ? code : undefined,
          message: error instanceof Error ? `${error.name}: ${error.message}` : show(error),
        },
      });
    })
    .finally(() => {
      URL.revokeObjectURL(url);
    });
});
