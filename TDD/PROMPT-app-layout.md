# Claude Code prompt — Complete App Layout Scaffold

> Copy-paste deze hele prompt in Claude Code (binnen je 1000x-project). Hij bouwt de complete default app-layout: header met logo + menu + acties, left sidebar, right panel met smart ToC, main content area met changelog en prev/next eronder. **Visueel scaffolding alleen — geen werkende functionaliteit.**

---

## Task

Build the complete default Nuxt layout for 1000x. This includes the header chrome, a left section sidebar, a right panel with panel-switcher and ToC, the main content slot, the changelog block below the content, and the prev/next navigation cards below the changelog.

The scope also includes the page-level chrome that wraps the markdown content: an `H1` rendered from frontmatter, a page action bar (View/Edit + Copy/dropdown) inline next to the H1, and a description lede below the H1. Architecturally this lives in the page template (`pages/index.vue`), not the layout — but it's part of this scaffold so the visual design can be reviewed end-to-end.

Use realistic demo content so the layout can be visually evaluated.

This is **visual scaffolding only — no functional behavior, no data binding, no routing logic, no real interactivity.** Buttons, icons, and dropdowns must look correct but do nothing on click. **Two exceptions:**
- The resize handle between content and right panel is fully functional (resizing is core per spec feature 5)
- The page action bar's View/Edit toggle visually switches active segment between View and Edit on click (purely local component state — does NOT actually swap the content area to an editor; real edit-mode is feature 10)

See `ResizeHandle.vue` and `PageActionBar.vue` specs below.

## Context to read first

Before writing any code, read these files in order:

1. `AGENTS.md` — project stack, code style, naming conventions, do/don't rules
2. `features/01-markdown-rendering/spec.md` — content engine context
3. `features/02-section-sidebar/spec.md` — left sidebar requirements
4. `features/03-header/spec.md` — header requirements
5. `features/05-rechter-panel-en-toc/spec.md` — right panel + smart ToC requirements
6. `features/06-changelog-en-prev-next/spec.md` — below-content navigation
7. `spec.md` — cross-reference for any detail unclear from the per-feature docs
8. `app/assets/css/main.css` — current Tailwind + Nuxt UI imports

## Deliverables

```
app/
├── app.config.ts                       ← NEW: Nuxt UI accent color
├── app.vue                              ← UPDATED: <UApp><NuxtLayout><NuxtPage /></NuxtLayout></UApp>
├── pages/
│   └── index.vue                        ← UPDATED: H1 + action bar + lede + content
├── layouts/
│   └── default.vue                     ← NEW: full chrome layout with reactive panel width
└── components/
    ├── layout/                          ← NEW directory
    │   ├── AppHeader.vue               ← logo + nav + action icons
    │   ├── SectionSidebar.vue          ← left scope-bound nav
    │   ├── RightPanel.vue              ← panel-switcher + ToC
    │   ├── PageChangelog.vue           ← below-content history
    │   ├── PagePrevNext.vue            ← below-changelog cards
    │   └── ResizeHandle.vue            ← functional drag-to-resize for right panel
    └── page/                            ← NEW directory
        ├── PageBreadcrumb.vue           ← breadcrumb above title row
        └── PageActionBar.vue           ← View/Edit toggle + Copy/dropdown next to H1

content/
└── index.md                             ← UPDATED: remove body H1 (title comes from frontmatter)

i18n/locales/
├── nl.json                              ← UPDATED: layout + page strings
└── en.json                              ← UPDATED: layout + page strings
```

## Configure the accent color

In `app/app.config.ts`:

```ts
export default defineAppConfig({
	ui: {
		colors: {
			primary: 'red',
			neutral: 'slate',
		},
	},
})
```

## Layout structure

```
<UApp>
  <div class="grid grid-rows-[auto_1fr] min-h-screen">

    <!-- HEADER -->
    <AppHeader />              ← sticky top, full width, bottom border

    <!-- 3-COLUMN BODY -->
    <div class="grid grid-cols-[260px_1fr_auto_var(--right-panel-width,320px)]
                overflow-hidden">

      <!-- LEFT: section sidebar -->
      <aside class="border-r border-(--ui-border) overflow-y-auto">
        <SectionSidebar />
      </aside>

      <!-- CENTER: content + changelog + prev/next -->
      <main class="overflow-y-scroll [scrollbar-gutter:stable]">
        <article class="max-w-3xl mx-auto px-8 py-10">
          <slot />             ← page content goes here
        </article>

        <div class="max-w-3xl mx-auto px-8 pb-16 space-y-12">
          <PageChangelog />
          <PagePrevNext />
        </div>
      </main>

      <!-- RESIZE HANDLE — functional drag, not just visual -->
      <ResizeHandle v-model:width="rightPanelWidth" />

      <!-- RIGHT: panel-switcher + TOC -->
      <aside class="border-l border-(--ui-border) overflow-y-auto">
        <RightPanel />
      </aside>

    </div>

  </div>
</UApp>
```

**Critical scrollbar rule:** the scroll happens on the `<main>` column wrapper (`overflow-y-scroll`), NOT on the inner `<article>`. The article has `max-w-3xl mx-auto`, which means there's whitespace to the right of the article inside the main column — the scrollbar sits at the far right edge of the main column, against the resize handle, with that whitespace between the article text and the scrollbar. This matches Nuxt Content / docs-site behavior where the scrollbar is always on the outer column edge, never crowding the content.

Use `[scrollbar-gutter:stable]` on the main column so the scrollbar reserves space even when content fits — prevents layout shift between short and long pages.

Three columns scroll independently. Header stays sticky during scroll.

**Right panel width is reactive:** the resize handle drives a CSS custom property `--right-panel-width` set in the layout's `<script setup>` via `:style`. Default `320px`, min `240px`, max `480px`.

## Per-region specifications

### `AppHeader.vue`

Three zones in a single sticky bar with a bottom border:

**Left — text logo**
- The word `1000x` in lowercase
- The first character `1` in primary color (`text-primary`); the rest in default foreground
- Bold, slightly larger than body text
- Wrapped in a `NuxtLink` to `/`

**Middle — six category buttons**
Categories from spec feature 7 (use `$t('nav.*')`):
1. The Lab
2. Syntax
3. Kitt
4. Vuln
5. Xpl01ts
6. Knowledge Base

Each: ghost-variant button with label + `lucide:chevron-down` icon, hover state. **Don't wire dropdowns** — clicks do nothing. Hardcode `Syntax` as visually active with a primary-color underline that lands exactly on the header's bottom divider (use `-mb-px` or equivalent so the underline overlaps the divider — one continuous line, no gap above the border).

**Right — five icon-only action buttons**
All ghost variant, each with a tooltip on hover. No visible text labels:
1. Search — `lucide:search`
2. AI — `lucide:sparkles`
3. Language — `lucide:languages`
4. Theme — `lucide:moon`
5. Settings — `lucide:settings`

### `SectionSidebar.vue`

Left navigation showing the current section's structure. Use this hardcoded demo data:

- Scope label at top: `Syntax` with `lucide:code-2` icon
- Two chapters (each a row with icon left + chevron right, expandable visually):
  - **JavaScript** (`simple-icons:javascript` icon) — expanded by default, showing pages:
    - Variables
    - Functions
    - **Closures** ← active page (demo)
    - Async
    - Modules
  - **Python** (`simple-icons:python` icon) — collapsed by default, no pages visible
- Below the chapter list: an inline `+ nieuw hoofdstuk` row, subtle styling with dashed border around the `+` icon and lighter text

**Chapter row layout (left to right):**
`[chapter icon] [Chapter name] ............................. [chevron]`

- Icon sits on the left (the chapter's own icon — `simple-icons:javascript`, etc.)
- Chapter name follows the icon
- Chevron sits on the **right edge** of the row, not the left
- Chevron uses `lucide:chevron-right` when collapsed, `lucide:chevron-down` when expanded (or rotate the same icon 90° via CSS transition)
- Whole row is clickable to expand/collapse

**Active-page indicator (critical detail per spec feature 02):**
- Pages under an expanded chapter share **one continuous vertical line** on their left side
- Default: gray (`border-l-(--ui-border)`)
- Active page (`Closures`): the same line, just colored primary (`border-l-(--ui-primary)`)
- This must be **one visual line that changes color at the active row**, NOT two parallel lines with a gap. Use `border-l` on each page row, never on the container.

Pages right-click to show a context menu (visual only — `Hernoemen`, `Verwijderen`).

### `RightPanel.vue`

Right column with two parts:

**Top — panel-switcher icon row**
A row of four icon-only buttons. The demo page (`Closures`) is a programming-language page, so the Code editor button is visible per spec feature 5 (Code editor only appears on pages with a programming or code-use-case):
1. ToC — `lucide:list` (active)
2. Code editor — `lucide:code` (inactive demo)
3. Cards — `lucide:gallery-vertical` (inactive demo)
4. Comments — `lucide:message-square` (inactive demo)

Active button: filled background (primary). Others: ghost. Tooltips on hover. **Don't wire panel switching** — clicking a non-active button does nothing yet.

> Note: on non-programming pages the Code editor button hides and only the three always-available buttons show. We're hardcoding the programming-page case for this demo. Conditional visibility comes when real route data drives the panel switcher in a later prompt.

**Below — ToC content**
Hardcoded demo headings (no scroll-driven behavior yet):
- Wat zijn closures?  ← `H2`, currently visible (highlighted)
  - Lexical scope         ← `H3`
  - Variabelen vasthouden ← `H3`
- Praktische voorbeelden ← `H2`
  - Counter pattern       ← `H3`
  - Module pattern        ← `H3`
- Veelgemaakte fouten    ← `H2`

Style: indented hierarchy, currently-visible heading highlighted in primary color, others muted. No expand/collapse arrows — purely visual scroll position indicator.

### `PageChangelog.vue`

A page-level changelog rendered in **Nuxt UI Pro's changelog style**: a vertical timeline grouping commits by version, with version badges, commit hash chips, author info, commit messages, and optional PR links. See https://ui.nuxt.com/components/changelog for visual reference.

**Heading**
- Use `<h2>{{ $t('page.changelog') }}</h2>` — must render as "Wijzigingen" (NL) / "Changelog" (EN)
- **Critical**: this must resolve via i18n. If the rendered output is `PAGE.CHANGELOG` or `page.changelog` (the raw key), the `$t()` call is broken — fix the i18n setup, don't fall back to a hardcoded string
- Style: regular H2 typography (large, bold), NOT a small uppercase eyebrow label

**Structure**

A vertical timeline below the heading, with a single gray connecting line running down the left side of all items. The line passes through tag icons (for versions) and continues through commits indented underneath.

**Per version row (left → right):**
- Tag icon (`lucide:tag`) centered ON the vertical timeline line
- Version badge to the right: rounded pill, soft primary background, primary text (e.g. `v0.3`)
- Date on the far right, muted text (e.g. `3 mei 2026`)

**Per commit row (indented below its version, vertical line continues on the left):**
- Hash chip on the left: monospace, small rounded rectangle, subtle border, slightly muted background (e.g. `7d1e8`)
- Em-dash ` — ` separator
- Small avatar circle (24px) with author initials, colored background per author
- Author name in bold, default foreground
- Colon separator
- Commit message in default foreground (Dutch text)
- Optional PR link at the end: `#42` in primary color, link-styled with hover underline

**Demo data**

Three versions, five commits total. Mix of two authors — Joost de Vries (initials JV, soft red avatar background) and Sara Bakker (initials SB, soft blue avatar background):

```
🏷  v0.3                                                  3 mei 2026
│
│   7d1e8 — [JV] Joost de Vries: voorbeelden uitgebreid met module pattern (#42)
│   9a2b1 — [JV] Joost de Vries: typo's gecorrigeerd in lexical scope sectie
│
🏷  v0.2                                                  28 april 2026
│
│   c9704 — [SB] Sara Bakker: lexical scope sectie herschreven (#38)
│   3f81d — [SB] Sara Bakker: code voorbeelden toegevoegd
│
🏷  v0.1                                                  15 april 2026
│
│   5cb65 — [JV] Joost de Vries: initiële versie van closures pagina
```

**Styling specifics**

- Vertical line: `border-l border-(--ui-border)` running through all items, single continuous line — uses the same "one continuous line" rule as the sidebar (NOT two parallel lines)
- Tag icon: `lucide:tag`, muted color, centered on the line via negative left margin
- Version badge: Nuxt UI's `UBadge` with `variant="soft"` and `color="primary"`, content like `v0.3`
- Hash chip: `<code>` element with `font-mono text-xs`, subtle bordered chip styling — match the visual weight of the Nuxt UI Pro example
- Avatar: `UAvatar` with `size="xs"` (24px), `text` prop for initials, custom background colors via `:ui="{ background: 'bg-red-100 dark:bg-red-900/30' }"` for JV and `bg-blue-100 dark:bg-blue-900/30` for SB
- Author name: `font-semibold text-default`
- Commit message: `text-default`, no bold
- PR link: `text-primary hover:underline` — visually a link
- Date: `text-sm text-muted` on the far right of the version row
- Comfortable spacing — Nuxt UI Pro uses generous vertical rhythm between commits (~12px) and more between version groups (~24px)

**Important visual rules**

- The vertical line is **one continuous line** running through versions and commits — same anti-pattern to avoid as in the sidebar (no two parallel lines with a gap)
- Hash chip and version badge are visually distinct: hash uses neutral/muted styling, version badge uses primary accent
- Author avatar should be small (24px) — it's secondary information, not the focal point of the row. Nuxt UI Pro doesn't show avatars at all; we add them subtly without dominating the layout

### `PagePrevNext.vue`

Use Nuxt UI's **`<UContentSurround>`** component directly — don't build the card UI manually. It produces exactly the prev/next card pattern needed: circular arrow icon button (top-left for prev, top-right for next), bold title below, description below that, with everything aligned left in the prev card and right in the next card. This component is part of `@nuxt/ui` v4 (the unified open-source package, formerly Pro).

In production, it pairs with Nuxt Content's `queryCollectionItemSurroundings()` which automatically returns the prev/next pages based on the current route. For this scaffold, pass hardcoded mock data since there's no real route navigation yet.

**Implementation:**

```vue
<script setup lang="ts">
const surround = [
	{
		path: '/syntax/javascript/functions',
		title: 'Functions',
		description: 'De bouwstenen van iedere JavaScript-applicatie — declaraties, expressions, en het verschil tussen regular en arrow functions.',
	},
	{
		path: '/syntax/javascript/async',
		title: 'Async',
		description: 'Asynchrone JavaScript via Promises, async/await, en de event loop. Zonder dit ben je verloren in modern web.',
	},
]
</script>

<template>
	<UContentSurround :surround="surround" />
</template>
```

The component handles the layout, hover states, arrow icons, alignment, and all visual styling natively. **Don't override the styles** — let Nuxt UI's defaults render. If `path`/`_path` shape needs adjustment for the version installed, check Nuxt UI's `UContentSurround` docs and Nuxt Content's surround data shape.

### `ResizeHandle.vue` — functional, not just visual

The drag handle between main content and right panel. **This one is functional** because resizing the panel is a core interaction per spec feature 5, not a future-feature.

**Behavior:**
- `v-model:width` — two-way binds to a number (pixels) controlled by the parent layout
- On `mousedown` on the handle: capture initial mouse-X and current width, attach window-level `mousemove` and `mouseup` listeners
- On `mousemove` while dragging: compute delta and update width via `emit('update:width', clamped)`
- On `mouseup`: detach listeners
- Clamp width between `min` (240) and `max` (480) props with sensible defaults
- Add `cursor-col-resize` to the handle and to `document.body` while dragging (so cursor stays consistent if mouse strays)
- Add `select-none` to body during drag (prevents text selection)
- Touch support is nice-to-have but not required — desktop scaffolding only

**Visual:**
- 1px wide line by default (`bg-(--ui-border)`)
- Thickens to ~3px on hover with primary color
- Same thicker primary state during active drag

**State persistence: not required in this scaffold.** Width resets to default (320) on page refresh — persistence comes later via Settings UI-state (feature 12). Keep the state in `default.vue` via `ref` for now.

The default layout owns the reactive `rightPanelWidth` ref and passes it to both the resize handle (`v-model:width`) and the grid template (via `:style="{ '--right-panel-width': rightPanelWidth + 'px' }"` on the body grid container).

### `PageBreadcrumb.vue` — page-level navigation aid

A breadcrumb trail showing the page's location in the section hierarchy. Sits at the very top of the page content, above the H1 + action bar row. Like the action bar, this lives in the page template, not the layout.

**Demo data (hardcoded for scaffold):**
The breadcrumb reflects where the active sidebar page would sit if we were truly on the Closures page:

```
Syntax  ›  JavaScript  ›  Closures
```

- `Syntax` — section/scope (clickable visual style)
- `JavaScript` — chapter (clickable visual style)
- `Closures` — current page (active styling, not clickable)

**Visual**
- Use Nuxt UI's `UBreadcrumb` component if it fits the spec; otherwise build a small custom row
- Separator between items: `lucide:chevron-right` (small, muted)
- Non-active items: `text-sm text-muted hover:text-default cursor-pointer`
- Active item (last in chain): `text-sm text-default font-medium`, no hover
- No icons next to labels in the breadcrumb (icons live in the sidebar; the breadcrumb is text-only for clarity)
- Margin-bottom of ~16px so it sits comfortably above the title row

**Note about reality vs scaffold:** in the real app the breadcrumb is data-driven — same nav-tree as the sidebar provides the trail from current route to root. For this scaffold, the path is hardcoded because the demo page (`Welkom bij 1000x` at the root) wouldn't have a meaningful breadcrumb otherwise. Treat this as a visual demonstration of the component, not a wired-up navigation.

### `PageActionBar.vue` — page-level component

**Architectural note:** the action bar lives in the page template (`pages/index.vue`), not the layout. Different page types may have different action bars (or none — e.g. an index/overview page). The layout slot is intentionally generic. But for this scaffold we build the action bar component AND wire it into `pages/index.vue` so the visual design is reviewable.

Per spec feature 7, the action bar sits inline to the right of the H1 with two segmented button groups:

**Group 1 — View / Edit toggle**
- Two segments: `View` and `Edit`
- Shared border, no gap between segments, one vertical divider
- Active segment: filled background (use `solid` variant). Inactive: blank (use `ghost` variant)
- Default state: `View` is active
- Click toggles local component state — does NOT actually swap content for an editor (real edit-mode is feature 10)

**Group 2 — Copy + dropdown**
- Two parts in one segmented group: `Copy page` button and a chevron-down button
- Shared rounded border, vertical divider between them, identical height
- `Copy page`: ghost-variant button with `lucide:copy` icon and label
- Chevron: ghost-variant icon-only button with `lucide:chevron-down`
- Click on `Copy page`: does nothing yet (real clipboard copy is later)
- Click on chevron: opens a dropdown menu (use `UDropdownMenu`) with four items:
  - `Copy as markdown` (icon: `lucide:file-code`)
  - `Open in Claude` (icon: `simple-icons:claude`)
  - `Open in ChatGPT` (icon: `simple-icons:openai`)
  - `View as markdown` (icon: `lucide:file-text`)
- Dropdown items don't do anything yet — visual menu only

**Layout between groups**
- Small gap (~8px) between group 1 and group 2 — they're semantically different
- Within each group: zero gap, segments share borders and look fused

**Visual via Nuxt UI**
- Use `UButtonGroup` for both groups (handles shared borders correctly)
- Use `size="sm"` to keep the bar visually compact next to a large H1
- Use `color="neutral"` for both groups so they don't compete with the primary-colored elements elsewhere

### `pages/index.vue` — page template update

Replace the existing minimal page template with a structured page that demonstrates the full page chrome:

```vue
<script setup lang="ts">
const { data: home } = await useAsyncData('home', () =>
	queryCollection('content').path('/').first(),
)

useSeoMeta({
	title: () => home.value?.title,
	description: () => home.value?.description,
})
</script>

<template>
	<div v-if="home">
		<!-- Breadcrumb above the title row -->
		<PageBreadcrumb class="mb-6" />

		<!-- Title row: H1 left, action bar right -->
		<div class="flex items-start justify-between gap-6 mb-3">
			<h1 class="text-4xl font-bold tracking-tight">
				{{ home.title }}
			</h1>
			<PageActionBar class="shrink-0 mt-2" />
		</div>

		<!-- Description as lede paragraph below H1 -->
		<p
			v-if="home.description"
			class="text-lg text-muted mb-12"
		>
			{{ home.description }}
		</p>

		<!-- Markdown body -->
		<div class="prose dark:prose-invert max-w-none">
			<ContentRenderer :value="home" />
		</div>
	</div>
	<div v-else class="text-muted">
		{{ $t('app.loading') }}
	</div>
</template>
```

Key points:
- The `mx-auto max-w-3xl px-* py-*` wrapper that was on this page is **removed** — that's now the layout's responsibility (the `<article>` in `default.vue` handles max-width and padding)
- The H1 uses `home.title` from frontmatter, not a hardcoded H1 in the markdown body
- The action bar is `shrink-0` (don't squeeze when title is long) and `mt-2` (slight top alignment with H1's optical center)
- Description renders as a muted lede paragraph below the H1
- Markdown body uses `prose` for typography but `max-w-none` to inherit the article's max-width (otherwise prose adds its own narrower max-width on top)

### `content/index.md` — remove body H1

The current `content/index.md` has both `title:` in frontmatter AND `# Welkom bij 1000x` as the first line of the body — this caused a double-H1 in earlier renders. Update the body to remove the H1 (title now renders from frontmatter via `pages/index.vue`):

```md
---
title: Welkom bij 1000x
description: Documentatie- en leersysteem voor het team
---

Dit is de eerste pagina, gerenderd door Nuxt Content. Als je dit ziet, werkt de markdown-pipeline.

## Wat nu?

Volg de implementatie-roadmap uit `features.md`. Phase 1 zit nog in opbouw — deze pagina is alleen een smoke-test.

## Code-block check

Een snippet om te zien of syntax highlighting werkt:

​```ts
const greet = (name: string) => `hoi ${name}`
console.log(greet('wereld'))
​```
```

The body now starts at H2 level. Title renders separately from frontmatter.

## i18n strings to add

In `i18n/locales/nl.json`:

```json
{
	"app": {
		"title": "1000x",
		"loading": "Laden..."
	},
	"header": {
		"search": "Zoeken",
		"ai": "AI assistent",
		"language": "Taal",
		"theme": "Thema",
		"settings": "Instellingen"
	},
	"nav": {
		"the_lab": "The Lab",
		"syntax": "Syntax",
		"kitt": "Kitt",
		"vuln": "Vuln",
		"xpl01ts": "Xpl01ts",
		"knowledge_base": "Knowledge Base"
	},
	"sidebar": {
		"new_chapter": "+ nieuw hoofdstuk",
		"new_page": "+ nieuwe pagina",
		"rename": "Hernoemen",
		"delete": "Verwijderen"
	},
	"panel": {
		"toc": "Inhoudsopgave",
		"cards": "Cards",
		"comments": "Reacties"
	},
	"page": {
		"changelog": "Wijzigingen",
		"prev": "Vorige",
		"next": "Volgende",
		"view": "Bekijken",
		"edit": "Bewerken",
		"copy": "Kopieer",
		"copy_markdown": "Kopieer als markdown",
		"open_claude": "Open in Claude",
		"open_chatgpt": "Open in ChatGPT",
		"view_markdown": "Bekijk als markdown"
	}
}
```

Mirror in `i18n/locales/en.json` with appropriate English translations (`view`/`edit`/`copy`/`copy_markdown`/`open_claude`/`open_chatgpt`/`view_markdown`).

## Design constraints (from AGENTS.md)

- **Tabs** for indentation (not spaces). Single quotes. No semicolons.
- **Auto-imports** are enabled — use `useI18n`, `ref`, `computed`, `defineProps` etc. without manual import statements.
- **All icons** via `<UIcon name="lucide:..." />` or `<UIcon name="simple-icons:..." />` — no inline SVG strings.
- **All visible strings** through `$t()` for i18n — no hardcoded user-facing text.
- **No hardcoded color values** — use Nuxt UI's design tokens (`text-primary`, `bg-primary`, `border-(--ui-border)`, `text-muted`, `text-default`, etc.).
- **Vue SFC** with `<script setup lang="ts">` — typed where useful.
- **Nuxt UI components** preferred over raw HTML where applicable (`UButton`, `UTooltip`, `UIcon`, `UCard`, `UAvatar`, `UContextMenu`).

## What NOT to do

- ❌ No dropdown menu open/close logic — header categories are visual only
- ❌ No search command palette — search icon is decorative
- ❌ No AI slide-panel — AI icon is decorative
- ❌ No language switching — language icon is decorative
- ❌ No theme switching — theme icon is decorative (always shows moon)
- ❌ No Settings page navigation — Settings icon is decorative
- ❌ No sidebar collapse/expand for chapters — Python is always collapsed, JavaScript always expanded (hardcoded demo)
- ❌ No real route detection for active page — `Closures` is hardcoded as active
- ❌ No panel switching in the right panel — ToC is always shown
- ❌ No scroll-driven ToC behavior — headings are static demo
- ❌ No real changelog/prev/next data — hardcoded demo content
- ❌ No mobile layout collapse logic — desktop-only for now (mobile is a separate task, feature 16)
- ❌ No content management actions — `+ nieuw hoofdstuk` row is decorative; right-click context menu is decorative
- ❌ No sub-header for variant-tabs — separate feature, not in this scaffold

## Acceptance criteria

After your changes, running `pnpm dev` and opening `http://localhost:3000` should show:

- ✅ Sticky header at top with bottom border, all elements visible
- ✅ Logo `1000x` left, with the `1` in red, rest in default foreground
- ✅ Six category buttons in the center, `Syntax` shown as active with red underline landing on the header's bottom divider as one continuous line
- ✅ Five icon-only buttons on the right with tooltips on hover
- ✅ Left sidebar with `Syntax` scope label, JavaScript chapter expanded showing 5 pages, Python chapter collapsed, `Closures` highlighted as active page with continuous vertical line indicator (gray + red transition, not two lines)
- ✅ Inline `+ nieuw hoofdstuk` row at the bottom of the sidebar
- ✅ Main content area in the center showing the existing page: breadcrumb at the top (`Syntax › JavaScript › Closures` with chevron separators, last item active), then the title row with H1 `Welkom bij 1000x` (from frontmatter) and the page action bar inline to the right with two segmented button groups (`View | Edit` toggle and `Copy | chevron`), description as a muted lede paragraph below the H1, then the markdown body content
- ✅ The page action bar's `View` segment is filled (active), `Edit` is ghost. The chevron in the second group opens a dropdown menu with four items (`Copy as markdown`, `Open in Claude`, `Open in ChatGPT`, `View as markdown`) when clicked — visual menu only
- ✅ Below the content: changelog block in Nuxt UI Pro style — H2 heading "Wijzigingen" (resolved via i18n, NOT the raw key `PAGE.CHANGELOG` or `page.changelog`), vertical timeline with three version groups (`v0.3`, `v0.2`, `v0.1`), each containing one or more commits with hash chip, author avatar, author name, commit message, and optional PR link. Single continuous vertical line passes through all items
- ✅ Below the changelog: prev/next cards (`Functions` ← prev, `Async` → next)
- ✅ Right panel with **four** icon buttons at top (ToC active, Code editor / Cards / Comments inactive — Code editor visible because the demo is a JavaScript page), then ToC content showing the demo headings with `Wat zijn closures?` highlighted
- ✅ A subtle vertical resize handle visible between the main content and the right panel — **drag works**: pulling left or right resizes the panel between 240px and 480px; cursor stays `col-resize` during the drag
- ✅ Main content scrollbar appears at the far right edge of the main column (against the resize handle), with whitespace between the article text and the scrollbar — never crowding the content
- ✅ Header, left sidebar, main content, and right panel all scroll independently — header stays sticky
- ✅ `pnpm lint` returns zero errors
- ✅ `pnpm typecheck` returns zero errors

## Component file size guidance

Keep each component file focused. Rough size targets:
- `default.vue`: ~50 lines (just the grid + slot)
- `pages/index.vue`: ~30–50 lines (page template with title row + lede + ContentRenderer)
- `AppHeader.vue`: ~80–120 lines
- `SectionSidebar.vue`: ~80–120 lines
- `RightPanel.vue`: ~60–90 lines
- `PageChangelog.vue`: ~80–120 lines (timeline structure with version groups)
- `PagePrevNext.vue`: ~40–60 lines
- `PageActionBar.vue`: ~50–80 lines (two button groups + dropdown menu)
- `PageBreadcrumb.vue`: ~30–50 lines (small component, mostly markup)
- `ResizeHandle.vue`: ~40–60 lines (drag logic + visual)

If a component balloons past 150 lines, extract sub-components inside `app/components/layout/` or `app/components/page/`.

## Critical visual details to nail

These are the details that differentiate "looks roughly right" from "matches the spec":

1. **Active-state underline on header categories** — must land _on_ the bottom divider via negative margin, not float above it
2. **Continuous vertical line in sidebar** — gray default, red on active row, **one line** that color-changes at the active row. Use `border-l` per page-row, never on the container
3. **Logo accent** — only the `1` is red; `000x` is default foreground
4. **Header sticky behavior** — `sticky top-0 z-40` with `backdrop-blur` for slight translucency feels right when scrolled past
5. **Three independent scroll regions** — sidebar, main, right panel each have their own overflow
6. **Resize handle** — visible 1px line that thickens to ~3px on hover with primary color, `cursor-col-resize`, and **drag to resize works** (between 240–480px)
7. **Sidebar chevron position** — chevron sits on the **right edge** of the chapter row, not next to the icon. The chapter icon is on the left; the chevron is on the right
8. **Main scrollbar position** — `overflow-y-scroll` with `scrollbar-gutter:stable` on the main column wrapper, NEVER on the inner article. The scrollbar sits on the right edge of the main column (against the resize handle), not adjacent to the article text. The article has `max-w-3xl mx-auto` so there's natural whitespace between text and scrollbar — that's correct, that's how Nuxt Content docs look
