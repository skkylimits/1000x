# Claude Code Prompt — Step 2: Scope-bound sidebar UI

## Project context

This task builds the second implementation step of **template customization 02 — Section sidebar** for the 1000x project: an internal "second brain" and interactive learning system, built on the [Nuxt UI docs-template](https://github.com/nuxt-ui-templates/docs) baseline. Dutch is primary, English secondary. Code style follows `@antfu/eslint-config` via `@nuxt/eslint` — tabs, single quotes, no semicolons, no Prettier.

**Read these documents before starting:**

- `TDD/SPEC.md` — overall product spec. **§ Core Features → 2. Section sidebar** is the conceptual reference (especially the "Active-page indicator — één doorlopende verticale lijn" implementation hint and the consistent-indentation rules); **§ 8. Sub-header met levels** explains why the sidebar under a levels-container shows the active level's pages
- `TDD/FEATURES.md` — Section sidebar, customization 02 in 02-TEMPLATE user flow and UI overview
- `TDD/02-TEMPLATE/02-section-sidebar/SPEC.md` — this customization in detail. Read **§ Implementation Steps → Step 2** for this task's scope and **§ Constraints** for everything that stays out
- `TDD/02-TEMPLATE/04-levels/SPEC.md` — the levels-folder model (sidebar shows pages of the active level; levels-container is chrome, not a sidebar entry)
- `TDD/02-TEMPLATE/05-tabs/SPEC.md` — the tabs-file model (tabs-container appears as a leaf in the sidebar; tab-children live in the in-content TabBar)
- `AGENTS.md` — established conventions

**Step 1 is complete.** The data layer ships:

- `app/utils/nav.ts` — `buildTree`, `walkScope`, `walkEffectiveScope`, `walkBreadcrumb`, `flattenForPrevNext`, plus `NavKind` / `NavNode` / `NavTree` types
- `app/composables/useNavTree.ts` — single source for the tree, backed by `useAsyncData('nav-tree')`
- `app/composables/useCurrentScope.ts`, `useEffectiveScope.ts`, `useBreadcrumb.ts`, `usePrevNext.ts` — derived composables
- `tests/unit/nav.test.ts` — fixture-driven unit tests

This step replaces the docs-template's auto-sidebar with our own component that consumes those composables.

## Task

Replace the docs-template's `<UContentNavigation>`-based sidebar with a scope-bound `SectionSidebar` component that consumes `useNavTree()` + `useEffectiveScope()`. Render a scope-label header, chapters with chevron + collapsible page-list, orphan pages in an implicit container, tabs-containers as leaf entries, and a continuous active-line via per-item `border-left`. Wire it into `app/layouts/docs.vue`. Cover the visible behaviour with Playwright E2E tests against the existing demo content.

**In scope for this step:**

1. Create `app/components/layout/SectionSidebar.vue` — top-level, consumes `useNavTree()` and `useEffectiveScope()` (the level-aware variant; AppLevelHeader handles the level-switching itself in customization 04)
2. Create `app/components/layout/SidebarChapter.vue` — chapter button + collapsible page-list (chevron rotates 90° on expand)
3. Create `app/components/layout/SidebarPageList.vue` — renders a list of `NavNode` page leaves (and tabs-container leaves) with the per-item border-left active-line
4. Render the scope-label at the top with the required `icon`. When the effective scope is a `level`, the scope-label uses that level's `icon` and `title` (not the levels-container's)
5. Render chapters with their `icon` left of the title and the chevron on the right side of the row
6. Render orphan pages (children of the effective scope without a chapter parent) inside the same indented container as a chapter's children — as if there is an invisible default chapter
7. Tabs-container rendering: a child node with `meta.kind === 'tabs-container'` renders as a **leaf entry** (one row, no chevron, tab-children NOT shown). Clicking it navigates to the container's hub-route. The TabBar in-content (Tabs, customization 05 in 02-TEMPLATE) is what surfaces the tab-children, not the sidebar
8. Levels-container suppression: a child node with `meta.kind === 'levels-container'` is **never** rendered as a sidebar entry. AppLevelHeader handles the navigation between its levels at chrome-level (Levels, customization 04 in 02-TEMPLATE). The sidebar simply does not show it
9. Continuous active-line: every page-link gets a `border-left` (1.5px); inactive uses the tertiary border colour from Nuxt UI tokens, the active page swaps to the info colour. No `border-left` on the container wrapper; no vertical margin between items
10. Active-state detection: a sidebar entry is active when `route.path === node.path` OR `route.path.startsWith(node.path + '/')` — the latter ensures a tabs-container leaf is highlighted when one of its tab-children is the current route
11. `aria-current="page"` on the active page-link or tabs-container leaf (use `aria-current="true"` for the tabs-container leaf since the route is technically a tab-child, not the leaf itself)
12. Mount `<SectionSidebar />` in `app/layouts/docs.vue`, fully replacing the existing `<UContentNavigation>` invocation
13. Playwright E2E coverage in `tests/e2e/sidebar.spec.ts` — at minimum the assertions listed under **Acceptance criteria** below
14. Multiple chapters can be expanded simultaneously; opening one **does not** auto-collapse siblings (no accordion-mode)

**Out of scope for this step (assigned to later steps — do not anticipate):**

- Step 3: collapse-state persistence across reloads, roving tabindex, full keyboard handlers (←/→ to collapse/expand, ↑/↓ to navigate, focus-visible styling), accessible-name polish beyond `aria-current`
- Feature 02 in 03-FEATURES: drag-and-drop reordering, inline `+ nieuw …`-affordances, context menus
- Customization 04 in 02-TEMPLATE: the AppLevelHeader chrome-sub-header (this step only ensures the sidebar honours `useEffectiveScope` so its content is correct under a levels-container)
- Customization 05 in 02-TEMPLATE: the in-content TabBar (this step only renders the tabs-container as a leaf in the sidebar)
- Customization 03 in 02-TEMPLATE: header dropdowns
- Anything in `§ Constraints` of the customization SPEC

## Prerequisites — what you can assume

- The current branch is `01-template`. Step 1 has been merged and its files exist
- `app/layouts/docs.vue` currently looks like:
  ```vue
  <script setup lang="ts">
  import type { ContentNavigationItem } from '@nuxt/content'

  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
  </script>

  <template>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation
              highlight
              :navigation="navigation"
            />
          </UPageAside>
        </template>
        <slot />
      </UPage>
    </UContainer>
  </template>
  ```
- `app/app.vue` performs `provide('navigation', navigation)` from `queryCollectionNavigation('docs')` — **leave that provide intact**. It still feeds `<UContentSearch>` (search palette) which is not in scope for this customization. The constraint "geen mengvorm" applies to the **sidebar render path**, not to the navigation data passed to other consumers
- The demo content from the docs-template baseline lives under `content/`: `getting-started/`, `essentials/`, `ai/` (with their own `index.md`, `1.x.md`, `2.x.md` etc. files). This is your test bed
- Demo content lacks frontmatter `icon` on most pages. **Before running Step 2, the user has been instructed to add `icon`, `scope`, optional `nav` to the demo content's `index.md` files** so `buildTree` doesn't throw at boot. If you encounter `buildTree` errors during dev, list the missing fields in your final report rather than silently editing demo content yourself
- Nuxt UI v4 components are available globally (`<UIcon>`, `<UButton>`, `<UCollapsible>`, etc.). Per `AGENTS.md`, **check Nuxt UI v4 first** before building from scratch. `UCollapsible` is a strong candidate for the chapter expand/collapse mechanic — use it unless its slots can't accommodate the chevron-on-right layout

Before starting, run from the project root:

```bash
pnpm dev
```

and visit `/`. Confirm the auto-sidebar from `<UContentNavigation>` renders with the demo content. Capture how it currently looks so you can verify the replacement still navigates the same routes.

## Deliverables

```
app/
├── components/
│   └── layout/
│       ├── SectionSidebar.vue            ← NEW: top-level, consumes useNavTree + useEffectiveScope
│       ├── SidebarChapter.vue            ← NEW: chapter button + collapsible page list
│       └── SidebarPageList.vue           ← NEW: page list with per-item active border-left
└── layouts/
    └── docs.vue                          ← MODIFIED: replace <UContentNavigation> with <SectionSidebar />

tests/
└── e2e/
    └── sidebar.spec.ts                   ← NEW: Playwright coverage of visible sidebar behaviour
```

Do **not** add new dependencies. Do **not** create plugins or stores. Do **not** edit `app/utils/nav.ts` or any composable from Step 1; if you find a gap there, list it in your final report and stop.

## File specs

### `app/components/layout/SectionSidebar.vue`

Top-level orchestrator. Reads `useNavTree()` and `useEffectiveScope()`, slices the effective scope's children into chapters, orphan pages, and tabs-container leaves, and renders the scope-label, the page-list of orphan pages plus tabs-container leaves, and one `<SidebarChapter>` per chapter. **Filters out any child whose `meta.kind === 'levels-container'`** — those are chrome-navigation handled by AppLevelHeader.

```vue
<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

const tree = await useNavTree()
const effectiveScope = await useEffectiveScope()

const scopeNode = computed(() => effectiveScope.value)

const visibleChildren = computed<NavNode[]>(() =>
	(scopeNode.value?.children ?? []).filter(c => c.meta.kind !== 'levels-container'),
)

const chapters = computed<NavNode[]>(() =>
	visibleChildren.value.filter(c => c.meta.kind === 'chapter'),
)

// Orphan pages, level-overview pages (when scopeNode itself is the levels-container's effective scope, this is empty),
// and tabs-container leaves all render in the implicit container at the top
const flatLeaves = computed<NavNode[]>(() =>
	visibleChildren.value.filter(c => c.meta.kind !== 'chapter'),
)
</script>

<template>
	<nav v-if="scopeNode" class="flex flex-col gap-1 p-3 text-sm">
		<div
			class="mb-2 flex items-center gap-2 px-2 py-1.5 font-semibold text-(--ui-text-highlighted)"
		>
			<UIcon
				v-if="scopeNode.icon"
				:name="scopeNode.icon"
				class="size-4 text-(--ui-primary)"
			/>
			<span>{{ scopeNode.title }}</span>
		</div>

		<SidebarPageList v-if="flatLeaves.length" :pages="flatLeaves" />

		<SidebarChapter
			v-for="chapter in chapters"
			:key="chapter.path"
			:chapter="chapter"
		/>
	</nav>
</template>
```

Notes:

- `useNavTree()` and `useEffectiveScope()` are async composables (Step 1). Top-level `await` is fine in `<script setup>`
- `useEffectiveScope` returns the active level when the current route is under a levels-container; otherwise it returns the same node as `useCurrentScope`. The sidebar therefore renders the level's pages directly — no extra logic in this component
- Scope-label colour uses Nuxt UI's CSS-token system (`--ui-text-highlighted`, `--ui-primary`). No hex literals
- The scope-label has no chevron — you cannot collapse the scope you are in (per the SPEC)
- A null `scopeNode` (e.g. on a route outside any tree) renders nothing; this is acceptable for Step 2

### `app/components/layout/SidebarChapter.vue`

Chapter row + collapsible page-list. Use Nuxt UI's `<UCollapsible>` if its slot structure permits the chevron-on-right layout; otherwise build the open/closed mechanic with a local `ref<boolean>` and conditional rendering.

```vue
<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

const props = defineProps<{ chapter: NavNode }>()

const expanded = ref(true)

// Filter out levels-containers from chapter children too — same rule as the top-level filter
const visibleChildren = computed(() =>
	props.chapter.children.filter(c => c.meta.kind !== 'levels-container'),
)
</script>

<template>
	<div class="flex flex-col">
		<button
			type="button"
			class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-(--ui-text) transition-colors hover:bg-(--ui-bg-elevated)"
			@click="expanded = !expanded"
		>
			<UIcon
				v-if="chapter.icon"
				:name="chapter.icon"
				class="size-4 shrink-0"
			/>
			<span class="flex-1 text-left font-medium">{{ chapter.title }}</span>
			<UIcon
				name="lucide:chevron-right"
				class="size-4 shrink-0 text-(--ui-text-muted) transition-transform"
				:class="{ 'rotate-90': expanded }"
			/>
		</button>

		<SidebarPageList
			v-if="expanded && visibleChildren.length"
			:pages="visibleChildren"
			class="ml-4 mt-0.5"
		/>
	</div>
</template>
```

Notes:

- Default `expanded = true` for Step 2; persistence comes in Step 3 — do not write to localStorage here
- Chevron is `lucide:chevron-right` rotated 90° when expanded
- Icon is required on chapters; `buildTree` already guarantees it. The `v-if="chapter.icon"` is defensive but should never be falsy in practice

### `app/components/layout/SidebarPageList.vue`

Renders a list of leaf entries (pages, level-overviews, tabs-container leaves) with the per-item active border-left. Uses the active-state rule from the SPEC: `route.path === node.path` OR `route.path.startsWith(node.path + '/')`. The latter clause makes a tabs-container leaf active when any of its tab-children is the current route.

```vue
<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

defineProps<{ pages: NavNode[] }>()

const route = useRoute()

function isActive(node: NavNode) {
	return route.path === node.path || route.path.startsWith(`${node.path}/`)
}
</script>

<template>
	<div class="flex flex-col">
		<NuxtLink
			v-for="page in pages"
			:key="page.path"
			:to="page.path"
			:aria-current="isActive(page) ? (route.path === page.path ? 'page' : 'true') : undefined"
			class="flex w-full items-center border-l py-1.5 pl-4 pr-2 text-left transition-colors"
			:class="isActive(page)
				? 'border-(--ui-primary) text-(--ui-primary) font-medium'
				: 'border-(--ui-border) text-(--ui-text-muted) hover:text-(--ui-text-highlighted)'"
		>
			{{ page.title }}
		</NuxtLink>
	</div>
</template>
```

Notes:

- `border-l` on each `<NuxtLink>` is the implementation of the continuous active-line (per `TDD/SPEC.md` § Section sidebar). Adjacent items have no vertical margin → their borders touch → one continuous visual line. The active link's border colour swaps to `--ui-primary`
- `aria-current="page"` is set when the route is exactly this node; `aria-current="true"` is set when this node is a parent (a tabs-container with one of its tabs active). This satisfies the SPEC's a11y requirement for active-state without needing extra wrappers
- Each `NavNode` corresponds to exactly one row — the data layer never duplicates a node (no file-suffix-collapse exists in this model; levels and tabs are folder-/file-based and detected via the `levels`/`tabs` flags)

### `app/layouts/docs.vue` — modify

Replace the `<UContentNavigation>` invocation with `<SectionSidebar />`. Drop the now-unused `inject('navigation')` and the `ContentNavigationItem` type import.

```vue
<template>
	<UContainer>
		<UPage>
			<template #left>
				<UPageAside>
					<SectionSidebar />
				</UPageAside>
			</template>
			<slot />
		</UPage>
	</UContainer>
</template>
```

The `<script setup>` block can become empty (or be removed entirely if no other logic remains). Do **not** remove the `provide('navigation', navigation)` in `app/app.vue` — it still feeds `<UContentSearch>`.

### `tests/e2e/sidebar.spec.ts`

Playwright. The test suite navigates the demo content and asserts on visible sidebar behaviour. Skeleton:

```ts
import { expect, test } from '@playwright/test'

test.describe('section sidebar', () => {
	test('renders the scope-label with icon for the current page', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const label = page.locator('nav >> text=/getting started/i').first()
		await expect(label).toBeVisible()
		// scope-label is the first row inside <nav>; assert it contains an icon
		const icon = page.locator('nav >> svg, nav >> [class*=iconify]').first()
		await expect(icon).toBeVisible()
	})

	test('expanded chapter shows its child pages', async ({ page }) => {
		await page.goto('/getting-started/installation')
		// expect at least one sibling page-link visible in the same chapter
		await expect(page.getByRole('link', { name: /usage/i })).toBeVisible()
	})

	test('clicking a chapter button toggles its child list', async ({ page }) => {
		await page.goto('/essentials/markdown-syntax')
		const chapterButton = page.getByRole('button').filter({ hasText: /essentials/i }).first()
		await chapterButton.click()
		// collapsed: child link hidden
		await expect(page.getByRole('link', { name: /code blocks/i })).toBeHidden()
		await chapterButton.click()
		await expect(page.getByRole('link', { name: /code blocks/i })).toBeVisible()
	})

	test('active page has aria-current="page"', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const active = page.locator('nav >> [aria-current="page"]')
		await expect(active).toHaveCount(1)
		await expect(active).toContainText(/installation/i)
	})

	test('navigating to a different scope swaps the sidebar contents', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const before = await page.locator('nav').textContent()
		await page.goto('/essentials/markdown-syntax')
		const after = await page.locator('nav').textContent()
		expect(before).not.toEqual(after)
	})

	test('multiple chapters can be expanded simultaneously', async ({ page }) => {
		await page.goto('/')
		// expand at least two chapter buttons and assert both children sets are visible
		// exact selectors depend on the demo content's structure; adapt as needed
	})
})
```

Adapt the selectors to match the actual demo content structure as you implement. The point is that each assertion maps to one acceptance criterion below.

> **Levels and tabs E2E coverage** — only added when the corresponding demo-content stubs (`TDD/01-FOUNDATION/03-content-stubs/SPEC.md`) are in place. The render-rules are pinned by unit tests at the data layer; render-level Playwright tests for "level-content shows in sidebar" and "tabs-container is a leaf" land alongside Levels (customization 04) and Tabs (customization 05) when those features actually need them.

## Code style

- Tabs for indentation, single quotes, no semicolons — `@antfu/eslint-config` is the source of truth
- TypeScript on; explicit types on `defineProps<...>()`
- Vue SFC block order: `<script setup lang="ts">`, then `<template>`, then `<style>` if any (avoid `<style>` here — Tailwind classes only)
- Prefer Nuxt UI components and Tailwind v4 token classes (`text-(--ui-text)`, `bg-(--ui-bg-elevated)`, `border-(--ui-primary)`) over hex values

## Acceptance criteria

- ✅ `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit), and `pnpm test:e2e` all pass
- ✅ `pnpm dev` starts on `http://localhost:3000` without errors
- ✅ Visiting `/`, `/getting-started`, `/getting-started/installation`, `/essentials/markdown-syntax`, `/ai/llms` all render the sidebar with the correct scope and the correct active page
- ✅ The scope-label at the top of the sidebar shows the icon and title from the scope's `index.md` frontmatter (or, when under a levels-container, from the active level's `index.md`)
- ✅ Chapter rows have icon-left + title + chevron-right; chevron rotates 90° on expand
- ✅ Clicking a chapter expands or collapses its child page-list. Multiple chapters can be expanded at the same time (no accordion-mode)
- ✅ Navigating to a page on a different scope swaps the sidebar contents to that scope
- ✅ The active page has `aria-current="page"` and a visibly-coloured `border-left` (info colour) versus the muted border on inactive siblings
- ✅ A levels-container child node is **never** rendered as a sidebar entry; the sidebar shows the active level's pages directly (verified via spot-check once levels-content stubs exist)
- ✅ A tabs-container child node renders as a leaf entry (no chevron, no child enumeration); when one of its tab-children is the current route, the leaf carries `aria-current="true"` and the active border colour
- ✅ `git grep "UContentNavigation"` returns zero matches inside `app/`
- ✅ `git status` shows only the new files plus the modified `app/layouts/docs.vue` — no incidental edits

## What NOT to do

- ❌ **Do not** add localStorage, cookie, or any persistence wiring — Step 3 owns that
- ❌ **Do not** add roving tabindex, arrow-key handlers, or keyboard handlers beyond the native button/link behaviour — Step 3
- ❌ **Do not** render an AppLevelHeader-like sub-header inside the sidebar; that lives at chrome-level (Levels, customization 04 in 02-TEMPLATE)
- ❌ **Do not** render a TabBar inside the sidebar; tab-children live in the in-content TabBar (Tabs, customization 05 in 02-TEMPLATE)
- ❌ **Do not** add a search input, command palette trigger, theme toggle, locale switcher, settings link, breadcrumb, or any other surface inside the sidebar — those live in customizations 03/06/11 and feature 03 in 03-FEATURES
- ❌ **Do not** implement accordion-mode (auto-collapse siblings). The SPEC explicitly allows multiple chapters expanded
- ❌ **Do not** make the scope-label sticky during scroll
- ❌ **Do not** add count badges (`12 pages`), pinning, "recently visited", or hover-previews
- ❌ **Do not** add tooltips on chapter icons; accessible names from text labels are sufficient
- ❌ **Do not** add loading skeletons; SSG renders the real tree on first paint
- ❌ **Do not** add slide-in or fade animations beyond the chevron rotation and the chapter-height collapse
- ❌ **Do not** add Pinia, VueUse, or any other dependency
- ❌ **Do not** edit `app/utils/nav.ts` or any composable from Step 1. If something is missing, list it in your final report and stop
- ❌ **Do not** rebuild the tree client-side — `useNavTree()` already deduplicates via `useAsyncData`
- ❌ **Do not** silently add frontmatter to demo content files. If `buildTree` throws because demo content lacks `icon` or `scope`, list the missing fields and stop — the user will fix the content
- ❌ **Do not** remove the `provide('navigation', ...)` in `app/app.vue` — it feeds `<UContentSearch>`, which is out of scope for this customization
- ❌ **Do not** introduce ARIA attributes beyond `aria-current="page"` / `aria-current="true"` (no `role="tree"`, no `aria-level`, no `aria-setsize`); Step 3 will add the bare minimum needed for keyboard nav

## When you're done

1. Run through every acceptance criterion. If something doesn't pass, fix it before reporting back
2. Summarize:
   - Which files you created or modified (under **Deliverables**)
   - Whether `<UCollapsible>` was a viable host for the chapter mechanic, or whether you built the open/closed state locally — with reasoning
   - Any demo-content frontmatter additions that the user needs to make (e.g. `icon` or `scope` on `content/getting-started/index.md`) so `buildTree` does not throw
   - Any deviations from this prompt with reasoning
   - Confirmation that `git grep "UContentNavigation"` returns zero matches in `app/`

3. Stop. **Do not** start Step 3. The next step adds persistence, keyboard navigation, and WCAG 2.1 AA conformance — that's a separate review.
