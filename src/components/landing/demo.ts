// Landing demo data. Every value shown on the landing page is computed here, at build time, by
// the library itself (the pinned ports/js submodule), so the page can never show a wrong result.
import { spellAriary, formatAriary } from '../../../ports/js/packages/ariary/src/index.ts';
import { formatDate } from '../../../ports/js/packages/date/src/index.ts';
import {
  OPERATOR_NAMES,
  formatPhone,
  parsePhone,
} from '../../../ports/js/packages/phone/src/index.ts';
import { spell } from '../../../ports/js/packages/words/src/index.ts';

type TokenKind = 'plain' | 'keyword' | 'string' | 'number' | 'fn' | 'type' | 'var' | 'punct';
interface Token {
  kind: TokenKind;
  text: string;
}
/** One editor line. `field` marks a line that fills a preview row once it is typed. */
export interface Line {
  tokens: Token[];
  field?: FieldId;
}
export type FieldId = 'amount' | 'words' | 'phone' | 'date';
export type CodeLanguage = 'js' | 'php';

const AMOUNT = 150000;
const PHONE = '0341234567';
const DATE = '2026-11-23';

const phone = parsePhone(PHONE);

/** Preview values, from the library. */
export const fields: Record<FieldId, string> = {
  amount: formatAriary(AMOUNT),
  words: spellAriary(AMOUNT),
  phone: formatPhone(PHONE, 'international'),
  date: formatDate(DATE, 'full'),
};
export const operatorName: string = OPERATOR_NAMES[phone.operator];

const KEYWORDS = new Set(['import', 'from', 'const', 'use', 'new', 'return']);
// Strings, numbers (with _ separators), PHP variables, words, then any other single character.
const TOKEN = /('[^']*')|(\b\d[\d_]*\b)|(\$\w+)|([A-Za-z_]\w*)|(\s+)|(.)/g;

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  for (const match of source.matchAll(TOKEN)) {
    const [text, str, num, variable, word, space] = match;
    const after = source.slice((match.index ?? 0) + text.length);
    let kind: TokenKind = 'punct';
    if (str) kind = 'string';
    else if (num) kind = 'number';
    else if (variable) kind = 'var';
    else if (space) kind = 'plain';
    else if (word) {
      if (KEYWORDS.has(word)) kind = 'keyword';
      else if (after.startsWith('(')) kind = 'fn';
      else if (/^[A-Z]/.test(word)) kind = 'type';
      else kind = 'plain';
    }
    const last = tokens.at(-1);
    if (last && last.kind === kind) last.text += text;
    else tokens.push({ kind, text });
  }
  return tokens;
}

const line = (source: string, field?: FieldId): Line => ({ tokens: tokenize(source), field });

export const code: Record<CodeLanguage, { file: string; lines: Line[] }> = {
  js: {
    file: 'receipt.ts',
    lines: [
      line("import { formatAriary, spellAriary } from '@mdgascar/ariary';"),
      line("import { formatPhone } from '@mdgascar/phone';"),
      line("import { formatDate } from '@mdgascar/date';"),
      line(''),
      line('const receipt = {'),
      line(`  amount: formatAriary(${AMOUNT}),`, 'amount'),
      line(`  words: spellAriary(${AMOUNT}),`, 'words'),
      line(`  phone: formatPhone('${PHONE}', 'international'),`, 'phone'),
      line(`  date: formatDate('${DATE}', 'full'),`, 'date'),
      line('};'),
    ],
  },
  php: {
    file: 'receipt.php',
    lines: [
      line('use Mdgascar\\MdgUtils\\Ariary\\Ariary;'),
      line('use Mdgascar\\MdgUtils\\Phone\\{PhoneNumber, PhoneNumberFormat};'),
      line('use Mdgascar\\MdgUtils\\Date\\{DateStyle, MalagasyDate};'),
      line(''),
      line('$receipt = ['),
      line(`    'amount' => Ariary::fromInt(${AMOUNT})->format(),`, 'amount'),
      line(`    'words' => Ariary::fromInt(${AMOUNT})->spell(),`, 'words'),
      line(
        `    'phone' => PhoneNumber::parse('${PHONE}')->format(PhoneNumberFormat::International),`,
        'phone',
      ),
      line(`    'date' => MalagasyDate::fromString('${DATE}')->format(DateStyle::Full),`, 'date'),
      line('];'),
    ],
  },
};

/** One-line examples for the module grid, computed by the library. */
export const modules = [
  { id: 'words', call: 'spell(2026)', result: spell(2026) },
  {
    id: 'phone',
    call: "formatPhone('0341234567', 'national')",
    result: formatPhone(PHONE, 'national'),
  },
  { id: 'ariary', call: 'formatAriary(1500.5)', result: formatAriary(1500.5) },
  { id: 'date', call: "formatDate('2026-11-23', 'full')", result: formatDate(DATE, 'full') },
] as const;
