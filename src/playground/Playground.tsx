// The /play app, laid out like play.tailwindcss.com: a top bar, the editor on the left and
// the output on the right (stacked on small screens). Runs automatically as you type.
import { useEffect, useState } from 'react';
import Editor from './Editor.tsx';
import { useDarkMode } from './hooks/useDarkMode.ts';
import { useRunner } from './hooks/useRunner.ts';
import { isAvailable } from './runners/index.ts';
import { fromHash, toHash, type Snapshot } from './share.ts';
import { starter } from './starters.ts';
import type { PlaygroundText } from './text.ts';
import type { LanguageId, ModuleId } from './types.ts';
import OutputPanel from './ui/OutputPanel.tsx';
import TopBar from './ui/TopBar.tsx';

interface Props {
  readonly text: PlaygroundText;
  readonly homeHref: string;
  readonly docsHref: string;
  readonly logo: { readonly light: string; readonly dark: string };
}

const AUTO_RUN_DELAY_MS = 400;
const COPIED_NOTICE_MS = 2000;

/** A shared link wins; otherwise the JavaScript starter for number words. */
function initialState(): Snapshot {
  const shared = typeof location === 'undefined' ? undefined : fromHash(location.hash);
  if (shared && isAvailable(shared.language)) return shared;
  return { language: 'js', module: 'words', code: starter('js', 'words') };
}

export default function Playground({ text, homeHref, docsHref, logo }: Props) {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const dark = useDarkMode();
  const { result, busy, run, clear } = useRunner();

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
    clear();
    setState({ language, module, code: starter(language, module) });
  };

  const runNow = () => {
    void run(state.language, state.code);
  };

  const share = () => {
    void navigator.clipboard.writeText(location.href).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, COPIED_NOTICE_MS);
    });
  };

  return (
    <div className="flex h-dvh flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <TopBar
        text={text}
        homeHref={homeHref}
        docsHref={docsHref}
        logoSrc={dark ? logo.dark : logo.light}
        language={state.language}
        module={state.module}
        copied={copied}
        onChoose={choose}
        onRun={runNow}
        onShare={share}
      />
      <main className="grid min-h-0 flex-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
        <section
          aria-label={text.code}
          className="min-h-0 border-b border-gray-200 md:border-r md:border-b-0 dark:border-gray-800"
        >
          <Editor
            value={state.code}
            language={state.language}
            dark={dark}
            onChange={(code) => {
              setState((previous) => ({ ...previous, code }));
            }}
            onRun={runNow}
          />
        </section>
        <OutputPanel text={text} busy={busy} result={result} />
      </main>
    </div>
  );
}
