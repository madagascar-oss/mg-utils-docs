// Inline "Try it" widget for a module page: edit the input, see the result from the real JS
// port, the same call in JavaScript and PHP, and a link that opens it in the playground.
import { useMemo, useState } from 'react';
import {
  safeParseAriary,
  ariaryToWords,
  formatAriary,
} from '../../ports/js/packages/ariary/src/index.ts';
import { formatDate } from '../../ports/js/packages/date/src/index.ts';
import {
  OPERATOR_NAMES,
  formatPhoneNumber,
  safeParsePhoneNumber,
} from '../../ports/js/packages/phone/src/index.ts';
import { numberToWords } from '../../ports/js/packages/words/src/index.ts';
import { toHash } from '../playground/share.ts';
import type { ModuleId } from '../playground/types.ts';

interface Props {
  readonly module: ModuleId;
  readonly playHref: string;
  readonly labels: { readonly input: string; readonly result: string; readonly open: string };
}

interface Outcome {
  readonly value?: string;
  readonly error?: string;
  readonly js: string;
  readonly php: string;
  /** The same call as a complete playground snippet. */
  readonly snippet: string;
}

const snippet = (names: string, call: string) =>
  `import { ${names} } from '@madagascar-oss/utils';\n\nconsole.log(${call});\n`;

function attempt(compute: () => string): { value?: string; error?: string } {
  try {
    return { value: compute() };
  } catch (error) {
    const code = (error as { code?: unknown }).code;
    return { error: typeof code === 'string' ? code : String(error) };
  }
}

const quote = (text: string) => `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;

const PHONE_FORMATS = {
  international: 'International',
  national: 'National',
  e164: 'E164',
} as const;
const DATE_STYLES = {
  long: 'Long',
  full: 'Full',
  medium: 'Medium',
  short: 'Short',
  numeric: 'Numeric',
} as const;

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 font-mono text-sm dark:border-gray-700';

export default function TryIt({ module, playHref, labels }: Props) {
  const [text, setText] = useState(
    { words: '2026', phone: '034 12 345 67', ariary: 'Ar 2 026 000', date: '1960-06-26' }[module],
  );
  const [option, setOption] = useState(
    { words: '', phone: 'international', ariary: 'space', date: 'full' }[module],
  );

  const outcome = useMemo<Outcome>(() => {
    switch (module) {
      case 'words': {
        const n = Number(text);
        return {
          ...attempt(() => numberToWords(text.trim() === '' ? Number.NaN : n)),
          js: `numberToWords(${text})`,
          php: `NumberWords::fromInt(${text})`,
          snippet: snippet('numberToWords', `numberToWords(${text})`),
        };
      }
      case 'phone': {
        const format = option as keyof typeof PHONE_FORMATS;
        const parsed = safeParsePhoneNumber(text);
        return {
          ...(parsed.success
            ? {
                value: `${formatPhoneNumber(text, format)}  ·  ${OPERATOR_NAMES[parsed.data.operator]}`,
              }
            : { error: parsed.error.code }),
          js: `formatPhoneNumber(${quote(text)}, '${format}')`,
          php: `PhoneNumber::parse(${quote(text)})->format(PhoneNumberFormat::${PHONE_FORMATS[format]})`,
          snippet: snippet('formatPhoneNumber', `formatPhoneNumber(${quote(text)}, '${format}')`),
        };
      }
      case 'ariary': {
        const grouping = option === 'dot' ? 'dot' : 'space';
        const parsed = safeParseAriary(text);
        return {
          ...(parsed.success
            ? {
                value: `${formatAriary(parsed.data, { grouping })}  ·  ${ariaryToWords(parsed.data)}`,
              }
            : { error: parsed.error.code }),
          js: `formatAriary(parseAriary(${quote(text)}), { grouping: '${grouping}' })`,
          php: `Ariary::parse(${quote(text)})->format(Grouping::${grouping === 'dot' ? 'Dot' : 'Space'})`,
          snippet: snippet(
            'formatAriary, parseAriary',
            `formatAriary(parseAriary(${quote(text)}), { grouping: '${grouping}' })`,
          ),
        };
      }
      case 'date': {
        const style = option as keyof typeof DATE_STYLES;
        return {
          ...attempt(() => formatDate(text, style)),
          js: `formatDate(${quote(text)}, '${style}')`,
          php: `MalagasyDate::fromString(${quote(text)})->format(DateStyle::${DATE_STYLES[style]})`,
          snippet: snippet('formatDate', `formatDate(${quote(text)}, '${style}')`),
        };
      }
    }
  }, [module, text, option]);

  const playLink = `${playHref}${toHash({ language: 'js', module, code: outcome.snippet })}`;
  const options =
    module === 'phone'
      ? Object.keys(PHONE_FORMATS)
      : module === 'ariary'
        ? ['space', 'dot']
        : module === 'date'
          ? Object.keys(DATE_STYLES)
          : [];

  return (
    <div className="not-content my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex flex-wrap items-end gap-3 bg-gray-50 p-4 dark:bg-gray-900">
        <label className="min-w-48 flex-1 text-xs font-medium text-gray-600 dark:text-gray-400">
          {labels.input}
          <input
            className={`${inputClass} mt-1`}
            type={module === 'date' ? 'date' : 'text'}
            inputMode={module === 'words' ? 'numeric' : undefined}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
          />
        </label>
        {options.length > 0 && (
          <select
            aria-label="Option"
            className="rounded-lg border border-gray-300 bg-transparent px-2.5 py-2 text-sm dark:border-gray-700"
            value={option}
            onChange={(event) => {
              setOption(event.target.value);
            }}
          >
            {options.map((value) => (
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
