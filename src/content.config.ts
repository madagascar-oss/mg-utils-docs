import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

export const collections = {
  // Overrides of Starlight's own UI strings per locale (src/content/i18n/<lang>.json).
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /** Small label above the title; defaults to the page's sidebar group. */
        kicker: z.string().optional(),
      }),
    }),
  }),
};
