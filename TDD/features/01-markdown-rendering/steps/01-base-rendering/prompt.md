# Claude Code Prompt — Step 1: Basis Nuxt Content + page-rendering

## Project context

This task builds the first implementation step of **feature 1 — Markdown rendering & content-engine** for the 1000x project: an internal "second brain" and interactive learning system for the team, focused on programming and security topics. Dutch is the primary language, English secondary.

Three documents in the project root carry the full context. **Read them before starting:**

- `spec.md` — overall product spec, including Technical Stack and the project-wide rule that Nuxt UI v4 is consulted first for every UI element
- `features.md` — overview of all 21 features
- `../../spec.md` (or `features/01-markdown-rendering/spec.md` from project root) — this feature in detail, including the **Implementation Steps** section that defines exactly what Step 1 covers

The brand "1000x" displays with the leading `1` in red and `000x` in default foreground. The accent color is red. Code style follows `@antfu/eslint-config` via `@nuxt/eslint` — tabs, single quotes, no semicolons, no Prettier. Project AI context lives canonically in `AGENTS.md` at the project root; consult it for established conventions.

## Task

Make the markdown rendering pipeline work end-to-end at the most fundamental level: a markdown file in `content/` is served as a styled page through Nuxt Content + Nuxt UI's prose components. This is the foundation that every subsequent step (code blocks, MDC blocks, images, asset paths) builds on.

**In scope for this step:**

1. Verify or install `@nuxt/content` and `@nuxt/ui` v4
2. Define a content collection in `content.config.ts` with a base zod-schema (`title`, `description`, `schemaVersion` default `1`)
3. Create a catch-all page template that fetches and renders any markdown file under `content/`
4. Create a test page that exercises H1-H4, paragraphs, lists, links, blockquotes, inline formatting, horizontal rule and a table
5. Set `schemaVersion: 1` in all existing frontmatter

**Out of scope for this step (assigned to later steps — do not anticipate):**

- Step 2: Shiki theme + language whitelist
- Step 3: MDC custom blocks (`::tabs`, `::callout`, `::code-group`)
- Step 4: `@nuxt/image` pipeline + `ProseImg` override
- Step 5: relative asset paths + mirror-tree resolution
- Step 6: localized assets (`image.nl.png` / `image.en.png`)
- Step 7: tolerant frontmatter validation + dev-warning for unknown fields
- Schema migrators-machinery (only when the first breaking schema change happens)
- Layout chrome (header, sidebar, right panel) — that lives in `PROMPT-app-layout.md`

## Prerequisites — what you can assume

The Nuxt 4 project is already scaffolded per `SCAFFOLDING.md`. The base `app/` directory exists with `app.config.ts` and `app.vue`. ESLint via `@nuxt/eslint` + `@antfu/eslint-config` is wired up. There may already be a `content/index.md` and `pages/index.vue` from previous work — **update them rather than recreate**, and respect any existing structure that already follows the patterns below.

Before starting, run:

```bash
npm ls @nuxt/content @nuxt/ui
```

to check what's installed. Only install what's missing. Use `pnpm add` if `pnpm-lock.yaml` exists, otherwise `npm install`.

## Deliverables

```
content.config.ts                        ← NEW or VERIFY: zod schema for content collection
nuxt.config.ts                           ← VERIFY: @nuxt/content and @nuxt/ui in modules
content/
├── index.md                             ← UPDATE: ensure schemaVersion: 1 in frontmatter
├── test-prose.md                        ← NEW: test page exercising basic markdown elements
└── test-no-schema-version.md            ← NEW: fixture for testing schemaVersion default behavior
pages/
├── index.vue                            ← VERIFY or UPDATE: ContentRenderer pattern
└── [...slug].vue                        ← NEW: catch-all for any markdown file under content/
```

## File specs

### `content.config.ts`

Define a single collection named `content` with `type: 'page'` and `source: '**/*.md'`. The schema is intentionally minimal at this step — only the three fields explicitly required by Step 1.

**Important:** export the zod-schema as a **named export** (`contentSchema`) in addition to using it inside `defineContentConfig`. The unit-tests for the schema (see `test-plan.md`) import this named export directly. Without it the schema can't be tested in isolation.

```ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export const contentSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	schemaVersion: z.number().default(1),
})

export default defineContentConfig({
	collections: {
		content: defineCollection({
			type: 'page',
			source: '**/*.md',
			schema: contentSchema,
		}),
	},
})
```

**Do not** add other fields yet — `icon`, `scope`, `nav`, `order`, `levels`, etc. all belong to feature 2 (sidebar) and feature 19 (navigation system) and will be added when those features are built. Step 1 keeps the schema minimal.

**Do not** add `.passthrough()` or any tolerance for unknown fields — that's Step 7. The schema rejects unknown fields by default at this step.

### `nuxt.config.ts` — verify

Ensure `@nuxt/content` and `@nuxt/ui` are in the `modules` array. If they're missing, add them. Do not change other module configuration.

```ts
export default defineNuxtConfig({
	modules: [
		'@nuxt/content',
		'@nuxt/ui',
		// ...whatever else is already there
	],
	// ...
})
```

### `pages/[...slug].vue` — catch-all page template

A catch-all route that handles any markdown file under `content/` except the root (which `pages/index.vue` handles). Fetches the page via `useAsyncData` + `queryCollection` and renders via `<ContentRenderer>`.

```vue
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () =>
	queryCollection('content').path(route.path).first(),
)

useSeoMeta({
	title: () => page.value?.title,
	description: () => page.value?.description,
})
</script>

<template>
	<div v-if="page">
		<h1 class="text-4xl font-bold tracking-tight mb-3">
			{{ page.title }}
		</h1>
		<p
			v-if="page.description"
			class="text-lg text-muted mb-12"
		>
			{{ page.description }}
		</p>
		<div class="prose dark:prose-invert max-w-none">
			<ContentRenderer :value="page" />
		</div>
	</div>
	<div v-else class="text-muted">
		Pagina niet gevonden.
	</div>
</template>
```

Key points:

- `useAsyncData` key includes `route.path` so each page caches independently
- `useSeoMeta` sets title and description meta tags. Per `spec.md` §18, deployment is auth-gated and SEO indexing is disabled at deploy-level — the meta tags don't leak to public crawlers
- Title comes from frontmatter, **never** from the markdown body
- `prose dark:prose-invert max-w-none` lets Nuxt UI's prose styling apply while leaving max-width control to the layout (which is `PROMPT-app-layout.md` territory, not this prompt)
- The "Pagina niet gevonden" fallback is intentionally minimal — a proper 404 page comes later

### `pages/index.vue` — root page

If this file already exists from previous work and uses the same pattern (`queryCollection('content').path('/').first()` + `ContentRenderer`), **leave it alone**. If it doesn't exist or uses a different pattern, mirror the structure from `[...slug].vue` but hardcode the path to `/`:

```vue
<script setup lang="ts">
const { data: page } = await useAsyncData('home', () =>
	queryCollection('content').path('/').first(),
)

useSeoMeta({
	title: () => page.value?.title,
	description: () => page.value?.description,
})
</script>

<template>
	<div v-if="page">
		<h1 class="text-4xl font-bold tracking-tight mb-3">
			{{ page.title }}
		</h1>
		<p
			v-if="page.description"
			class="text-lg text-muted mb-12"
		>
			{{ page.description }}
		</p>
		<div class="prose dark:prose-invert max-w-none">
			<ContentRenderer :value="page" />
		</div>
	</div>
</template>
```

### `content/index.md`

Ensure the frontmatter contains `schemaVersion: 1` and the body does **not** contain a top-level H1 (the title comes from frontmatter via the page template):

```md
---
title: Welkom bij 1000x
description: Documentatie- en leersysteem voor het team
schemaVersion: 1
---

Dit is de eerste pagina, gerenderd door Nuxt Content. Als je dit ziet, werkt de markdown-pipeline.

## Wat nu?

Volg de implementatie-roadmap uit `features.md`. Stap 1 van feature 1 is nu klaar — deze pagina dient als smoke-test voor de basis-rendering.
```

### `content/test-prose.md` — new test page

A page that exercises every basic markdown element so the prose components can be visually verified. Reachable at `/test-prose`. Use realistic Dutch content — not Lorem Ipsum — so it reads as a sensible document if someone actually opens it.

Frontmatter:

```yaml
---
title: Prose Test Pagina
description: Een test-pagina die alle basis-markdown-elementen oefent voor visuele verificatie van de typografie
schemaVersion: 1
---
```

Body should include, in this order:

1. An intro paragraph (1-2 sentences) explaining what this page tests
2. An `## H2` heading followed by a paragraph
3. An `### H3` heading followed by a paragraph
4. An `#### H4` heading followed by a paragraph
5. An unordered list with 3-4 items (something meaningful, not "item 1 item 2")
6. An ordered list with 3-4 steps (something meaningful, like a checklist)
7. A nested list (one level deep) under one of the unordered items
8. A blockquote with a meaningful Dutch quote — pick something programming-related, e.g. a quote about clean code or readability
9. A paragraph with inline `code`, **bold**, and *italic* text
10. Two inline links — one to `/` (internal) and one to an external site like `https://nuxt.com`
11. A horizontal rule (`---`)
12. A simple table (3 columns, 3 rows) with realistic content, e.g. comparing characteristics of three programming languages

**Do not** include code blocks (Step 2), MDC blocks like `::tabs` or `::callout` (Step 3), or images (Step 4). This page is intentionally limited to base markdown.

### `content/test-no-schema-version.md` — fixture for default-behavior test

A small fixture-page that intentionally has **no** `schemaVersion` field in its frontmatter. The zod-default kicks in and the page should still render correctly. The E2E test for schemaVersion-default behavior (see `test-plan.md`) uses this file.

```md
---
title: Test Zonder Schema Versie
description: Dit bestand heeft expres geen schemaVersion in frontmatter, om te testen dat de default-waarde uit zod werkt
---

Als deze pagina rendert, werkt de zod-default voor `schemaVersion`.
```

That's the entire body — keep it minimal. The point of this file is the missing `schemaVersion`, not the content.

## Code style

- Tabs for indentation, single quotes for strings, no semicolons — `@antfu/eslint-config` is the source of truth
- If lint fails, fix the code, don't override the config
- Vue SFC block order: `<script setup lang="ts">`, then `<template>`, then `<style>` if any
- TypeScript on; use `lang="ts"` in every `<script setup>` block
- Component names in templates: PascalCase for Nuxt UI components (`<UButton>`, not `<u-button>`), match existing codebase style

## Acceptance criteria

- ✅ `npm install` (or `pnpm install`) completes cleanly; `@nuxt/content` and `@nuxt/ui` v4 are present in `package.json`
- ✅ `content.config.ts` defines the `content` collection with the zod schema (title, description, schemaVersion default 1) and **no other fields**
- ✅ `npm run dev` starts without errors related to content or modules
- ✅ Visiting `/` renders `content/index.md` with `Welkom bij 1000x` as the H1 (rendered from frontmatter via the page template, **not** from a body H1)
- ✅ Visiting `/test-prose` renders the test page successfully; the title `Prose Test Pagina` appears as the H1
- ✅ H2, H3, H4 headings on the test page have anchor-link affordances (visible on hover); clicking an anchor sets a URL fragment like `/test-prose#h2-heading` and scrolls the page to that heading
- ✅ Lists (ordered, unordered, nested), blockquote, inline `code`, **bold**, *italic*, horizontal rule, and table all render with Nuxt UI's prose styling — clear spacing, accent color on links, monospaced background for inline code, sensible table borders
- ✅ All markdown files under `content/` have `schemaVersion: 1` in their frontmatter
- ✅ Removing the `schemaVersion` field from one file (as a manual test) does **not** break that page — the zod default kicks in. Restore the field after testing
- ✅ `npm run lint` passes with no errors

## What NOT to do

- ❌ **Do not** configure Shiki theme or language whitelist — that's Step 2
- ❌ **Do not** add `::tabs`, `::callout`, `::code-group`, or any other MDC custom block to test pages — that's Step 3
- ❌ **Do not** install `@nuxt/image` or override `ProseImg` — that's Step 4
- ❌ **Do not** add rehype plugins for asset path resolution — that's Step 5
- ❌ **Do not** add a localized-asset resolver — that's Step 6
- ❌ **Do not** add `.passthrough()` to the zod schema or implement a dev-warning for unknown fields — that's Step 7
- ❌ **Do not** add `icon`, `scope`, `nav`, `order`, or other navigation-related fields to the schema — those belong to features 2 and 19
- ❌ **Do not** build the layout chrome (header, sidebar, right panel) — that's `PROMPT-app-layout.md`, separate prompt
- ❌ **Do not** write a `# H1` in the markdown body of any page — H1 always comes from frontmatter via the page template
- ❌ **Do not** install Prettier, EditorConfig overrides, or alternative markdown parsers (markdown-it, marked, etc.) — Nuxt Content's pipeline is the only one
- ❌ **Do not** install `@nuxtjs/seo` or `@nuxtjs/sitemap` — content is auth-gated, indexing is disabled at deploy-level

## When you're done

Run through the acceptance criteria one by one. If something doesn't pass, fix it before reporting back. Summarize what you built, which files you touched, what you skipped (because it was already there), and any deviations from this prompt — with reasoning.
