// Registry of runners. Adding a language = adding a runner here (and its starters).
import type { LanguageId, Runner } from '../types.ts';
import { createJsRunner } from './js.ts';
import { createPhpRunner } from './php.ts';

const factories: Record<LanguageId, (() => Runner) | undefined> = {
  js: createJsRunner,
  php: createPhpRunner,
};

const cache = new Map<LanguageId, Runner>();

export const LANGUAGES: readonly { id: LanguageId; label: string }[] = [
  { id: 'js', label: 'JavaScript' },
  { id: 'php', label: 'PHP' },
];

export function isAvailable(language: LanguageId): boolean {
  return factories[language] !== undefined;
}

export function runnerFor(language: LanguageId): Runner {
  const cached = cache.get(language);
  if (cached) return cached;
  const factory = factories[language];
  if (factory === undefined) throw new Error(`No runner for ${language} yet.`);
  const runner = factory();
  cache.set(language, runner);
  return runner;
}
