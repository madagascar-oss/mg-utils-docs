// Landing demo data. Every value shown on the landing page is computed here, at build time, by
// the library itself (the pinned ports/js submodule), so the page can never show a wrong result.
import {
  fmgToAriary,
  formatAriary,
  formatFmg,
  parseAriary,
  spellAriary,
} from '../../../ports/js/packages/ariary/src/index.ts';
import { formatDate, monthName } from '../../../ports/js/packages/date/src/index.ts';
import {
  OPERATOR_NAMES,
  formatPhone,
  parsePhone,
  safeParsePhone,
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

const KEYWORDS = new Set([
  'import',
  'from',
  'const',
  'let',
  'use',
  'new',
  'return',
  'export',
  'default',
  'function',
  'class',
  'if',
]);
// Strings, numbers (with _ separators), PHP variables, words, then any other single character.
const TOKEN = /('[^']*')|(\b\d[\d_]*\b)|(\$\w+)|([A-Za-z_@]\w*)|(\s+)|(.)/g;

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
      else if (/^[A-Z@]/.test(word)) kind = 'type';
      else kind = 'plain';
    }
    const last = tokens.at(-1);
    if (last && last.kind === kind) last.text += text;
    else tokens.push({ kind, text });
  }
  return tokens;
}

const line = (source: string, field?: FieldId): Line => ({ tokens: tokenize(source), field });
const lines = (source: string, marks: Partial<Record<number, FieldId>> = {}): Line[] =>
  source.split('\n').map((text, index) => line(text, marks[index]));

const JS_IMPORTS = `import { formatAriary, spellAriary } from '@mdgascar/ariary';
import { formatPhone } from '@mdgascar/phone';
import { formatDate } from '@mdgascar/date';`;

/** The language group a sample belongs to, for the tab bar. */
export type SampleGroup = 'js' | 'php';

export interface Sample {
  id: string;
  label: string;
  file: string;
  group: SampleGroup;
  lines: Line[];
}

// The same receipt in every framework. Line indexes mark where each preview field fills in.
export const samples: Sample[] = [
  {
    id: 'ts',
    label: 'TypeScript',
    file: 'receipt.ts',
    group: 'js',
    lines: lines(
      `${JS_IMPORTS}

const receipt = {
  amount: formatAriary(${AMOUNT}),
  words: spellAriary(${AMOUNT}),
  phone: formatPhone('${PHONE}', 'international'),
  date: formatDate('${DATE}', 'full'),
} satisfies Record<string, string>;`,
      { 5: 'amount', 6: 'words', 7: 'phone', 8: 'date' },
    ),
  },
  {
    id: 'react',
    label: 'React',
    file: 'Receipt.tsx',
    group: 'js',
    lines: lines(
      `${JS_IMPORTS}

export function Receipt({ order }: { order: Order }) {
  return (
    <dl>
      <dd>{formatAriary(order.total)}</dd>
      <dd>{spellAriary(order.total)}</dd>
      <dd>{formatPhone(order.phone, 'international')}</dd>
      <dd>{formatDate(order.paidOn, 'full')}</dd>
    </dl>
  );
}`,
      { 7: 'amount', 8: 'words', 9: 'phone', 10: 'date' },
    ),
  },
  {
    id: 'vue',
    label: 'Vue',
    file: 'Receipt.vue',
    group: 'js',
    lines: lines(
      `<script setup lang="ts">
${JS_IMPORTS}
defineProps<{ order: Order }>();
</script>

<template>
  <p>{{ formatAriary(order.total) }}</p>
  <p>{{ spellAriary(order.total) }}</p>
  <p>{{ formatPhone(order.phone, 'international') }}</p>
  <p>{{ formatDate(order.paidOn, 'full') }}</p>
</template>`,
      { 8: 'amount', 9: 'words', 10: 'phone', 11: 'date' },
    ),
  },
  {
    id: 'angular',
    label: 'Angular',
    file: 'receipt.component.ts',
    group: 'js',
    lines: lines(
      `import { Component, computed, input } from '@angular/core';
${JS_IMPORTS}

@Component({ selector: 'app-receipt', template: '{{ amount() }} · {{ words() }}' })
export class ReceiptComponent {
  order = input.required<Order>();
  amount = computed(() => formatAriary(this.order().total));
  words = computed(() => spellAriary(this.order().total));
  phone = computed(() => formatPhone(this.order().phone, 'international'));
  date = computed(() => formatDate(this.order().paidOn, 'full'));
}`,
      { 8: 'amount', 9: 'words', 10: 'phone', 11: 'date' },
    ),
  },
  {
    id: 'svelte',
    label: 'Svelte',
    file: 'Receipt.svelte',
    group: 'js',
    lines: lines(
      `<script lang="ts">
${JS_IMPORTS}
  let { order }: { order: Order } = $props();
</script>

<p>{formatAriary(order.total)}</p>
<p>{spellAriary(order.total)}</p>
<p>{formatPhone(order.phone, 'international')}</p>
<p>{formatDate(order.paidOn, 'full')}</p>`,
      { 7: 'amount', 8: 'words', 9: 'phone', 10: 'date' },
    ),
  },
  {
    id: 'node',
    label: 'Node · Bun · Deno',
    file: 'server.ts',
    group: 'js',
    lines: lines(
      `${JS_IMPORTS}

export default {
  fetch: () =>
    Response.json({
      amount: formatAriary(${AMOUNT}),
      words: spellAriary(${AMOUNT}),
      phone: formatPhone('${PHONE}', 'international'),
      date: formatDate('${DATE}', 'full'),
    }),
};`,
      { 7: 'amount', 8: 'words', 9: 'phone', 10: 'date' },
    ),
  },
  {
    id: 'php',
    label: 'PHP',
    file: 'receipt.php',
    group: 'php',
    lines: lines(
      `use Mdgascar\\MdgUtils\\Ariary\\Ariary;
use Mdgascar\\MdgUtils\\Phone\\{PhoneNumber, PhoneNumberFormat};
use Mdgascar\\MdgUtils\\Date\\{DateStyle, MalagasyDate};

$receipt = [
    'amount' => Ariary::fromInt(${AMOUNT})->format(),
    'words' => Ariary::fromInt(${AMOUNT})->spell(),
    'phone' => PhoneNumber::parse('${PHONE}')->format(PhoneNumberFormat::International),
    'date' => MalagasyDate::fromString('${DATE}')->format(DateStyle::Full),
];`,
      { 5: 'amount', 6: 'words', 7: 'phone', 8: 'date' },
    ),
  },
  {
    id: 'laravel',
    label: 'Laravel',
    file: 'receipt.blade.php',
    group: 'php',
    lines: lines(
      `{{-- Order casts: 'total' => AsAriary::class, 'phone' => AsPhoneNumber::class --}}
@use('Mdgascar\\MdgUtils\\Phone\\PhoneNumberFormat')
@use('Mdgascar\\MdgUtils\\Date\\DateStyle')

<p>@ariary($order->total)</p>
<p>{{ $order->total->spell() }}</p>
<p>@mgPhone($order->phone, PhoneNumberFormat::International)</p>
<p>@mgDate($order->paid_on, DateStyle::Full)</p>`,
      { 4: 'amount', 5: 'words', 6: 'phone', 7: 'date' },
    ),
  },
  {
    id: 'symfony',
    label: 'Symfony',
    file: 'receipt.html.twig',
    group: 'php',
    lines: lines(
      `{# Doctrine types: order.total is an Ariary, order.phone a PhoneNumber #}

<p>{{ order.total|ariary }}</p>
<p>{{ order.total.spell }}</p>
<p>{{ order.phone|mg_phone('international') }}</p>
<p>{{ order.paidOn|mg_date('full') }}</p>`,
      { 2: 'amount', 3: 'words', 4: 'phone', 5: 'date' },
    ),
  },
];

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

const UNKNOWN_OPERATOR_PHONE = '031 12 345 67';
const signup = safeParsePhone(UNKNOWN_OPERATOR_PHONE);
const CHEQUE_TEXT = '2000000000000000.9';
const TYPED_AMOUNT = 'Ar 1.500,50';
const OLD_FRANCS = 7500;
const TRADITIONAL_NUMBER = 30_000_000;
const INDEPENDENCE_DAY = '2026-06-26';
const JUNE = 6;

export type UseCaseId = 'signup' | 'cheque' | 'form' | 'francs' | 'traditional' | 'calendar';

/** Real-world uses: TypeScript to write, and the result the library gives for it. */
export const useCases: { id: UseCaseId; code: string; results: string[] }[] = [
  {
    id: 'signup',
    code: `const result = safeParsePhone(input);
if (!result.success) return showError(result.error.code);
save(result.data.e164, result.data.operator);`,
    results: [
      `'${UNKNOWN_OPERATOR_PHONE}' → ${signup.success ? '' : signup.error.code}`,
      `'034 12 345 67' → ${parsePhone('034 12 345 67').e164}, ${operatorName}`,
    ],
  },
  {
    id: 'cheque',
    code: `// Text keeps every digit a number would round away.
spellAriary('${CHEQUE_TEXT}');`,
    results: [spellAriary(CHEQUE_TEXT)],
  },
  {
    id: 'form',
    code: `const amount: number = parseAriary('${TYPED_AMOUNT}');
formatAriary(amount, { symbolPosition: 'after' });`,
    results: [
      `${String(parseAriary(TYPED_AMOUNT))}`,
      formatAriary(parseAriary(TYPED_AMOUNT), { symbolPosition: 'after' }),
    ],
  },
  {
    id: 'francs',
    code: `formatFmg(${String(OLD_FRANCS)});
fmgToAriary(${String(OLD_FRANCS)});`,
    results: [formatFmg(OLD_FRANCS), `${String(fmgToAriary(OLD_FRANCS))} ariary`],
  },
  {
    id: 'traditional',
    code: `spell(${String(TRADITIONAL_NUMBER).replace(/\B(?=(\d{3})+$)/g, '_')});
spell(${String(TRADITIONAL_NUMBER).replace(/\B(?=(\d{3})+$)/g, '_')}, { system: 'traditional' });`,
    results: [spell(TRADITIONAL_NUMBER), spell(TRADITIONAL_NUMBER, { system: 'traditional' })],
  },
  {
    id: 'calendar',
    code: `formatDate('${INDEPENDENCE_DAY}', 'full');
monthName(${String(JUNE)}, 'abbreviated');`,
    results: [formatDate(INDEPENDENCE_DAY, 'full'), monthName(JUNE, 'abbreviated')],
  },
];

export const installs = {
  js: ['npm i @mdgascar/utils', 'pnpm add @mdgascar/utils', 'bun add @mdgascar/utils'],
  php: [
    'composer require mdgascar/mdg-utils',
    'composer require mdgascar/mdg-utils-laravel',
    'composer require mdgascar/mdg-utils-bundle',
  ],
} as const;
