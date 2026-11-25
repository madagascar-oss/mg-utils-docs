/** What a Try it widget shows for the current input. */
interface Outcome {
  readonly value?: string;
  readonly error?: string;
  readonly js: string;
  readonly php: string;
  /** The same call as a complete playground snippet. */
  readonly snippet: string;
}

/** How one module behaves in the Try it widget. */
export interface TryModule {
  readonly initialInput: string;
  readonly options: readonly string[];
  readonly inputType: 'text' | 'date';
  readonly inputMode?: 'numeric';
  compute(input: string, option: string): Outcome;
}
