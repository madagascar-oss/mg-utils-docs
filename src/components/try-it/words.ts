import { numberToWords, type NumberSystem } from '../../../ports/js/packages/words/src/index.ts';
import { attempt, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

// Number values only, like the library: '1 500' is not a number, so it shows INVALID_TYPE.
function toNumber(input: string): number {
  return input.trim() === '' ? Number.NaN : Number(input);
}

// System option → PHP enum case. The first system shown is the widget's default.
const SYSTEMS = {
  standard: 'Standard',
  traditional: 'Traditional',
} as const satisfies Record<NumberSystem, string>;
const DEFAULT_SYSTEM: NumberSystem = 'standard';

// The default system needs no argument, so the calls stay as people write them.
function jsCall(input: string, system: NumberSystem): string {
  return system === DEFAULT_SYSTEM
    ? `numberToWords(${input})`
    : `numberToWords(${input}, { system: '${system}' })`;
}

// PHP has one method per type: fromFloat for decimals, fromInt for whole numbers.
function phpCall(input: string, system: NumberSystem): string {
  const value = toNumber(input);
  const method = Number.isFinite(value) && !Number.isInteger(value) ? 'fromFloat' : 'fromInt';
  const argument = system === DEFAULT_SYSTEM ? '' : `, NumberSystem::${SYSTEMS[system]}`;
  return `NumberWords::${method}(${input}${argument})`;
}

export const words: TryModule = {
  initialInput: '2026',
  options: Object.keys(SYSTEMS),
  inputType: 'text',
  inputMode: 'decimal',
  compute(input, option) {
    const system = option as NumberSystem;
    const call = jsCall(input, system);
    return {
      ...attempt(() => numberToWords(toNumber(input), { system })),
      js: call,
      php: phpCall(input, system),
      snippet: snippet('numberToWords', call),
    };
  },
};
