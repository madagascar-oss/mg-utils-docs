// Try it widgets for the newer calls of the words and date modules: ordinals, words read back
// into numbers, and dates read back into calendar fields.
import { parseDate } from '../../../ports/js/packages/date/src/index.ts';
import {
  parseWords,
  spellOrdinal,
  type NumberSystem,
} from '../../../ports/js/packages/words/src/index.ts';
import { attempt, quote, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

// System option → PHP enum case. The first system shown is the widget's default.
const SYSTEMS = {
  standard: 'Standard',
  traditional: 'Traditional',
} as const satisfies Record<NumberSystem, string>;
const DEFAULT_SYSTEM: NumberSystem = 'standard';

export const ordinal: TryModule = {
  initialInput: '3',
  options: Object.keys(SYSTEMS),
  inputType: 'text',
  inputMode: 'numeric',
  compute(input, option) {
    const system = option as NumberSystem;
    const isDefault = system === DEFAULT_SYSTEM;
    const call = isDefault
      ? `spellOrdinal(${input})`
      : `spellOrdinal(${input}, { system: '${system}' })`;
    const phpSystem = isDefault ? '' : `, NumberSystem::${SYSTEMS[system]}`;
    return {
      ...attempt(() => spellOrdinal(input, { system })),
      js: call,
      php: `NumberWords::spellOrdinal(${input}${phpSystem})`,
      snippet: snippet('spellOrdinal', call),
    };
  },
};

export const readWords: TryModule = {
  initialInput: 'enina amby roapolo sy roa arivo',
  options: [],
  inputType: 'text',
  compute(input) {
    const call = `parseWords(${quote(input)})`;
    return {
      ...attempt(() => String(parseWords(input))),
      js: call,
      php: `NumberWords::parse(${quote(input)})->value()`,
      snippet: snippet('parseWords', call),
    };
  },
};

export const readDate: TryModule = {
  initialInput: '23 Novambra 2026',
  options: [],
  inputType: 'text',
  compute(input) {
    const call = `parseDate(${quote(input)})`;
    return {
      ...attempt(() => {
        const { year, month, day } = parseDate(input);
        return `{ year: ${String(year)}, month: ${String(month)}, day: ${String(day)} }`;
      }),
      js: call,
      php: `MalagasyDate::parse(${quote(input)})`,
      snippet: snippet('parseDate', call),
    };
  },
};
