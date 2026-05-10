import { defineCollection, defineContentConfig, z } from '@nuxt/content'

/**
 * 1000x content frontmatter schema. Extends the docs-template baseline
 * (`links`) with sidebar/navigation fields (`scope`, `nav`, `order`,
 * `levels`, `tabs`) and `schemaVersion` for future migrations.
 *
 * Named export so unit tests and migration scripts can import directly.
 */
// `title` and `description` are intentionally NOT declared here — Nuxt
// Content auto-derives them and types them as `string`. Overriding (even
// as optional) breaks server consumers that expect non-undefined values.
export const contentSchema = z.object({
  icon: z.string().optional(),

  // Inherited from the docs-template — page-header action links.
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    to: z.string(),
    target: z.string().optional()
  })).optional(),

  // 1000x-specific navigation fields. Consumed by useNavTree (Section
  // sidebar, customization 02 in 02-TEMPLATE) and downstream chrome.
  scope: z.enum(['self', 'children']).optional(),
  nav: z.array(z.string()).optional(),
  order: z.number().optional(),
  levels: z.union([z.boolean(), z.array(z.string())]).optional(),
  tabs: z.union([z.boolean(), z.array(z.string())]).optional(),

  // Forward-compat: every page is implicitly schemaVersion 1 unless
  // explicitly bumped. Migrators land at the first breaking change.
  schemaVersion: z.number().default(1)
})

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**',
        exclude: ['index.md']
      },
      schema: contentSchema
    })
  }
})
