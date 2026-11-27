import { spell, type NumberSystem } from '../../../ports/js/packages/words/src/index.ts';
import { attempt, quote, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

// The field holds text, so the widget spells it as decimal text: every digit exact, and
// '1 500' shows INVALID_FORMAT like the library. The call shown is a plain number when a number
// would keep every digit, and text otherwise ('2000000000000000.9').
function argument(input: string): string {
  const value = Number(input);
  return input !== '' && String(value) === input ? input : quote(input);
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
    ? `spell(${argument(input)})`
    : `spell(${argument(input)}, { system: '${system}' })`;
}

// PHP has one method for every number type: spell(int|float|string).
function phpCall(input: string, system: NumberSystem): string {
  const systemArgument = system === DEFAULT_SYSTEM ? '' : `, NumberSystem::${SYSTEMS[system]}`;
  return `NumberWords::spell(${argument(input)}${systemArgument})`;
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
      ...attempt(() => spell(input, { system })),
      js: call,
      php: phpCall(input, system),
      snippet: snippet('spell', call),
    };
  },
};
