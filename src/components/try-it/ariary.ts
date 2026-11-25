import {
  ariaryToWords,
  formatAriary,
  safeParseAriary,
} from '../../../ports/js/packages/ariary/src/index.ts';
import { quote, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

// Grouping option → PHP enum case.
const GROUPINGS = { space: 'Space', dot: 'Dot' } as const;
type Grouping = keyof typeof GROUPINGS;

export const ariary: TryModule = {
  initialInput: 'Ar 2 026 000',
  options: Object.keys(GROUPINGS),
  inputType: 'text',
  compute(input, option) {
    const grouping = option as Grouping;
    const call = `formatAriary(parseAriary(${quote(input)}), { grouping: '${grouping}' })`;
    const parsed = safeParseAriary(input);
    return {
      ...(parsed.success
        ? { value: `${formatAriary(parsed.data, { grouping })}  ·  ${ariaryToWords(parsed.data)}` }
        : { error: parsed.error.code }),
      js: call,
      php: `Ariary::parse(${quote(input)})->format(Grouping::${GROUPINGS[grouping]})`,
      snippet: snippet('formatAriary, parseAriary', call),
    };
  },
};
