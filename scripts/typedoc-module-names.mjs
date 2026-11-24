// @ts-check
// TypeDoc names modules after their folders ("phone/src"); show the module name ("phone") instead.
import { Converter, ReflectionKind } from 'typedoc';

/** @param {import('typedoc').Application} app */
export function load(app) {
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    for (const reflection of context.project.getReflectionsByKind(ReflectionKind.Module)) {
      const folder = /^(\w+)\/src$/.exec(reflection.name);
      if (folder?.[1] !== undefined) reflection.name = folder[1];
    }
  });
}
