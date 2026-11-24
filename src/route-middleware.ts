// Highlight a sidebar link for every page under its section, not only for its exact URL:
// "Installation" stays current on /docs/installation/using-composer/ (like tailwindcss.com/docs).
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';

type Entry = StarlightRouteData['sidebar'][number];

const SECTION = /\/docs\/installation\//;

function markSection(entries: Entry[], path: string): void {
  for (const entry of entries) {
    if (entry.type === 'group') markSection(entry.entries, path);
    else if (SECTION.test(entry.href) && SECTION.test(path)) entry.isCurrent = true;
  }
}

export const onRequest = defineRouteMiddleware((context) => {
  markSection(context.locals.starlightRoute.sidebar, context.url.pathname);
});
