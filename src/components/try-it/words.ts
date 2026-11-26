import { numberToWords } from '../../../ports/js/packages/words/src/index.ts';
import { attempt, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

// Number values only, like the library: '1 500' is not a number, so it shows INVALID_TYPE.
function toNumber(input: string): number {
  return input.trim() === '' ? Number.NaN : Number(input);
}

// PHP has one method per type: fromFloat for decimals, fromInt for whole numbers.
function phpCall(input: string): string {
  const value = toNumber(input);
  const method = Number.isFinite(value) && !Number.isInteger(value) ? 'fromFloat' : 'fromInt';
  return `NumberWords::${method}(${input})`;
}

export const words: TryModule = {
  initialInput: '2026',
  options: [],
  inputType: 'text',
  inputMode: 'decimal',
  compute: (input) => ({
    ...attempt(() => numberToWords(toNumber(input))),
    js: `numberToWords(${input})`,
    php: phpCall(input),
    snippet: snippet('numberToWords', `numberToWords(${input})`),
  }),
};
