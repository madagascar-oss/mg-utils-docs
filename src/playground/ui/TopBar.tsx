// Top bar: brand, module picker, language switch and the Reset, Run, Share and Docs actions.
import { isAvailable, LANGUAGES } from '../runners/index.ts';
import type { PlaygroundText } from '../text.ts';
import { MODULES, type LanguageId, type ModuleId } from '../types.ts';

interface Props {
  readonly text: PlaygroundText;
  readonly homeHref: string;
  readonly docsHref: string;
  readonly logoSrc: string;
  readonly language: LanguageId;
  readonly module: ModuleId;
  readonly copied: boolean;
  readonly onChoose: (language: LanguageId, module: ModuleId) => void;
  readonly onRun: () => void;
  readonly onShare: () => void;
}

export default function TopBar(props: Props) {
  const { text, language, module, onChoose } = props;
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-2.5 dark:border-gray-800">
      <a href={props.homeHref} className="flex items-center gap-2 font-semibold">
        <img src={props.logoSrc} alt="" width="42" height="28" />
        <span>mg-utils</span>
      </a>
      <span className="text-sm text-gray-500 dark:text-gray-400">{text.title}</span>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="play-module">
          Module
        </label>
        <select
          id="play-module"
          value={module}
          onChange={(event) => {
            onChoose(language, event.target.value as ModuleId);
          }}
          className="rounded-lg border border-gray-300 bg-transparent px-2.5 py-1.5 text-sm dark:border-gray-700"
        >
          {MODULES.map((id) => (
            <option key={id} value={id}>
              {text.modules[id]}
            </option>
          ))}
        </select>

        <div
          role="radiogroup"
          aria-label="Language"
          className="flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700"
        >
          {LANGUAGES.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              role="radio"
              aria-checked={language === candidate.id}
              disabled={!isAvailable(candidate.id)}
              onClick={() => {
                onChoose(candidate.id, module);
              }}
              className="rounded-md px-3 py-1 text-sm font-medium aria-checked:bg-accent-600 aria-checked:text-white disabled:opacity-40"
            >
              {candidate.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            onChoose(language, module);
          }}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {text.reset}
        </button>
        <button
          type="button"
          onClick={props.onRun}
          title="Ctrl/⌘ + Enter"
          className="rounded-lg bg-accent-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-700"
        >
          {text.run}
        </button>
        <button
          type="button"
          onClick={props.onShare}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium dark:border-gray-700"
        >
          {props.copied ? text.copied : text.share}
        </button>
        <a
          href={props.docsHref}
          className="px-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {text.docs}
        </a>
      </div>
    </header>
  );
}
