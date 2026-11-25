import { numberToWords } from '../../../ports/js/packages/words/src/index.ts';
import { attempt, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

export const words: TryModule = {
  initialInput: '2026',
  options: [],
  inputType: 'text',
  inputMode: 'numeric',
  compute: (input) => ({
    ...attempt(() => numberToWords(input.trim() === '' ? Number.NaN : Number(input))),
    js: `numberToWords(${input})`,
    php: `NumberWords::fromInt(${input})`,
    snippet: snippet('numberToWords', `numberToWords(${input})`),
  }),
};
