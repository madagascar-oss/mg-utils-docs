// Runs PHP 8.4 (php-wasm) with the mdg-utils PHP port loaded through a PSR-4 autoloader.
/// <reference lib="webworker" />
import { PHP, setPhpIniEntries } from '@php-wasm/universal';
import { loadWebRuntime } from '@php-wasm/web';

const LIBRARY_ROOT = '/mdg-utils';
const PRELUDE = `${LIBRARY_ROOT}/prelude.php`;
/** Marks the line the exception handler writes to stderr, so the runner can find it. */
const ERROR_MARKER = '__MDG_UTILS_ERROR__';

// Runs before every snippet (auto_prepend_file): autoload the port, report uncaught errors.
const preludeSource = `<?php
spl_autoload_register(static function (string $class): void {
    $prefix = 'Mdgascar\\\\MdgUtils\\\\';
    if (str_starts_with($class, $prefix)) {
        $file = '${LIBRARY_ROOT}/src/' . str_replace('\\\\', '/', substr($class, strlen($prefix))) . '.php';
        if (is_file($file)) require $file;
    }
});
set_exception_handler(static function (Throwable $error): void {
    $code = $error instanceof Mdgascar\\MdgUtils\\MdgUtilsException ? $error->errorCode->value : null;
    // php-wasm runs a web SAPI, where the STDERR constant does not exist.
    file_put_contents('php://stderr', '${ERROR_MARKER}' . json_encode([
        'code' => $code,
        'message' => (new ReflectionClass($error))->getShortName() . ': ' . $error->getMessage(),
    ]));
    exit(0);
});
`;

let php: PHP | undefined;

/** php-wasm reports parse and fatal errors as a long dump; keep PHP's own first error line. */
function phpMessage(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  const line = /PHP (?:Parse|Fatal) error:\s+(.+?)(?: in \S+ on line \d+)?$/m.exec(text);
  return line?.[1] ?? text;
}

async function boot(libraryUrl: string): Promise<PHP> {
  const instance = new PHP(await loadWebRuntime('8.4'));
  const files = (await (await fetch(libraryUrl)).json()) as Record<string, string>;
  for (const [path, source] of Object.entries(files)) {
    const fullPath = `${LIBRARY_ROOT}/src/${path}`;
    instance.mkdir(fullPath.slice(0, fullPath.lastIndexOf('/')));
    instance.writeFile(fullPath, source);
  }
  instance.writeFile(PRELUDE, preludeSource);
  await setPhpIniEntries(instance, {
    auto_prepend_file: PRELUDE,
    display_errors: '1',
    html_errors: '0',
  });
  return instance;
}

interface Request {
  readonly type: 'boot' | 'run';
  readonly libraryUrl?: string;
  readonly code?: string;
}

addEventListener('message', (event: MessageEvent<Request>) => {
  const request = event.data;
  void (async () => {
    try {
      if (request.type === 'boot') {
        php ??= await boot(request.libraryUrl ?? '');
        postMessage({ type: 'ready' });
        return;
      }
      if (php === undefined) throw new Error('PHP is not loaded yet.');
      const response = await php.run({ code: request.code ?? '' });
      const markerAt = response.errors.indexOf(ERROR_MARKER);
      const error =
        markerAt >= 0
          ? (JSON.parse(response.errors.slice(markerAt + ERROR_MARKER.length)) as {
              code: string | null;
              message: string;
            })
          : response.exitCode !== 0
            ? {
                code: null,
                message:
                  response.errors.trim() || `PHP exited with code ${String(response.exitCode)}.`,
              }
            : undefined;
      postMessage({ type: 'done', stdout: response.text, error });
    } catch (error) {
      postMessage({ type: 'done', stdout: '', error: { code: null, message: phpMessage(error) } });
    }
  })();
});
