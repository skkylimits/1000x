# Claude Code Prompt — Step 1: Tree-build & `useNavTree()` composable

## Project context

This task builds the first implementation step of **template customization 02 — Section sidebar** for the 1000x project: an internal "second brain" and interactive learning system. Dutch is the primary language, English secondary. The project is built on the [Nuxt UI docs-template](https://github.com/nuxt-ui-templates/docs) as baseline, with our customizations and features layered on top.

The brand "1000x" displays with the leading `1` in red and `000x` in default foreground. Code style follows `@antfu/eslint-config` via `@nuxt/eslint` — tabs, single quotes, no semicolons, no Prettier. Project AI context lives canonically in `AGENTS.md` at the project root.

**Read these documents before starting:**

- `TDD/SPEC.md` — overall product spec, including Technical Stack and the project-wide rule that Nuxt UI v4 is consulted first for every UI element. Pay special attention to **§ Core Features → 2. Section sidebar** for the conceptual model and **§ 8. Sub-header met levels** for how levels-containers/levels work
- `TDD/FEATURES.md` — drie-stage roadmap (foundation, template, features) and the implementation order
- `TDD/02-TEMPLATE/02-section-sidebar/SPEC.md` — this customization in detail. Read **§ Implementation Steps → Step 1** for the precise scope of this task, and **§ Constraints** for what stays out
- `TDD/02-TEMPLATE/04-levels/SPEC.md` — the levels-folder model (frontmatter contract, folder-based, no file-suffix-collapse)
- `TDD/02-TEMPLATE/05-tabs/SPEC.md` — the tabs-file model (file-based siblings under a tabs-container)
- `AGENTS.md` — established conventions (component lookup order, icon strategy, content rules, "niet doen"-list)

The architectural choice that shapes this step:

- **Read-side blijft composable, write-side komt pas in feature 02 in 03-FEATURES.** The single source for all nav-surfaces is the composable `useNavTree()` — no Pinia, no Vuex, no other state-manager in this step. The `buildTree` function takes an optional `overlay` parameter that stays empty here; feature 02 in 03-FEATURES (In-app content management) introduces the Pinia store that fills it.

## Task

Build the pure data layer for a scope-bound sidebar: walk the content collection, parse frontmatter, produce a hierarchical navigation tree plus a flat lookup, and expose both via the composable `useNavTree()`. Add three derived composables (`useCurrentScope`, `useBreadcrumb`, `usePrevNext`) that read from `useNavTree()` and the current route. **No UI changes in this step** — the existing `app/components/layout/SectionSidebar.vue` keeps running on its hardcoded chapters. Step 2 will replace it.

**In scope for this step:**

1. A pure function `buildTree(pages, overlay?)` that produces `{ tree, lookup }` from a flat list of Nuxt Content pages
2. The composable `useNavTree()` backed by `useAsyncData` so all consumers share the same tree across the app and across SSR/CSR
3. Walk-up scope resolver: from a route path, walk up through the lookup until the first node with explicit `scope: 'self' | 'children'`; fallback to top-level
4. Effective-scope resolver: when the resolved scope is a `levels-container`, the effective scope for sidebar rendering is the active **level** (the descendant on the current path)
5. Order resolver: `nav: [...]` array on directory `index.md` > `order: N` per page > alphabetical on `title`. For levels-containers, `nav: [...]` wins over `levels: [...]`; for tabs-containers, `nav: [...]` wins over `tabs: [...]`
6. Kind-detection per node: `'page' | 'chapter' | 'levels-container' | 'tabs-container' | 'level' | 'tab'`, derived from frontmatter on the node and parent context
7. `index.md` hoist: a directory's `index.md` becomes the directory node itself and never appears as a child of itself
8. Frontmatter contract validation: a chapter, scope-label or level node without `icon` causes `buildTree` to **throw** with the file path in the error message; a directory that declares both `levels` and `tabs` throws
9. Derived composables (`useCurrentScope`, `useEffectiveScope`, `useBreadcrumb`, `usePrevNext`) implemented as pure computeds over the tree + `useRoute`
10. Unit tests (Vitest) covering `buildTree` and the resolvers across fixture cases

**Out of scope for this step (assigned to later steps — do not anticipate):**

- Step 2: replacing `SectionSidebar.vue`, active-line rendering, chapter expand/collapse UI
- Step 3: collapse-state persistence, keyboard navigation, WCAG 2.1 AA polish
- Feature 02 in 03-FEATURES: overlay merge from in-app content management (the `overlay` parameter exists but stays empty here)
- Customization 04 in 02-TEMPLATE: AppLevelHeader rendering — this step only flags `kind: 'levels-container'` on the tree
- Customization 05 in 02-TEMPLATE: TabBar rendering — this step only flags `kind: 'tabs-container'` on the tree
- Anything in **§ Constraints** of `TDD/02-TEMPLATE/02-section-sidebar/SPEC.md`

## Prerequisites — what you can assume

The Nuxt 4 project is scaffolded per `TDD/01-FOUNDATION/SCAFFOLDING.md`. The current branch is `01-template`. Relevant existing state:

- `content.config.ts` already declares the schema with `scope`, `nav`, `order`, `levels`, `tabs`, `icon`, `schemaVersion` — **do not redefine the schema**, import `contentSchema` if you need it
- The collection is split into `landing` (only `index.md`) and `docs` (everything else). Build the tree from the **`docs`** collection
- `app/components/layout/SectionSidebar.vue` exists with hardcoded chapters from the markdown-rendering scaffold — **do not modify it in this step**
- `app/layouts/default.vue` mounts `SectionSidebar` — **do not modify it**
- The existing demo content under `content/` uses the docs-template's number-prefixed filenames (`1.getting-started/`) and `.navigation.yml` files. We **ignore `.navigation.yml`** — our tree is built only from filesystem + frontmatter. Demo content keeps rendering exactly as before because Step 1 doesn't touch any rendering path
- Vitest is installed and configured (it lives in the markdown-rendering branch's `vitest.config.ts`; verify it's still in this branch). If it's missing, install it as a devDependency

Before starting, run from the project root:

```bash
pnpm ls @nuxt/content vitest
```

to confirm. Use `pnpm` for any installs (`pnpm-lock.yaml` is the lockfile).

## Deliverables

```
app/
├── composables/
│   ├── useNavTree.ts                ← NEW: single-source composable for the nav tree
│   ├── useCurrentScope.ts           ← NEW: walk-up scope resolver for current route
│   ├── useEffectiveScope.ts         ← NEW: walk-up effective scope (levels-aware)
│   ├── useBreadcrumb.ts             ← NEW: derived breadcrumb path
│   └── usePrevNext.ts               ← NEW: derived prev/next from flattened tree
└── utils/
    └── nav.ts                       ← REPLACES the scaffold-stub from test-prompt.md: pure functions and types (buildTree, walkScope, walkEffectiveScope, walkBreadcrumb, flattenForPrevNext, resolveOrder, detectKind, types)

tests/
└── unit/
    └── nav.test.ts                  ← ALREADY EXISTS from test-prompt.md — do not modify; it must turn green as you fill in `nav.ts`
```

If the test session ran first (it should have), `app/utils/nav.ts` is already on disk as a **scaffold-stub** — the type contract is correct and the function bodies all `throw new Error('not implemented: <name>')`. Your job is to keep the type exports verbatim and replace each function body with the real algorithm; do not rename or restructure the public surface, the existing tests pin it. If for some reason the stub is missing, create it from scratch using the contract in `tests/unit/nav.test.ts` as the source of truth.

Do **not** create new Vue components, do **not** create plugins, do **not** add a Pinia store, do **not** touch existing components, do **not** touch `tests/unit/nav.test.ts`.

## File specs

### `app/utils/nav.ts` — pure functions and types

This is the heart of Step 1. All exports here are framework-agnostic — no `useRoute`, no `useState`, no Vue reactivity. The composables in `app/composables/` consume these.

**Public types:**

```ts
export type NavKind =
	| 'page'              // single-file page
	| 'chapter'           // directory with child pages, no levels/tabs flag
	| 'levels-container'  // directory with `levels: true` or `levels: [...]` on its index.md
	| 'tabs-container'    // directory with `tabs: true` or `tabs: [...]` on its index.md
	| 'level'             // direct child directory of a levels-container
	| 'tab'               // direct child file (or directory) of a tabs-container

export interface NavNode {
	/** Route path, e.g. '/syntax/javascript/closures' */
	path: string
	/** Slug — last path segment, used by nav-array ordering */
	slug: string
	/** Display title, from frontmatter */
	title: string
	/** Optional description, from frontmatter */
	description?: string
	/** Iconify reference. Required on chapter, scope-label and level nodes; build throws if missing */
	icon?: string
	/** Scope behaviour from frontmatter: 'self' = directory is its own scope, 'children' = scope is the children list, undefined = inherits */
	scope?: 'self' | 'children'
	/** Children in resolved order */
	children: NavNode[]
	/** Meta — derived during build */
	meta: {
		/** What kind of node this is — drives sidebar/AppLevelHeader/TabBar rendering downstream */
		kind: NavKind
		/** True if this node is a directory (hoisted from index.md) rather than a leaf page */
		isDirectory: boolean
	}
}

export interface NavTree {
	/** Hierarchical roots */
	roots: NavNode[]
	/** Flat lookup keyed by path for O(1) scope-walk and breadcrumb */
	lookup: Map<string, NavNode>
}

/** Overlay shape — placeholder for feature 02 in 03-FEATURES. Stays empty in Step 1 */
export type NavOverlay = Record<string, never>
```

**Public functions:**

```ts
/**
 * Build the nav tree from a flat list of Nuxt Content pages.
 * Throws when a chapter, scope-label or level node lacks an `icon`,
 * or when a directory declares both `levels` and `tabs`.
 */
export function buildTree(pages: ContentPageLike[], overlay?: NavOverlay): NavTree

/**
 * Walk up from a route path through the lookup until a node with explicit
 * `scope: 'self' | 'children'` is found. Returns that node, or the top-level
 * ancestor of the path if no scope is declared.
 */
export function walkScope(routePath: string, lookup: Map<string, NavNode>): NavNode | null

/**
 * Like walkScope, but when the resolved scope is a levels-container, returns
 * the active level on the path instead. The level's children are what the
 * sidebar should render; AppLevelHeader handles the level-switching itself.
 */
export function walkEffectiveScope(routePath: string, lookup: Map<string, NavNode>): NavNode | null

/**
 * Build the breadcrumb chain (root → current) for a route path.
 */
export function walkBreadcrumb(routePath: string, lookup: Map<string, NavNode>): NavNode[]

/**
 * Flatten the tree into the nav-array order so prev/next can be derived.
 * Walks through levels naturally (their nested URLs already keep prev/next
 * within a level). Excludes pure scope-labels and the levels-container itself
 * (the container is chrome-navigation, not a content page). A tabs-container
 * appears once as a leaf; its tab-children are not enumerated here (they live
 * in the in-content TabBar, not in prev/next walk-through).
 */
export function flattenForPrevNext(tree: NavTree): NavNode[]
```

`ContentPageLike` is a minimal structural type that matches what `queryCollection('docs').all()` returns. Define it locally — at minimum:

```ts
interface ContentPageLike {
	/** e.g. '/syntax/javascript/closures' — Nuxt Content's path */
	path: string
	/** e.g. 'docs:syntax/javascript/closures.md' — used to detect directory vs leaf */
	_id?: string
	/** Source filename if available, e.g. 'closures.md' or 'index.md' — used to detect directory-index */
	stem?: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	nav?: string[]
	order?: number
	levels?: boolean | string[]
	tabs?: boolean | string[]
}
```

Use the runtime fields you actually find on pages — don't over-specify. `_id` / `stem` give you the source filename for `index.md`-hoist detection.

**`buildTree` algorithm (high-level):**

1. **Build the directory hierarchy** by splitting paths on `/`. A page whose source filename is `index.md` (detected via `stem` or `_id`) is the **directory node** — its frontmatter applies to the directory itself. Hoist it: it becomes the directory node, never a child of itself. Pages without an explicit directory `index.md` still produce an implicit chapter node when they share a parent path.
2. **Apply the order resolver per directory**:
	- If `index.md` declares `nav: [...]`, sort children to match (slugs not in the array fall to the tail in alphabetical order).
	- Else if children declare `order: N`, sort by `order` ascending.
	- Else alphabetical on `title`.
	- For levels-containers: `nav` (if present) wins over the `levels: [...]`-array; without `nav`, the `levels: [...]`-array determines order; `levels: true` falls back to alphabetical on level-slug.
	- For tabs-containers: `nav` wins over `tabs: [...]`; without `nav`, the `tabs: [...]`-array determines order; `tabs: true` falls back to alphabetical on tab-slug.
3. **Detect kind per node** (after the hierarchy is built):
	- A directory with `levels: true` (or array) on its `index.md` is `'levels-container'`. Its direct child directories become `'level'`.
	- A directory with `tabs: true` (or array) on its `index.md` is `'tabs-container'`. Its direct children (files or directories) become `'tab'`.
	- A directory that has at least one child page and is neither levels- nor tabs-container is `'chapter'`.
	- A leaf page is `'page'`.
	- A directory has both `levels` and `tabs` declared → `throw new Error(\`buildTree: directory \${path} declares both \\\`levels\\\` and \\\`tabs\\\` — choose one (declared in \${sourceFile})\`)`.
4. **Validate icons**:
	- Any `chapter`, `levels-container` (when it's also a scope-label) or `level` node without `icon` throws: `buildTree: missing required \\\`icon\\\` on \${path} (declared in \${sourceFile})`.
	- A leaf `page` without `icon` does not throw (icon is required on chapters/scope-labels/levels because downstream chrome — sidebar headers, AppLevelHeader — needs it).
5. **Build the flat `lookup` map** keyed by `path` while you build.
6. **Overlay**: the `overlay` parameter is reserved for feature 02 in 03-FEATURES. In Step 1, treat any non-empty overlay as a no-op (don't error, just ignore its contents) — feature 02 in 03-FEATURES will replace the body of this branch.

**`walkScope` algorithm:**

1. Look up the node for `routePath`. If not found, return `null`.
2. Walk the path's parent segments from longest to shortest. For each ancestor present in `lookup`, return the first one whose `scope` is `'self'` or `'children'`.
3. If no ancestor declares scope, return the top-level ancestor (the root that owns this branch).

Be deliberate about the shape: when `scope: 'children'` is found on a directory, the scope is **the children of that directory**, not the directory itself — but `walkScope` returns the directory node and the caller decides which slice to render. Don't bake that decision in here.

**`walkEffectiveScope` algorithm:**

1. Run `walkScope`. If it returns `null`, return `null`.
2. If the resolved scope's `meta.kind === 'levels-container'`: walk down from the resolved scope toward `routePath` and return the first descendant whose `meta.kind === 'level'` (the active level). If no level descendant is on the path (e.g. the user is at the levels-container's own `index.md`), return the resolved scope itself; the caller can decide what to show on that landing page.
3. Otherwise return the resolved scope.

**`flattenForPrevNext` algorithm:**

1. Walk the tree depth-first in nav-array order.
2. Emit a node when its `meta.kind` is `'page'`, `'level'` (the level-overview / `index.md` of a level), or `'tab'`. Do not emit `'chapter'`, `'levels-container'`, `'tabs-container'`. The `'level'` overview is emittable because it's a real route; pages within a level continue to be emitted in nested order, so prev/next walks naturally inside a level before crossing to the next.
3. Skip pure scope-labels (directory nodes that exist only as containers and have no own content beyond `index.md` boilerplate) by checking `scope` is set without other content — leave a clear hook so the caller can adjust later.

### `app/composables/useNavTree.ts`

Single source. Backed by `useAsyncData` so every consumer hits the same cache, SSR and CSR alike.

```ts
import type { NavTree } from '~/utils/nav'

export async function useNavTree() {
	const { data } = await useAsyncData<NavTree>('nav-tree', async () => {
		const pages = await queryCollection('docs').all()
		return buildTree(pages)
	})
	return data
}
```

Notes:

- The `useAsyncData` key `nav-tree` deduplicates across all callers
- `buildTree` is auto-imported from `app/utils/nav.ts` via Nuxt's auto-import
- Returns `Ref<NavTree | null>` — consumers must guard for `null` until hydration

### `app/composables/useCurrentScope.ts`

```ts
import type { NavNode } from '~/utils/nav'

export async function useCurrentScope() {
	const tree = await useNavTree()
	const route = useRoute()
	return computed<NavNode | null>(() => {
		if (!tree.value)
			return null
		return walkScope(route.path, tree.value.lookup)
	})
}
```

### `app/composables/useEffectiveScope.ts`

```ts
import type { NavNode } from '~/utils/nav'

export async function useEffectiveScope() {
	const tree = await useNavTree()
	const route = useRoute()
	return computed<NavNode | null>(() => {
		if (!tree.value)
			return null
		return walkEffectiveScope(route.path, tree.value.lookup)
	})
}
```

### `app/composables/useBreadcrumb.ts`

```ts
import type { NavNode } from '~/utils/nav'

export async function useBreadcrumb() {
	const tree = await useNavTree()
	const route = useRoute()
	return computed<NavNode[]>(() => {
		if (!tree.value)
			return []
		return walkBreadcrumb(route.path, tree.value.lookup)
	})
}
```

### `app/composables/usePrevNext.ts`

```ts
import type { NavNode } from '~/utils/nav'

export async function usePrevNext() {
	const tree = await useNavTree()
	const route = useRoute()
	return computed<{ prev: NavNode | null, next: NavNode | null }>(() => {
		if (!tree.value)
			return { prev: null, next: null }
		const flat = flattenForPrevNext(tree.value)
		const i = flat.findIndex(n => n.path === route.path)
		if (i < 0)
			return { prev: null, next: null }
		return {
			prev: i > 0 ? flat[i - 1]! : null,
			next: i < flat.length - 1 ? flat[i + 1]! : null,
		}
	})
}
```

### `tests/unit/nav.test.ts`

Fixture-driven unit tests with Vitest. No Nuxt runtime, no real content collection — pass synthetic page arrays into `buildTree` and assert on the output.

Cover at least these cases (split into `describe` blocks per resolver):

**`buildTree` — basic shape**
- Two flat pages under one directory produce a parent node with two children
- A directory's `index.md` becomes the directory node, not a child of itself
- The flat `lookup` contains every node, keyed by path

**`buildTree` — order resolver**
- `nav: [b, a, c]` on a directory's `index.md` orders children `b, a, c` regardless of filename
- Slugs not in `nav` fall to the tail in alphabetical order (`nav: [a]` with files `a, b, c` → `a, b, c`; with files `c, b, a` → `a, b, c`)
- `order: N` overrides alphabetical when no `nav` array is present
- Falls back to alphabetical on `title` when neither `nav` nor `order` is set
- For a levels-container, `nav: [senior, mid, junior]` overrides `levels: [junior, mid, senior]`
- For a levels-container without `nav`, `levels: [senior, mid, junior]` orders the level-folders in that array order
- For a levels-container with `levels: true` (no array), level-folders fall back to alphabetical on slug

**`buildTree` — kind detection**
- A directory whose `index.md` has `levels: true` gets `meta.kind === 'levels-container'`
- The direct child directories of a levels-container get `meta.kind === 'level'`
- Pages inside a level get `meta.kind === 'page'` (not `'tab'` — tabs are a sibling concept)
- A directory whose `index.md` has `tabs: true` gets `meta.kind === 'tabs-container'`
- The direct children of a tabs-container get `meta.kind === 'tab'`
- A directory with at least one child page and no `levels`/`tabs` flag gets `meta.kind === 'chapter'`
- A leaf page (no children) gets `meta.kind === 'page'`

**`buildTree` — icon validation**
- A directory node with `scope: 'self'` and no `icon` causes `buildTree` to throw, and the error message includes the offending path
- A chapter (directory with at least one child page) without `icon` throws
- A level node without `icon` throws
- A leaf page without `icon` does **not** throw (icon is only required on chapters, scope-labels and levels)

**`buildTree` — flag conflict**
- A directory whose `index.md` declares both `levels: true` and `tabs: true` causes `buildTree` to throw, and the error message includes the offending path

**`walkScope`**
- A page under `/syntax/javascript/closures` whose ancestor `/syntax/javascript/index.md` declares `scope: 'self'` returns that JavaScript node
- No declared scope anywhere on the path returns the top-level ancestor
- Unknown route returns `null`

**`walkEffectiveScope`**
- For a route `/syntax/javascript/junior/closures` where `/syntax/javascript` is a levels-container with `scope: 'self'`, returns the `/syntax/javascript/junior` level node (not the levels-container)
- For a route under a regular `scope: 'self'` directory (not a levels-container), returns the same node `walkScope` returns
- For the levels-container's own `index.md` route (`/syntax/javascript`), returns the levels-container itself (no level on path yet)

**`walkBreadcrumb`**
- Returns `[root, ..., current]` for a known path
- Returns `[]` for an unknown path

**`flattenForPrevNext`**
- Respects nav-array order
- Emits each level's pages in nested order; prev/next within `/syntax/javascript/junior/...` stays inside `junior` until the last junior page, then crosses naturally
- Levels-container nodes themselves are not emitted (they are chrome-navigation, not content pages)
- Tabs-container appears once as a leaf; its tab-children are not enumerated here
- Pure scope-labels (directory nodes that exist only as containers) are excluded

Test skeleton:

```ts
import { describe, expect, it } from 'vitest'
import { buildTree, flattenForPrevNext, walkBreadcrumb, walkEffectiveScope, walkScope } from '../../app/utils/nav'

function page(p: Partial<ContentPageLike>): ContentPageLike {
	return {
		path: p.path!,
		title: p.title ?? p.path!.split('/').pop()!,
		stem: p.stem,
		_id: p._id,
		...p,
	}
}

describe('buildTree — basic shape', () => {
	it('builds a parent with two children', () => {
		const tree = buildTree([
			page({ path: '/syntax/javascript', stem: 'index.md', title: 'JavaScript', icon: 'simple-icons:javascript', scope: 'self' }),
			page({ path: '/syntax/javascript/closures', stem: 'closures.md', title: 'Closures' }),
			page({ path: '/syntax/javascript/functions', stem: 'functions.md', title: 'Functions' }),
		])
		const js = tree.lookup.get('/syntax/javascript')!
		expect(js.title).toBe('JavaScript')
		expect(js.children.map(c => c.slug)).toEqual(['closures', 'functions'])
	})
})

describe('buildTree — kind detection', () => {
	it('marks a levels-container and its level children', () => {
		const tree = buildTree([
			page({ path: '/syntax/javascript', stem: 'index.md', title: 'JavaScript', icon: 'simple-icons:javascript', scope: 'self', levels: ['junior', 'mid', 'senior'] }),
			page({ path: '/syntax/javascript/junior', stem: 'index.md', title: 'Junior', icon: 'lucide:user-round' }),
			page({ path: '/syntax/javascript/junior/closures', stem: 'closures.md', title: 'Closures' }),
			page({ path: '/syntax/javascript/mid', stem: 'index.md', title: 'Mid-level', icon: 'lucide:user-check' }),
			page({ path: '/syntax/javascript/senior', stem: 'index.md', title: 'Senior', icon: 'lucide:crown' }),
		])
		expect(tree.lookup.get('/syntax/javascript')!.meta.kind).toBe('levels-container')
		expect(tree.lookup.get('/syntax/javascript/junior')!.meta.kind).toBe('level')
		expect(tree.lookup.get('/syntax/javascript/junior/closures')!.meta.kind).toBe('page')
	})
})

// ... more describe blocks per resolver
```

`ContentPageLike` is the same minimal type from `app/utils/nav.ts`; export it from there so tests can import it.

## Code style

- Tabs for indentation, single quotes, no semicolons — `@antfu/eslint-config` is the source of truth
- If `pnpm lint` fails, fix the code, don't override the config
- TypeScript on; explicit return types on public exports of `app/utils/nav.ts`
- No `any` in public types; prefer `unknown` plus narrowing or precise structural types
- Composable filenames are camelCase (`useNavTree.ts`); pure-utility filenames are lowercase (`nav.ts`)

## Acceptance criteria

- ✅ `pnpm lint` and `pnpm typecheck` are clean
- ✅ `pnpm test` runs and every test in `tests/unit/nav.test.ts` passes (the new file)
- ✅ All existing tests still pass (`pnpm test`, `pnpm test:e2e` if Playwright is set up)
- ✅ `pnpm dev` starts on `http://localhost:3000` without errors
- ✅ Visiting any existing page (e.g. `/`, `/getting-started`) renders unchanged — Step 1 introduces no UI changes
- ✅ The composables exist and are auto-imported (a sanity check: paste `const tree = await useNavTree()` into a `<script setup>` of any page; `tree.value` is non-null after hydration; remove the line afterwards)
- ✅ `buildTree` throws a descriptive error when given a fixture with a chapter, scope-label or level node missing `icon`, and the error message includes the offending path
- ✅ `buildTree` throws a descriptive error when given a fixture where a directory declares both `levels` and `tabs`
- ✅ `git status` shows only the new files listed under **Deliverables** plus the modified `app/utils/nav.ts` (you replaced the scaffold-stub bodies with real logic) — no incidental edits to existing components, layouts, or pages, and no edits to `tests/unit/nav.test.ts`

## What NOT to do

- ❌ **Do not** modify `app/components/layout/SectionSidebar.vue`, any other layout component, or any page — Step 2 owns the UI replacement
- ❌ **Do not** add a Pinia store, a Vuex store, or any other state-manager dependency — read-side stays composable
- ❌ **Do not** add VueUse for the localStorage wrapper or anything else in this step — feature 02 in 03-FEATURES introduces persistence
- ❌ **Do not** create plugins (`app/plugins/`) — `useAsyncData` inside the composable is sufficient
- ❌ **Do not** add the actual rendering of breadcrumb / prev-next as components in this step — those features (Page chrome customization 06 and Prev/next customization 10) consume the composables later
- ❌ **Do not** parse or honour `.navigation.yml` — the demo content's `.navigation.yml` files are ignored. Build only from filesystem + frontmatter
- ❌ **Do not** redefine the content schema in `content.config.ts` — `scope`, `nav`, `order`, `levels`, `tabs`, `icon` are already there
- ❌ **Do not** introduce a "swappable storage adapter", a generic `<Tree>` component, an event-bus, or a provider pattern — abstraction comes only at second concrete use
- ❌ **Do not** add Zod validation across the entire tree — frontmatter is already validated at the content layer; `buildTree`'s only validation is the `icon`-on-chapter-or-scope-or-level rule and the `levels`-vs-`tabs` flag conflict
- ❌ **Do not** memoize or cache results inside `buildTree` itself — `useAsyncData`'s cache is the only cache. Pure function in, pure function out
- ❌ **Do not** anticipate the overlay-merge from feature 02 in 03-FEATURES beyond the `overlay` parameter signature — body of that branch stays empty/no-op
- ❌ **Do not** anticipate the AppLevelHeader UI from Levels (customization 04) or the TabBar UI from Tabs (customization 05) — surface kinds only via `meta.kind`
- ❌ **Do not** implement any file-suffix `<base>.<variant>.<lang>.md` collapse — that pattern is deprecated. Levels are folders, tabs are sibling files; both are detected via the `levels` / `tabs` frontmatter flags on a directory's `index.md`
- ❌ **Do not** wire `useNavTree()` into any existing component, layout, or page in this step
- ❌ **Do not** skip the unit tests — the SPEC defines them as the green-criteria for Step 1

## When you're done

1. Run through every acceptance criterion. If something doesn't pass, fix it before reporting back
2. Summarize:
   - Which files you created (under **Deliverables**)
   - Any deviation from this prompt and the reasoning (e.g. if Nuxt Content's runtime page shape forced you to refine `ContentPageLike`)
   - Any decisions you made that the user might want to verify (e.g. exact rule for distinguishing a level-overview that should be emitted by `flattenForPrevNext`, behaviour for an empty content collection)
   - Confirmation that `git status` shows only the new files — no incidental edits

3. Stop. **Do not** start Step 2 unless the user asks. The next step replaces `SectionSidebar.vue`; that's a separate review.
