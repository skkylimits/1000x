# Claude Code Prompt — Step 1 Tests: Vitest unit tests for the nav data layer

## Project context

This task writes the **tests** for the first implementation step of **template customization 02 — Sidebar replacement** for the 1000x project. Dutch is the primary language, English secondary. Code style follows `@antfu/eslint-config` via `@nuxt/eslint` — tabs, single quotes, no semicolons, no Prettier.

**Read these documents before starting:**

- `TDD/SPEC.md` — overall product spec; **§ Core Features → 2. Section sidebar** is the conceptual reference for the tree contract
- `TDD/template/02-sidebar-replacement/SPEC.md` — this customization in detail. **§ Implementation Steps → Step 1** lists the public API and the test cases to cover; **§ Implementation Steps → Step 1 → Tests** is the green-criteria checklist
- `TDD/template/02-sidebar-replacement/steps/01-tree-and-composable/prompt.md` — the implementation prompt for Step 1. The public API contract restated in this test prompt **must match** that document; if there is a discrepancy, the implementation prompt wins and you flag it in your final report
- `AGENTS.md` — established conventions

**Workflow context — test-first with a scaffold-stub:**

You write tests against an API that does not have real logic yet. To make the red state meaningful, you also drop a **scaffold-stub** of `app/utils/nav.ts` that exports the full type contract and provides function bodies that immediately `throw new Error('not implemented: <name>')`. With the stub in place, Vitest can resolve the import, discover all `it` blocks, and report each one as a real assertion / runtime failure rather than a single "Cannot find module" before any test runs. That assertion-level red state is the intended baseline — it proves every test is wired correctly and gives the implementation session a concrete green target.

When the implementation session runs `prompt.md`, it overwrites the scaffold-stub's function bodies with real logic. The tests turn green without any change to the test file. If a test stays red after Step 1 ships, the implementation deviates from the contract — fix the implementation, not the test.

**Test infrastructure already exists at the repo root** — Vitest is installed, `vitest.config.ts` is in place, `tests/unit/` is the home for Vitest specs, and `pnpm test` is wired up. You only write the test file and the scaffold-stub; do **not** rebootstrap any of that infra.

## Task

Write fixture-driven Vitest unit tests for the public API of the data layer that Step 1 will introduce: `buildTree`, `walkScope`, `walkBreadcrumb`, `flattenForPrevNext`, plus the `NavNode` / `NavTree` / `NavOverlay` / `ContentPageLike` types — all expected to be exported from `app/utils/nav.ts`. Drop a scaffold-stub of that file so the suite is *discoverable* and fails on assertions rather than on import resolution. **No real implementation logic in this task — the function bodies in the stub all throw `not implemented`.**

**In scope for this task:**

1. Create `app/utils/nav.ts` as a **scaffold-stub**: full type exports (`NavNode`, `NavTree`, `NavOverlay`, `ContentPageLike`) and four function exports whose bodies are exactly `throw new Error('not implemented: <name>')`
2. Create `tests/unit/nav.test.ts` with the test cases listed below, organised in `describe` blocks per resolver
3. Verify the suite is **red** at the assertion level by running `pnpm test` — every test in the suite should be discovered and fail (most on `not implemented` errors; the icon-validation tests fail on regex-mismatch or unexpected-throw)

**Out of scope:**

- Installing Vitest, creating `vitest.config.ts`, or modifying `package.json` scripts — already done at the repo level
- Implementing real logic for any of the four functions in `app/utils/nav.ts` — the implementation session owns that and will overwrite the stub bodies
- Creating any composable, plugin, component, or layout — only the pure-functions stub file
- Playwright / E2E tests — those land with later steps under `tests/e2e/`
- `@nuxt/test-utils` integration — these are pure-function tests with no Nuxt runtime needed
- Snapshot tests — the SPEC's expectations are deterministic and small enough for explicit assertions
- Integration tests against the real Nuxt Content collection — fixtures only

## Prerequisites — what you can assume

- The repo root contains `vitest.config.ts` (configured for `tests/unit/**/*.test.ts`, node environment, `globals: false`)
- `package.json` defines the scripts `test` (= `vitest run`) and `test:watch` (= `vitest`)
- `tests/unit/` exists (currently with only a `.gitkeep` placeholder) — drop your test file there
- `tests/e2e/` exists (Playwright home for later steps) — leave it alone in this task
- `node_modules/` is installed; no `pnpm install` step needed
- The current branch is `01-template`. Step 1 implementation has **not** been merged

Run before starting:

```bash
pnpm test
```

You should see "No test files found" and a non-zero exit. That is the baseline — your new files move the suite from "no tests" to "23 failing tests, each with its own assertion or runtime error", which is the correct red state.

## Deliverables

```
app/
└── utils/
    └── nav.ts             ← NEW: scaffold-stub — type exports + functions that throw 'not implemented: <name>'

tests/
└── unit/
    └── nav.test.ts        ← NEW: fixture-driven unit tests for buildTree, walkScope, walkBreadcrumb, flattenForPrevNext
```

Do **not** create composables, do **not** create components, do **not** modify `content.config.ts`, do **not** modify `app/layouts/docs.vue` or any other production code, do **not** modify `package.json`, `vitest.config.ts`, `playwright.config.ts`, or `.gitignore`. The `git status` after this task should list **only** the two new files above.

## Public API contract — what the tests target

These exports must be present at `~/utils/nav` (i.e. `app/utils/nav.ts`) once Step 1 ships. The tests import directly from the relative path — `../../app/utils/nav` works without Nuxt aliases.

**Types:**

```ts
export interface NavNode {
	path: string
	slug: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	children: NavNode[]
	meta: {
		variants: string[]
		isDirectory: boolean
	}
}

export interface NavTree {
	roots: NavNode[]
	lookup: Map<string, NavNode>
}

export type NavOverlay = Record<string, never>

export interface ContentPageLike {
	path: string
	_id?: string
	stem?: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	nav?: string[]
	order?: number
	variants?: Array<{ id: string, label: string, icon: string }>
}
```

**Functions:**

```ts
export function buildTree(pages: ContentPageLike[], overlay?: NavOverlay): NavTree
export function walkScope(routePath: string, lookup: Map<string, NavNode>): NavNode | null
export function walkBreadcrumb(routePath: string, lookup: Map<string, NavNode>): NavNode[]
export function flattenForPrevNext(tree: NavTree): NavNode[]
```

Behaviour rules — the tests assert these directly:

- A directory's `index.md` is hoisted into the directory node and never appears as a child of itself
- Order resolution: `nav: [...]` on the directory's `index.md` > `order: N` per page > alphabetical on `title`. Slugs not present in `nav` fall to the tail in alphabetical order
- Variants: source filenames matching `<base>.<variant>.<lang>.md` (extension stripped: `<base>.<variant>.<lang>`) collapse into one node `<base>` with `meta.variants` containing the variant ids in alphabetical order
- The canonical variant page is the one whose frontmatter declares `variants: [...]`; if none does, it is the file with the alphabetically-first variant id
- Validation: a directory node that is a scope-label (`scope === 'self'` or `scope === 'children'`) **must** have `icon`. A chapter (a directory node with at least one descendant page) **must** have `icon`. Missing → `buildTree` throws and the error message includes the offending path. Leaf pages without `icon` do **not** throw
- `walkScope` walks the parent path segments from longest to shortest; returns the first node whose `scope` is `'self'` or `'children'`; falls back to the top-level ancestor; returns `null` if `routePath` is not in the lookup
- `walkBreadcrumb` returns `[root, ..., current]` for a known path, `[]` for unknown
- `flattenForPrevNext` walks the tree in nav-array order and emits page nodes only; variant-collapsed nodes appear once; pure scope-labels (directory nodes that exist only as containers) are excluded

If anything in this contract is ambiguous, prefer the wording in `prompt.md` over this restatement — the implementation prompt is canonical.

## File spec — `app/utils/nav.ts` (scaffold-stub)

A minimal file that exports the full type contract and gives every function a `throw new Error('not implemented: <name>')` body. This is **not** the implementation — the implementation session overwrites the function bodies. Keep the types here (the implementation reuses them verbatim).

```ts
export interface NavNode {
	path: string
	slug: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	children: NavNode[]
	meta: {
		variants: string[]
		isDirectory: boolean
	}
}

export interface NavTree {
	roots: NavNode[]
	lookup: Map<string, NavNode>
}

export type NavOverlay = Record<string, never>

export interface ContentPageLike {
	path: string
	_id?: string
	stem?: string
	title: string
	description?: string
	icon?: string
	scope?: 'self' | 'children'
	nav?: string[]
	order?: number
	variants?: Array<{ id: string, label: string, icon: string }>
}

export function buildTree(_pages: ContentPageLike[], _overlay?: NavOverlay): NavTree {
	throw new Error('not implemented: buildTree')
}

export function walkScope(_routePath: string, _lookup: Map<string, NavNode>): NavNode | null {
	throw new Error('not implemented: walkScope')
}

export function walkBreadcrumb(_routePath: string, _lookup: Map<string, NavNode>): NavNode[] {
	throw new Error('not implemented: walkBreadcrumb')
}

export function flattenForPrevNext(_tree: NavTree): NavNode[] {
	throw new Error('not implemented: flattenForPrevNext')
}
```

The leading underscore on parameter names suppresses ESLint's unused-args rule without disabling it. Do **not** soften the throws to "return null" or sentinel values — explicit throws are what make the tests fail loudly and uniformly.

## File spec — `tests/unit/nav.test.ts`

Use a small fixture helper to construct `ContentPageLike` objects. Group tests in `describe` blocks per resolver. The skeleton below is the structural target — fill in the assertion bodies with explicit values (no snapshots, no `toMatchObject` on huge shapes; assert on what each test claims).

```ts
import type { ContentPageLike } from '../../app/utils/nav'
import { describe, expect, it } from 'vitest'
import {
	buildTree,
	flattenForPrevNext,
	walkBreadcrumb,
	walkScope,
} from '../../app/utils/nav'

function page(p: Partial<ContentPageLike> & { path: string }): ContentPageLike {
	return {
		title: p.path.split('/').pop() ?? p.path,
		...p,
	}
}

function dir(p: Partial<ContentPageLike> & { path: string }): ContentPageLike {
	return page({ stem: 'index.md', ...p })
}

describe('buildTree — basic shape', () => {
	it('builds a parent directory with two child pages', () => {
		// Given a JS scope index plus two child pages,
		// the lookup contains all three nodes,
		// and the JS node has both children with the expected slugs in alphabetical order
		// (no nav array → alphabetical fallback)
	})

	it('hoists index.md into the directory node and does not list it as a child', () => {
		// Given a directory with an index.md and one sibling page,
		// the directory node carries the index.md frontmatter and has only the sibling as a child
	})

	it('populates the flat lookup with every node keyed by path', () => {
		// Given a small tree, lookup.get(path) returns the same node as the recursive walk
	})
})

describe('buildTree — order resolver', () => {
	it('respects an explicit nav array on the directory index.md', () => {
		// nav: ['b', 'a', 'c'] yields children in [b, a, c] regardless of filename
	})

	it('places slugs not in the nav array at the tail in alphabetical order', () => {
		// nav: ['a'] with files a, b, c yields [a, b, c]; with files c, b, a yields [a, b, c]
	})

	it('falls back to order: N when no nav array is set', () => {
		// pages with order: 2, order: 1, order: 3 yield [order:1, order:2, order:3]
	})

	it('falls back to alphabetical title when neither nav nor order is set', () => {
		// pages with titles 'Closures', 'Async', 'Modules' yield ['Async', 'Closures', 'Modules']
	})
})

describe('buildTree — variant collapse', () => {
	it('collapses three sibling variant files into one node with meta.variants', () => {
		// Given closures.junior.nl.md, closures.mid.nl.md, closures.senior.nl.md
		// the parent directory contains exactly one child node 'closures'
		// and that node's meta.variants equals ['junior', 'mid', 'senior'] (sorted alphabetically)
	})

	it('uses the page that declares variants: [...] as canonical', () => {
		// Given the three files but only the .junior file declares a variants array,
		// the canonical node carries the .junior frontmatter (title, icon, etc.)
	})

	it('does not collapse pages with mismatched bases', () => {
		// closures.junior.nl.md and functions.junior.nl.md remain two distinct nodes
	})
})

describe('buildTree — icon validation', () => {
	it('throws when a scope-label directory lacks an icon', () => {
		// dir({ path: '/javascript', scope: 'self' }) without icon → throw with message matching /icon/
		// (the /icon/ regex narrows past the scaffold-stub's 'not implemented' throw)
	})

	it('throws when a chapter directory (has child pages) lacks an icon', () => {
		// directory with no scope but with two child pages and no icon → throw matching /icon/
	})

	it('does not throw when a leaf page lacks an icon', () => {
		// leaf pages without icon are allowed; the directory node carries the required icon
	})

	it('includes the offending path in the error message', () => {
		// expect(() => buildTree([...])).toThrow(/\/javascript/) — match by path substring
	})
})

describe('walkScope', () => {
	it('returns the directory whose index.md declares scope: self', () => {
		// route '/syntax/javascript/closures' → /syntax/javascript node when JS index has scope: self
	})

	it('walks past intermediate directories without scope', () => {
		// nested path with scope only on the topmost directory still resolves to that one
	})

	it('falls back to the top-level ancestor when no scope is declared', () => {
		// no scope anywhere → returns the top-level root that contains the route
	})

	it('returns null for a route path not in the lookup', () => {
		// walkScope('/does-not-exist', lookup) === null
	})
})

describe('walkBreadcrumb', () => {
	it('returns root → ... → current for a known path', () => {
		// '/syntax/javascript/closures' → ['/syntax', '/syntax/javascript', '/syntax/javascript/closures']
	})

	it('returns an empty array for an unknown path', () => {
		// walkBreadcrumb('/nope', lookup) → []
	})
})

describe('flattenForPrevNext', () => {
	it('respects the nav-array order across the flattened sequence', () => {
		// JS nav: [b, a] yields b before a in the flat list
	})

	it('emits variant-collapsed nodes exactly once', () => {
		// the collapsed 'closures' appears once, not three times
	})

	it('excludes pure scope-label directories that have no own content', () => {
		// a /modules scope with chapters as children, where /modules itself is just a label, is not in the flat list
	})
})
```

Fill in each `it` body with explicit fixtures and assertions. Use small tree shapes — three to six nodes per test is plenty. Do **not** share mutable state across tests; build fresh fixtures inside each `it` (or inside a `beforeEach` if a fixture is reused twice within one `describe`).

Be careful with the `_id` / `stem` fields when constructing fixtures: variant detection works off the source filename. For tests that exercise variant collapse, set `stem` explicitly to the variant filename (e.g. `'closures.junior.nl.md'`); for plain pages, set `stem` to the simple filename (e.g. `'closures.md'`).

## Code style

- Tabs for indentation, single quotes, no semicolons — `@antfu/eslint-config` is the source of truth
- Explicit imports of `describe`, `it`, `expect` from `vitest` (matches the repo's `globals: false`)
- TypeScript on; use a top-level `import type { … } from '…'` line (the project's ESLint enforces `import/consistent-type-specifier-style`, so inline `type` specifiers fail lint)
- Named imports must be alphabetical (`perfectionist/sort-named-imports`)
- One assertion per `it` where reasonable; multiple assertions are fine when they all describe one behaviour
- Fixture helpers (`page`, `dir`) live at the top of the test file, not in a separate utility module — the SPEC is small enough that one self-contained file is clearer

## Acceptance criteria

- ✅ `pnpm test` runs, discovers `tests/unit/nav.test.ts`, and reports every `it` block as **failing** at the assertion or runtime level (most on the scaffold-stub's `not implemented: <name>` throw; the icon-validation tests fail on regex-mismatch or unexpected-throw against the stub) — that is the intended red state
- ✅ The reported count is `Tests  N failed (N)` where N matches the number of `it` blocks in the file — no test is silently skipped because of an import error
- ✅ `pnpm lint` passes on both new files (`tests/unit/nav.test.ts` and `app/utils/nav.ts`)
- ✅ `git status` shows **only** `tests/unit/nav.test.ts` and `app/utils/nav.ts` as new files — no incidental edits anywhere
- ✅ The test-file count of `it(...)` blocks matches the count of behaviour rules in this prompt; nothing from the contract is silently left untested

## What NOT to do

- ❌ **Do not** implement real logic in `app/utils/nav.ts` — the four function bodies stay as `throw new Error('not implemented: <name>')`. The implementation session owns the real algorithms
- ❌ **Do not** create any composable, plugin, component, or layout — only the scaffold-stub `app/utils/nav.ts`
- ❌ **Do not** modify `content.config.ts`, `app/app.vue`, `app/layouts/docs.vue`, `package.json`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, or any other repo-level file
- ❌ **Do not** install dependencies; the toolchain is already in place
- ❌ **Do not** install `@nuxt/test-utils`, JSDOM, or any browser-environment library — the tests are pure-function and run in `node`
- ❌ **Do not** write Playwright / E2E tests — they belong to Step 2's test prompt
- ❌ **Do not** write snapshot tests; assert on explicit values
- ❌ **Do not** assert on internal implementation details (e.g. the exact shape of the regex used for variant detection); test behaviour only
- ❌ **Do not** mock the file system or Nuxt Content; the tests pass synthetic `ContentPageLike` arrays directly into `buildTree`
- ❌ **Do not** soften the stub's throws into return-sentinels (`null`, `[]`) — explicit throws are what make the assertion failures uniform and obvious

## When you're done

1. Run `pnpm test` and confirm `Tests  N failed (N)` where N matches the number of `it` blocks — every test ran and failed on a real error, not on import resolution
2. Run `pnpm lint` and confirm zero errors on both new files
3. Summarize:
   - The number of `it(...)` blocks per resolver and a one-line note on which behaviour each block covers
   - Any places in the contract that felt ambiguous; for each, what assumption you made, with a pointer to the line in `prompt.md` you would update for clarity if needed
   - Confirmation that `git status` shows only `tests/unit/nav.test.ts` and `app/utils/nav.ts`

4. Stop. **Do not** start the Step 1 implementation. The implementation lands via a separate Claude Code session that consumes `prompt.md` in this same folder; that session overwrites the scaffold-stub function bodies with real logic.
