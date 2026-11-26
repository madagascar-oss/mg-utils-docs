// Starter code per module and language. Both languages print the same results.
import type { LanguageId, ModuleId } from './types.ts';

const js: Record<ModuleId, string> = {
  words: `import { numberToWords } from '@madagascar-oss/words';

console.log(numberToWords(21));
console.log(numberToWords(2026));
console.log(numberToWords(1_000_000));
console.log(numberToWords(1_000_000_000_000));
console.log(numberToWords(3.14));
`,
  phone: `import {
  formatPhoneNumber,
  OPERATOR_NAMES,
  parsePhoneNumber,
  safeParsePhoneNumber,
} from '@madagascar-oss/phone';

const phone = parsePhoneNumber('034 12 345 67');
console.log(OPERATOR_NAMES[phone.operator]);
console.log(formatPhoneNumber('0341234567', 'international'));

const result = safeParsePhoneNumber('035 12 345 67');
if (!result.success) console.log(result.error.code);
`,
  ariary: `import { ariaryToWords, formatAriary, parseAriary } from '@madagascar-oss/ariary';

console.log(formatAriary(1500));
console.log(formatAriary(1500, { grouping: 'dot', symbolPosition: 'after' }));
console.log(parseAriary('1.500 Ar'));
console.log(ariaryToWords(1500));
console.log(formatAriary(1500.5));
console.log(parseAriary('1 500,50 Ar'));
console.log(ariaryToWords(1500.5));
`,
  date: `import { formatDate, getMonthName } from '@madagascar-oss/date';

console.log(formatDate('2026-11-23', 'full'));
console.log(formatDate({ year: 1960, month: 6, day: 26 }));
console.log(getMonthName(6));
`,
};

const php: Record<ModuleId, string> = {
  words: `<?php

use Madagascar\\MgUtils\\Words\\NumberWords;

echo NumberWords::fromInt(21), "\\n";
echo NumberWords::fromInt(2026), "\\n";
echo NumberWords::fromInt(1_000_000), "\\n";
echo NumberWords::fromInt(1_000_000_000_000), "\\n";
echo NumberWords::fromFloat(3.14), "\\n";
`,
  phone: `<?php

use Madagascar\\MgUtils\\Phone\\PhoneNumber;
use Madagascar\\MgUtils\\Phone\\PhoneNumberFormat;

$phone = PhoneNumber::parse('034 12 345 67');
echo $phone->operator->displayName(), "\\n";
echo PhoneNumber::parse('0341234567')->format(PhoneNumberFormat::International), "\\n";

$result = PhoneNumber::safeParse('035 12 345 67');
if (!$result->success) echo $result->error->errorCode->value, "\\n";
`,
  ariary: `<?php

use Madagascar\\MgUtils\\Ariary\\Ariary;
use Madagascar\\MgUtils\\Ariary\\Grouping;
use Madagascar\\MgUtils\\Ariary\\SymbolPosition;

echo Ariary::fromInt(1500)->format(), "\\n";
echo Ariary::fromInt(1500)->format(Grouping::Dot, SymbolPosition::After), "\\n";
echo Ariary::parse('1.500 Ar')->amount, "\\n";
echo Ariary::fromInt(1500)->toWords(), "\\n";
echo Ariary::fromFloat(1500.5)->format(), "\\n";
echo Ariary::parse('1 500,50 Ar')->amount, "\\n";
echo Ariary::fromFloat(1500.5)->toWords(), "\\n";
`,
  date: `<?php

use Madagascar\\MgUtils\\Date\\DateStyle;
use Madagascar\\MgUtils\\Date\\MalagasyDate;

echo MalagasyDate::fromString('2026-11-23')->format(DateStyle::Full), "\\n";
echo MalagasyDate::fromParts(1960, 6, 26)->format(), "\\n";
echo MalagasyDate::monthName(6), "\\n";
`,
};

export function starter(language: LanguageId, module: ModuleId): string {
  return (language === 'js' ? js : php)[module];
}
