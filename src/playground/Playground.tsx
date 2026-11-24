// The /play app, laid out like play.tailwindcss.com: a top bar, the editor on the left and
// the output on the right (stacked on small screens). Runs automatically as you type.
import { useCallback, useEffect, useRef, useState } from 'react';
import Editor from './Editor.tsx';
import { isAvailable, LANGUAGES, runnerFor } from './runners/index.ts';
import { fromHash, toHash } from './share.ts';
import { starter } from './starters.ts';
import { MODULES, type LanguageId, type ModuleId, type RunResult } from './types.ts';

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

interface Props {
  readonly text: PlaygroundText;
  readonly homeHref: string;
  readonly docsHref: string;
  readonly logoSrc: string;
}

const AUTO_RUN_DELAY_MS = 400;

function initialState(): { language: LanguageId; module: ModuleId; code: string } {
  const shared = typeof location === 'undefined' ? undefined : fromHash(location.hash);
  if (shared && isAvailable(shared.language)) return shared;
  return { language: 'js', module: 'words', code: starter('js', 'words') };
}

function useDarkMode(): boolean {
  const read = () => document.documentElement.dataset['theme'] === 'dark';
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(read());
    const observer = new MutationObserver(() => {
      setDark(read());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  return dark;
}

export default function Playground({ text, homeHref, docsHref, logoSrc }: Props) {
  const [state, setState] = useState(initialState);
  const [result, setResult] = useState<RunResult | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const dark = useDarkMode();
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

  useEffect(() => {
    const timer = setTimeout(() => {
      void run(state.language, state.code);
    }, AUTO_RUN_DELAY_MS);
    history.replaceState(null, '', toHash(state));
    return () => {
      clearTimeout(timer);
    };
  }, [state, run]);

  const choose = (language: LanguageId, module: ModuleId) => {
    setResult(undefined);
    setState({ language, module, code: starter(language, module) });
  };

  const share = async () => {
    await navigator.clipboard.writeText(location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex h-dvh flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-2.5 dark:border-gray-800">
        <a href={homeHref} className="flex items-center gap-2 font-semibold">
          <img src={logoSrc} alt="" width="28" height="28" />
          <span>mg-utils</span>
        </a>
        <span className="text-sm text-gray-500 dark:text-gray-400">{text.title}</span>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="play-module">
            Module
          </label>
          <select
            id="play-module"
            value={state.module}
            onChange={(event) => {
              choose(state.language, event.target.value as ModuleId);
            }}
            className="rounded-lg border border-gray-300 bg-transparent px-2.5 py-1.5 text-sm dark:border-gray-700"
          >
            {MODULES.map((module) => (
              <option key={module} value={module}>
                {text.modules[module]}
              </option>
            ))}
          </select>

          <div
            role="radiogroup"
            aria-label="Language"
            className="flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700"
          >
            {LANGUAGES.map((language) => (
              <button
                key={language.id}
                type="button"
                role="radio"
                aria-checked={state.language === language.id}
                disabled={!isAvailable(language.id)}
                onClick={() => {
                  choose(language.id, state.module);
                }}
                className="rounded-md px-3 py-1 text-sm font-medium aria-checked:bg-accent-600 aria-checked:text-white disabled:opacity-40"
              >
                {language.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              choose(state.language, state.module);
            }}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {text.reset}
          </button>
          <button
            type="button"
            onClick={() => {
              void run(state.language, state.code);
            }}
            title="Ctrl/⌘ + Enter"
            className="rounded-lg bg-accent-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-700"
          >
            {text.run}
          </button>
          <button
            type="button"
            onClick={() => {
              void share();
            }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium dark:border-gray-700"
          >
            {copied ? text.copied : text.share}
          </button>
          <a
            href={docsHref}
            className="px-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {text.docs}
          </a>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
        <section
          aria-label="Code"
          className="min-h-0 border-b border-gray-200 md:border-r md:border-b-0 dark:border-gray-800"
        >
          <Editor
            value={state.code}
            language={state.language}
            dark={dark}
            onChange={(code) => {
              setState((previous) => ({ ...previous, code }));
            }}
            onRun={() => {
              void run(state.language, state.code);
            }}
          />
        </section>

        <section
          aria-label={text.output}
          className="flex min-h-0 flex-col bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
            <span>{text.output}</span>
            <span className="font-normal normal-case" aria-live="polite">
              {busy
                ? text.loading
                : result
                  ? text.ranIn.replace('{ms}', String(Math.round(result.durationMs)))
                  : ''}
            </span>
          </div>
          <pre
            data-testid="output"
            className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm leading-6 whitespace-pre-wrap"
          >
            {result === undefined ? (
              <span className="text-gray-400">{text.empty}</span>
            ) : (
              <>
                {result.logs.map((line, index) => (
                  <div
                    key={index}
                    className={
                      line.kind === 'log'
                        ? ''
                        : line.kind === 'warn'
                          ? 'text-amber-600'
                          : 'text-error'
                    }
                  >
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
            )}
          </pre>
        </section>
      </main>
    </div>
  );
}
