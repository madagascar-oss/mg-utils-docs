import {
  OPERATOR_NAMES,
  formatPhoneNumber,
  safeParsePhoneNumber,
} from '../../../ports/js/packages/phone/src/index.ts';
import { quote, snippet } from './shared.ts';
import type { TryModule } from './types.ts';

// Format option → PHP enum case.
const FORMATS = { international: 'International', national: 'National', e164: 'E164' } as const;
type Format = keyof typeof FORMATS;

export const phone: TryModule = {
  initialInput: '034 12 345 67',
  options: Object.keys(FORMATS),
  inputType: 'text',
  compute(input, option) {
    const format = option as Format;
    const call = `formatPhoneNumber(${quote(input)}, '${format}')`;
    const parsed = safeParsePhoneNumber(input);
    return {
      ...(parsed.success
        ? {
            value: `${formatPhoneNumber(input, format)}  ·  ${OPERATOR_NAMES[parsed.data.operator]}`,
          }
        : { error: parsed.error.code }),
      js: call,
      php: `PhoneNumber::parse(${quote(input)})->format(PhoneNumberFormat::${FORMATS[format]})`,
      snippet: snippet('formatPhoneNumber', call),
    };
  },
};
