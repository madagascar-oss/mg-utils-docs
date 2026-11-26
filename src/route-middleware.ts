// Adjusts Starlight route data before each page renders.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';

type Entry = StarlightRouteData['sidebar'][number];

const INSTALLATION = /\/docs\/installation\//;
const JS_REFERENCE = /\/docs\/reference\/js\/(\w+)\/$/;

/** Keep "Installation" current on every installation method page (like tailwindcss.com/docs). */
function markInstallation(entries: Entry[], path: string): void {
  for (const entry of entries) {
    if (entry.type === 'group') markInstallation(entry.entries, path);
    else if (INSTALLATION.test(entry.href) && INSTALLATION.test(path)) entry.isCurrent = true;
  }
}

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const path = context.url.pathname;
  markInstallation(route.sidebar, path);

  // Generated JS reference pages are titled after the folder ("phone"); show the npm name.
  const module = JS_REFERENCE.exec(path)?.[1];
  if (module !== undefined) {
    const title = `@mdgascar/${module}`;
    route.entry.data.title = title;
    for (const tag of route.head) {
      if (tag.tag === 'title') tag.content = tag.content?.replace(module, title);
    }
  }
});
