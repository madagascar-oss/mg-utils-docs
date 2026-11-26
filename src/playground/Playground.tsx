// The /play app, laid out like play.tailwindcss.com: a top bar, the editor on the left and
// the output on the right (stacked on small screens). Runs automatically as you type.
// Code from a share link is someone else's code: it waits for an explicit Run first.
import { useEffect, useRef, useState } from 'react';
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

/** The code in a share link, if the page was opened from one and its language can run here. */
function sharedSnapshot(): Snapshot | undefined {
  const shared = fromHash(location.hash);
  return shared && isAvailable(shared.language) ? shared : undefined;
}

/** What the server renders: the JavaScript starter for number words. */
function initialState(): Snapshot {
  return { language: 'js', module: 'words', code: starter('js', 'words') };
}

export default function Playground({ text, homeHref, docsHref, logo }: Props) {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const dark = useDarkMode();
  const { result, busy, run, clear } = useRunner();
  // Off for shared code until the visitor presses Run; on for our own starters.
  const autoRun = useRef(true);

  // A share link is applied after hydration: the prerendered HTML always shows the starter, and
  // React does not patch a <select> value that differs at hydration.
  useEffect(() => {
    const shared = sharedSnapshot();
    if (shared === undefined) return;
    autoRun.current = false;
    setState(shared);
  }, []);

  useEffect(() => {
    history.replaceState(null, '', toHash(state));
    if (!autoRun.current) return undefined;
    const timer = setTimeout(() => {
      void run(state.language, state.code);
    }, AUTO_RUN_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [state, run]);

  const choose = (language: LanguageId, module: ModuleId) => {
    autoRun.current = true;
    clear();
    setState({ language, module, code: starter(language, module) });
  };

  const runNow = () => {
    autoRun.current = true;
    void run(state.language, state.code);
  };

  const share = () => {
    navigator.clipboard.writeText(location.href).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, COPIED_NOTICE_MS);
      },
      () => {
        // Clipboard blocked (permissions, insecure context): the link stays in the address bar.
      },
    );
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
