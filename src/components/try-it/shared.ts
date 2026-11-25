// Helpers shared by the module definitions of the Try it widget.

/** A playground snippet that logs one call to @madagascar-oss/utils. */
export const snippet = (names: string, call: string): string =>
  `import { ${names} } from '@madagascar-oss/utils';\n\nconsole.log(${call});\n`;

/** Runs a call that may throw an MgError; keeps the value or the spec error code. */
export function attempt(compute: () => string): { value?: string; error?: string } {
  try {
    return { value: compute() };
  } catch (error) {
    const code = (error as { code?: unknown }).code;
    return { error: typeof code === 'string' ? code : String(error) };
  }
}

/** A single-quoted string literal, valid in both JavaScript and PHP. */
export const quote = (text: string): string =>
  `'${text.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
