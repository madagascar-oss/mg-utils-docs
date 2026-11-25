import { formatDate } from '../../../ports/js/packages/date/src/index.ts';
import { attempt, quote, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

// Style option → PHP enum case. The first style shown is the widget's default.
const STYLES = {
  full: 'Full',
  long: 'Long',
  medium: 'Medium',
  short: 'Short',
  numeric: 'Numeric',
} as const;
type Style = keyof typeof STYLES;

export const date: TryModule = {
  initialInput: '1960-06-26',
  options: Object.keys(STYLES),
  inputType: 'date',
  compute(input, option) {
    const style = option as Style;
    const call = `formatDate(${quote(input)}, '${style}')`;
    return {
      ...attempt(() => formatDate(input, style)),
      js: call,
      php: `MalagasyDate::fromString(${quote(input)})->format(DateStyle::${STYLES[style]})`,
      snippet: snippet('formatDate', call),
    };
  },
};
