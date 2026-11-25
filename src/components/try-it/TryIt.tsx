// Inline "Try it" widget for a module page: edit the input, see the result from the real JS
// port, the same call in JavaScript and PHP, and a link that opens it in the playground.
import { useMemo, useState } from 'react';
import { toHash } from '../../playground/share.ts';
import type { ModuleId } from '../../playground/types.ts';
import { ariary } from './ariary.ts';
import { date } from './date.ts';
import { phone } from './phone.ts';
import type { TryModule } from './types.ts';
import { words } from './words.ts';

interface Props {
  readonly module: ModuleId;
  readonly playHref: string;
  readonly labels: { readonly input: string; readonly result: string; readonly open: string };
}

const MODULES: Record<ModuleId, TryModule> = { words, phone, ariary, date };

const fieldClass =
  'rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700';

export default function TryIt({ module, playHref, labels }: Props) {
  const definition = MODULES[module];
  const [input, setInput] = useState(definition.initialInput);
  const [option, setOption] = useState(definition.options[0] ?? '');
  const outcome = useMemo(() => definition.compute(input, option), [definition, input, option]);
  const playLink = `${playHref}${toHash({ language: 'js', module, code: outcome.snippet })}`;

  return (
    <div className="not-content my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex flex-wrap items-end gap-3 bg-gray-50 p-4 dark:bg-gray-900">
        <label className="min-w-48 flex-1 text-xs font-medium text-gray-600 dark:text-gray-400">
          {labels.input}
          <input
            className={`${fieldClass} mt-1 w-full font-mono`}
            type={definition.inputType}
            inputMode={definition.inputMode}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </label>
        {definition.options.length > 0 && (
          <select
            aria-label="Option"
            className={fieldClass}
            value={option}
            onChange={(event) => {
              setOption(event.target.value);
            }}
          >
            {definition.options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{labels.result}</p>
        <p
          data-testid="try-result"
          className={`text-lg font-semibold ${outcome.error ? 'text-error' : 'text-accent-700 dark:text-accent-300'}`}
        >
          {outcome.error ?? outcome.value}
        </p>
        <div className="grid gap-1 font-mono text-xs text-gray-600 dark:text-gray-400">
          <code>
            <span className="mr-2 inline-block w-8 text-gray-400">JS</span>
            {outcome.js}
          </code>
          <code>
            <span className="mr-2 inline-block w-8 text-gray-400">PHP</span>
            {outcome.php}
          </code>
        </div>
        <a
          href={playLink}
          className="inline-block text-sm font-semibold text-accent-700 dark:text-accent-300"
        >
          {labels.open} →
        </a>
      </div>
    </div>
  );
}
