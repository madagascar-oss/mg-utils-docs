// Starter code per module and language. Both languages print the same results.
import type { LanguageId, ModuleId } from './types.ts';

const js: Record<ModuleId, string> = {
  words: `import { spell } from '@mdgascar/words';

console.log(spell(21));
console.log(spell(2026));
console.log(spell(1000000));
console.log(spell(3.14));
`,
  phone: `import {
  formatPhone,
  OPERATOR_NAMES,
  parsePhone,
  safeParsePhone,
} from '@mdgascar/phone';

const phone = parsePhone('034 12 345 67');
console.log(OPERATOR_NAMES[phone.operator]);
console.log(formatPhone('0341234567', 'international'));

const result = safeParsePhone('031 12 345 67');
if (!result.success) console.log(result.error.code);
`,
  ariary: `import { spellAriary, formatAriary, parseAriary } from '@mdgascar/ariary';

console.log(formatAriary(1500));
console.log(formatAriary(1500, { grouping: 'dot', symbolPosition: 'after' }));
console.log(parseAriary('1.500 Ar'));
console.log(spellAriary(1500));
console.log(formatAriary(1500.5));
console.log(parseAriary('1 500,50 Ar'));
console.log(spellAriary(1500.5));
`,
  date: `import { formatDate, monthName } from '@mdgascar/date';

console.log(formatDate('2026-11-23', 'full'));
console.log(formatDate({ year: 1960, month: 6, day: 26 }));
console.log(monthName(6));
`,
};

const php: Record<ModuleId, string> = {
  words: `<?php

use Mdgascar\\MdgUtils\\Words\\NumberWords;

echo NumberWords::spell(21), "\\n";
echo NumberWords::spell(2026), "\\n";
echo NumberWords::spell(1000000), "\\n";
echo NumberWords::spell(3.14), "\\n";
`,
  phone: `<?php

use Mdgascar\\MdgUtils\\Phone\\PhoneNumber;
use Mdgascar\\MdgUtils\\Phone\\PhoneNumberFormat;

$phone = PhoneNumber::parse('034 12 345 67');
echo $phone->operator->displayName(), "\\n";
echo PhoneNumber::parse('0341234567')->format(PhoneNumberFormat::International), "\\n";

$result = PhoneNumber::safeParse('031 12 345 67');
if (!$result->success) echo $result->error->errorCode->value, "\\n";
`,
  ariary: `<?php

use Mdgascar\\MdgUtils\\Ariary\\Ariary;
use Mdgascar\\MdgUtils\\Ariary\\Grouping;
use Mdgascar\\MdgUtils\\Ariary\\SymbolPosition;

echo Ariary::fromInt(1500)->format(), "\\n";
echo Ariary::fromInt(1500)->format(Grouping::Dot, SymbolPosition::After), "\\n";
echo Ariary::parse('1.500 Ar')->amount, "\\n";
echo Ariary::fromInt(1500)->spell(), "\\n";
echo Ariary::fromFloat(1500.5)->format(), "\\n";
echo Ariary::parse('1 500,50 Ar')->amount, "\\n";
echo Ariary::fromFloat(1500.5)->spell(), "\\n";
`,
  date: `<?php

use Mdgascar\\MdgUtils\\Date\\DateStyle;
use Mdgascar\\MdgUtils\\Date\\MalagasyDate;

echo MalagasyDate::fromString('2026-11-23')->format(DateStyle::Full), "\\n";
echo MalagasyDate::fromParts(1960, 6, 26)->format(), "\\n";
echo MalagasyDate::monthName(6), "\\n";
`,
};

export function starter(language: LanguageId, module: ModuleId): string {
  return (language === 'js' ? js : php)[module];
}
