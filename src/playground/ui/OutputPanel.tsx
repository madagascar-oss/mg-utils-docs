// Output panel: console lines, the error with its spec code, and how long the run took.
import type { PlaygroundText } from '../text.ts';
import type { LogLine, RunResult } from '../types.ts';

interface Props {
  readonly text: PlaygroundText;
  readonly busy: boolean;
  readonly result: RunResult | undefined;
}

const LINE_CLASS: Record<LogLine['kind'], string> = {
  log: '',
  warn: 'text-amber-600',
  error: 'text-error',
};

function status(text: PlaygroundText, busy: boolean, result: RunResult | undefined): string {
  if (busy) return text.loading;
  return result ? text.ranIn.replace('{ms}', String(Math.round(result.durationMs))) : '';
}

function Lines({ text, result }: { text: PlaygroundText; result: RunResult }) {
  return (
    <>
      {result.logs.map((line, index) => (
        <div key={index} className={LINE_CLASS[line.kind]}>
          {line.text}
        </div>
      ))}
      {result.error && (
        <div
          data-testid="error"
          className="mt-2 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-error"
        >
          {result.error.code && <strong className="mr-2">{result.error.code}</strong>}
          {result.error.message}
        </div>
      )}
      {result.logs.length === 0 && !result.error && (
        <span className="text-gray-400">{text.noOutput}</span>
      )}
    </>
  );
}

export default function OutputPanel({ text, busy, result }: Props) {
  return (
    <section aria-label={text.output} className="flex min-h-0 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
        <span>{text.output}</span>
        <span className="font-normal normal-case" aria-live="polite">
          {status(text, busy, result)}
        </span>
      </div>
      <pre
        data-testid="output"
        className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm leading-6 whitespace-pre-wrap"
      >
        {result === undefined ? (
          <span className="text-gray-400">{text.empty}</span>
        ) : (
          <Lines text={text} result={result} />
        )}
      </pre>
    </section>
  );
}
