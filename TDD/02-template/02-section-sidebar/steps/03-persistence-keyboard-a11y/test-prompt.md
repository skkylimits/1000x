# Claude Code Prompt — Step 3 Tests: Persistence, keyboard nav & a11y

## Project context

This task writes the **tests** for the third (and final) implementation step of **template customization 02 — Sidebar replacement** for the 1000x project. Dutch is the primary language, English secondary. Code style follows `@antfu/eslint-config` via `@nuxt/eslint` — tabs, single quotes, no semicolons, no Prettier.

**Read these documents before starting:**

- `TDD/SPEC.md` — overall product spec; **§ 12. Settings** for the localStorage `ui:{key}` convention; cross-cutting WCAG 2.1 AA requirement
- `TDD/02-template/02-section-sidebar/SPEC.md` — this customization in detail. **§ Implementation Steps → Step 3** lists the contract; **§ Implementation Steps → Step 3 → Tests** is the green-criteria checklist; **§ Constraints** lists what stays out
- `TDD/02-template/02-section-sidebar/steps/03-persistence-keyboard-a11y/prompt.md` — the implementation prompt for Step 3. The contracts this test prompt asserts on **must match** that document; if there is a discrepancy, the implementation prompt wins and you flag it in your final report
- `TDD/03-features/03-settings/SPEC.md` — the future feature that will reuse the `settingsStore` interface introduced in Step 3
- `AGENTS.md` — established conventions

**Workflow context — test-first:**

You write tests against an API and a set of behaviours that **do not exist yet**. Step 3's implementation introduces `app/utils/settingsStore.ts`, `app/composables/useSidebarCollapse.ts`, and modifies the Step 2 components for keyboard handlers and focus-visible. Until that lands, the unit tests fail with "Cannot find module" and the E2E tests fail because the keyboard handlers aren't wired up. That red state is intentional.

**Test infrastructure already exists at the repo root** — Vitest is installed (`tests/unit/`), Playwright is installed with chromium (`tests/e2e/`), and `pnpm test`, `pnpm test:e2e`, `pnpm test:all` are wired up. You only write the test files.

**Sequencing assumption:** Step 1 and Step 2 implementations are merged before this suite is run green. The `useNavTree`, `useCurrentScope`, and the `<SectionSidebar>` / `<SidebarChapter>` / `<SidebarPageList>` components from those earlier steps exist and behave as specified.

## Task

Write three test files that together cover the Step 3 contract:

1. `tests/unit/settingsStore.test.ts` — Vitest unit tests for the storage adapter at `app/utils/settingsStore.ts`
2. `tests/e2e/sidebar-persistence.spec.ts` — Playwright E2E for collapse-state survival across reloads
3. `tests/e2e/sidebar-keyboard.spec.ts` — Playwright E2E for full keyboard navigation, ARIA states, and focus-visible behaviour

**You write tests only — no production code, no composables, no components, no schema changes.**

**In scope for this task:**

- Three test files at the paths above, with the cases listed under each file spec
- Verify the suite is **red** by running `pnpm test` and `pnpm test:e2e` — every new test should fail until Step 3 implementation lands

**Out of scope:**

- Anything inside `app/` — the implementation prompt owns it
- Modifying demo content (Step 2's content prep is a prerequisite already)
- The `useSidebarCollapse()` composable as a unit test in isolation — it depends on Nuxt's `useState` runtime which we do not bring into the unit-test environment. The E2E tests cover the integration end-to-end (collapse → reload → still collapsed)
- An `@axe-core/playwright` smoke test — the implementation prompt marks this as optional; this test prompt does **not** add it. If the user wants it later, that's a one-line addition to the keyboard spec or a new `tests/e2e/sidebar-a11y.spec.ts`

## Prerequisites — what you can assume

- Repo-level test infra is in place (Vitest + Playwright, configs, scripts)
- `tests/unit/` and `tests/e2e/` exist (with `.gitkeep` placeholders)
- The current branch is `01-template`. Step 3 implementation has **not** been merged
- Sequencing: at the time the suite runs green, Step 1, Step 2, and the demo-content frontmatter prep have already landed

Before starting, run:

```bash
pnpm test --list 2>&1 | head -20
pnpm test:e2e --list 2>&1 | head -20
```

to confirm the existing suites' state (Step 1 unit tests may already exist; Step 2 E2E tests may already exist). Add your three files; do not duplicate or rename existing ones.

## Deliverables

```
tests/
├── unit/
│   └── settingsStore.test.ts             ← NEW: Vitest tests for the storage adapter
└── e2e/
    ├── sidebar-persistence.spec.ts        ← NEW: Playwright E2E for collapse-state persistence
    └── sidebar-keyboard.spec.ts           ← NEW: Playwright E2E for keyboard nav, ARIA, focus-visible
```

Do **not** create or modify anything else. The `git status` after this task should list **only** those three new files. No `app/` edits, no `content/` edits, no config changes, no `package.json` changes.

## Public contracts — what the tests target

### `app/utils/settingsStore.ts` (introduced in Step 3)

```ts
export interface SettingsStore {
	get: <T>(key: string, defaultValue: T) => T
	set: <T>(key: string, value: T) => void
	remove: (key: string) => void
}

export function createLocalStorageStore(): SettingsStore
export const settingsStore: SettingsStore
```

Behaviour rules — the unit tests assert these:

- The default localStorage adapter prefixes every key with `ui:` before writing to `window.localStorage`
- `get<T>(key, defaultValue)` returns the parsed JSON value when the key exists; returns `defaultValue` when the key is absent
- `get` returns `defaultValue` and does not throw when the stored value is malformed JSON
- `set<T>(key, value)` stores the value as JSON under the namespaced key
- `set` swallows `QuotaExceededError` and any other write error silently; the user-facing banner for quota issues belongs to feature 10
- `remove(key)` deletes the namespaced key from localStorage; calling it for an absent key is a no-op
- All three methods are no-ops when `window` or `window.localStorage` is unavailable (SSR-safe)

### Sidebar component contract (Step 3 modifications)

- Each chapter button carries `aria-expanded` reflecting its current expanded/collapsed state
- Pressing `ArrowLeft` on a focused chapter button collapses it (sets `aria-expanded="false"`); pressing `ArrowRight` expands it
- Pressing `ArrowDown` on any focusable item moves focus to the next focusable item in document order; `ArrowUp` moves to the previous
- Pressing `Enter` on a focused page-link navigates to that page (native link behaviour; the test verifies the URL change)
- A focusable item gains `data-focus-visible="true"` when focus arrives via keyboard, and does not have that attribute (or has it set to `"false"`) when focus arrives via mouse click
- `collapse-state` persists across page reloads under `localStorage` key `ui:sidebar:collapsed`, JSON-encoded as `{ [chapterPath: string]: boolean }`
- The default state for any chapter is **expanded** when no entry exists
- The sidebar markup contains **no** `role="tree"`, `aria-level`, or `aria-setsize` attributes

If anything is ambiguous, prefer the wording in `prompt.md` over this restatement — the implementation prompt is canonical.

## File specs

### `tests/unit/settingsStore.test.ts`

Pure-function unit tests for the storage adapter. The implementation runs against `window.localStorage`; in node-environment Vitest, `window` does not exist by default. Stub it with a minimal `localStorage`-shaped mock in `beforeEach` so the tests run without JSDOM.

Skeleton:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SettingsStore } from '../../app/utils/settingsStore'

interface FakeStorage {
	[key: string]: string
}

let store: FakeStorage = {}
const originalWindow = (globalThis as Record<string, unknown>).window

beforeEach(() => {
	store = {}
	;(globalThis as Record<string, unknown>).window = {
		localStorage: {
			getItem: (k: string) => (k in store ? store[k] : null),
			setItem: (k: string, v: string) => { store[k] = v },
			removeItem: (k: string) => { delete store[k] },
			clear: () => { store = {} },
			key: (i: number) => Object.keys(store)[i] ?? null,
			get length() { return Object.keys(store).length },
		},
	}
})

afterEach(() => {
	;(globalThis as Record<string, unknown>).window = originalWindow
})

describe('settingsStore — namespacing', () => {
	it('prefixes keys with ui: when writing', async () => {
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		const s = createLocalStorageStore()
		s.set('foo', { bar: 1 })
		expect(store['ui:foo']).toBe(JSON.stringify({ bar: 1 }))
	})

	it('reads from the namespaced key', async () => {
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		store['ui:foo'] = JSON.stringify(42)
		const s = createLocalStorageStore()
		expect(s.get('foo', 0)).toBe(42)
	})
})

describe('settingsStore — defaults and resilience', () => {
	it('returns defaultValue when the key is absent', async () => {
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		const s = createLocalStorageStore()
		expect(s.get('missing', 'fallback')).toBe('fallback')
	})

	it('returns defaultValue when the stored value is not valid JSON', async () => {
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		store['ui:broken'] = '{not json'
		const s = createLocalStorageStore()
		expect(s.get('broken', 'fallback')).toBe('fallback')
	})

	it('swallows QuotaExceededError on set without throwing', async () => {
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		// replace setItem to throw
		const win = (globalThis as Record<string, unknown>).window as { localStorage: Storage }
		const original = win.localStorage.setItem
		win.localStorage.setItem = () => { throw new Error('QuotaExceededError') }
		const s = createLocalStorageStore()
		expect(() => s.set('x', 1)).not.toThrow()
		win.localStorage.setItem = original
	})
})

describe('settingsStore — remove', () => {
	it('deletes the namespaced key', async () => {
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		store['ui:foo'] = '"x"'
		const s = createLocalStorageStore()
		s.remove('foo')
		expect('ui:foo' in store).toBe(false)
	})

	it('is a no-op when the key is absent', async () => {
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		const s = createLocalStorageStore()
		expect(() => s.remove('missing')).not.toThrow()
	})
})

describe('settingsStore — SSR safety', () => {
	it('returns defaultValue when window is undefined', async () => {
		;(globalThis as Record<string, unknown>).window = undefined
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		const s = createLocalStorageStore()
		expect(s.get('x', 'default')).toBe('default')
	})

	it('does not throw on set when window is undefined', async () => {
		;(globalThis as Record<string, unknown>).window = undefined
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		const s = createLocalStorageStore()
		expect(() => s.set('x', 1)).not.toThrow()
	})

	it('does not throw on remove when window is undefined', async () => {
		;(globalThis as Record<string, unknown>).window = undefined
		const { createLocalStorageStore } = await import('../../app/utils/settingsStore')
		const s = createLocalStorageStore()
		expect(() => s.remove('x')).not.toThrow()
	})
})
```

Use dynamic `await import(...)` inside each `it` (or once per describe via `beforeAll`) so the module is freshly evaluated per test run with the right `globalThis.window` stub in place. If you find a single top-level `import` works because the production code reads `window` lazily inside each method, prefer that — but verify by checking the `prompt.md` implementation hint, which reads `window.localStorage` lazily on every call. Top-level import should be fine.

### `tests/e2e/sidebar-persistence.spec.ts`

```ts
import { expect, test } from '@playwright/test'

test.describe('sidebar collapse persistence', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
		await page.evaluate(() => window.localStorage.clear())
		await page.reload()
	})

	test('collapsing a chapter survives a reload', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const chapter = page.locator('aside nav button[aria-expanded]').first()
		// expanded by default — collapse it
		await chapter.click()
		await expect(chapter).toHaveAttribute('aria-expanded', 'false')

		await page.reload()
		const sameChapter = page.locator('aside nav button[aria-expanded]').first()
		await expect(sameChapter).toHaveAttribute('aria-expanded', 'false')
	})

	test('writes the collapsed state under localStorage key ui:sidebar:collapsed', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const chapter = page.locator('aside nav button[aria-expanded]').first()
		await chapter.click()

		const stored = await page.evaluate(() => window.localStorage.getItem('ui:sidebar:collapsed'))
		expect(stored).not.toBeNull()
		const parsed = JSON.parse(stored!)
		expect(typeof parsed).toBe('object')
		expect(Object.values(parsed).some(v => v === false)).toBe(true)
	})

	test('the default state is expanded for any chapter without a stored entry', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const chapter = page.locator('aside nav button[aria-expanded]').first()
		await expect(chapter).toHaveAttribute('aria-expanded', 'true')
	})

	test.fixme('multiple chapters can be in independent collapse-states across reload', async () => {
		// requires content with at least two chapters in the same scope; defer until content has nested chapters
	})
})
```

### `tests/e2e/sidebar-keyboard.spec.ts`

```ts
import { expect, test } from '@playwright/test'

test.describe('sidebar keyboard navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/getting-started/installation')
	})

	test('Tab brings focus into the sidebar nav within a small bounded number of presses', async ({ page }) => {
		// press Tab repeatedly until document.activeElement is inside <aside nav>; bound it to a sane upper limit
		const maxPresses = 30
		let inside = false
		for (let i = 0; i < maxPresses; i++) {
			await page.keyboard.press('Tab')
			inside = await page.evaluate(() => {
				const el = document.activeElement
				if (!el)
					return false
				return !!el.closest('aside nav')
			})
			if (inside)
				break
		}
		expect(inside).toBe(true)
	})

	test('ArrowDown moves focus to the next focusable item in the sidebar', async ({ page }) => {
		await page.locator('aside nav [aria-current="page"]').focus()
		const before = await page.evaluate(() => document.activeElement?.textContent?.trim())
		await page.keyboard.press('ArrowDown')
		const after = await page.evaluate(() => document.activeElement?.textContent?.trim())
		expect(after).not.toEqual(before)
		expect(await page.evaluate(() => document.activeElement?.closest('aside nav') !== null)).toBe(true)
	})

	test('ArrowUp moves focus to the previous focusable item in the sidebar', async ({ page }) => {
		await page.locator('aside nav [aria-current="page"]').focus()
		const before = await page.evaluate(() => document.activeElement?.textContent?.trim())
		await page.keyboard.press('ArrowUp')
		const after = await page.evaluate(() => document.activeElement?.textContent?.trim())
		expect(after).not.toEqual(before)
	})

	test('Enter on a focused page-link navigates to that page', async ({ page }) => {
		const link = page.locator('aside nav a', { hasText: /usage/i }).first()
		await link.focus()
		await page.keyboard.press('Enter')
		await expect(page).toHaveURL(/usage/)
	})

	test.fixme('ArrowLeft on a focused chapter button collapses it; ArrowRight expands it', async () => {
		// requires content with at least one chapter (nested directory); defer until nested chapters exist in demo content
	})
})

test.describe('sidebar focus-visible behaviour', () => {
	test('a link gains data-focus-visible="true" when focus arrives via keyboard', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const link = page.locator('aside nav a', { hasText: /installation/i }).first()
		await link.focus()
		await expect(link).toHaveAttribute('data-focus-visible', 'true')
	})

	test('a link does not have data-focus-visible="true" after a mouse click focuses it', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const link = page.locator('aside nav a', { hasText: /usage/i }).first()
		// click navigates; come back and verify focus arrived from a click
		await link.click()
		await expect(page).toHaveURL(/usage/)
		const usageLink = page.locator('aside nav [aria-current="page"]')
		const attr = await usageLink.getAttribute('data-focus-visible')
		expect(attr === null || attr === 'false').toBe(true)
	})
})

test.describe('sidebar a11y — bounded ARIA surface', () => {
	test('the sidebar markup contains no role="tree", aria-level, or aria-setsize', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('aside nav [role="tree"]')).toHaveCount(0)
		await expect(page.locator('aside nav [aria-level]')).toHaveCount(0)
		await expect(page.locator('aside nav [aria-setsize]')).toHaveCount(0)
	})

	test('every chapter button has aria-expanded reflecting its state', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const buttons = page.locator('aside nav button')
		const count = await buttons.count()
		for (let i = 0; i < count; i++) {
			const attr = await buttons.nth(i).getAttribute('aria-expanded')
			expect(['true', 'false']).toContain(attr)
		}
	})

	test('every page link has an accessible name', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const links = page.locator('aside nav a')
		const count = await links.count()
		for (let i = 0; i < count; i++) {
			const text = (await links.nth(i).textContent())?.trim()
			expect(text && text.length > 0).toBeTruthy()
		}
	})
})
```

Adapt the selectors to match the actual DOM that Step 3 produces, but stay close to semantic queries (role / attribute) where possible. The `data-focus-visible` attribute is contracted on by the SPEC — assert on it directly.

## Code style

- Tabs for indentation, single quotes, no semicolons — `@antfu/eslint-config` is the source of truth
- Explicit imports of `describe`, `it`, `expect`, `test`, `beforeEach`, `afterEach` from their respective packages (Vitest globals are off, Playwright never sets globals)
- TypeScript on; types imported via the Vue-style `import { … type Foo } from '…'` syntax
- One assertion per `it` / `test` where reasonable; multiple assertions are fine when they all describe one behaviour
- Use `test.fixme(...)` (not `test.skip`) for tests deferred on demo-content gaps; `fixme` shows up as "expected to fail" rather than silent skip

## Acceptance criteria

- ✅ `pnpm test` discovers `tests/unit/settingsStore.test.ts` and reports every test in that file as **failing** with "Cannot find module" against `../../app/utils/settingsStore` — that is the intended red state
- ✅ `pnpm test:e2e --list` discovers both new spec files; running `pnpm test:e2e` reports every active (non-`fixme`) test as failing until Step 3 implementation lands
- ✅ `pnpm lint` passes on all three new files
- ✅ `git status` shows **only** the three new files — no incidental edits anywhere
- ✅ Every behaviour rule under "Public contracts" maps to at least one assertion across the three files
- ✅ `test.fixme(...)` markers are present (not silently dropped) for chapter-related tests that depend on nested-chapter content

## What NOT to do

- ❌ **Do not** create or modify anything in `app/`, `content/`, `i18n/`, `public/`, or any other production directory
- ❌ **Do not** modify `package.json`, `playwright.config.ts`, `vitest.config.ts`, `.gitignore`, or any other repo-level file
- ❌ **Do not** install dependencies; do **not** install JSDOM — the unit tests stub `window.localStorage` directly
- ❌ **Do not** install `@axe-core/playwright`; this prompt deliberately omits it. The user can add it later as a separate spec
- ❌ **Do not** write Vitest tests for `useSidebarCollapse()`; the E2E persistence suite covers the integration
- ❌ **Do not** mock the `settingsStore` module in the E2E suite — write through the real path so the round-trip is verified
- ❌ **Do not** assert on internal implementation details (private composable refs, exact CSS classes that are not contracted)
- ❌ **Do not** silently drop chapter-related tests because demo content has no nested chapters; mark them `fixme` with a comment so the gap is visible
- ❌ **Do not** use snapshot testing or visual-regression screenshots; assert on DOM, attributes, and roles

## When you're done

1. Run `pnpm test` and confirm `settingsStore.test.ts` fails with "Cannot find module"; running `pnpm test:e2e` fails on the active tests with selector-not-found or attribute-mismatch errors. The suite is correctly red
2. Run `pnpm lint` and confirm zero errors on the three new files
3. Summarize:
   - The number of `it(...)` blocks in the unit file and the behaviour each covers
   - The number of `test(...)` and `test.fixme(...)` blocks in each E2E file and the behaviour each covers
   - Any places in the contract that felt ambiguous; what assumption you made; pointer to `prompt.md` line you would update for clarity
   - Confirmation that `git status` shows only the three new files

4. Stop. **Do not** start the Step 3 implementation. Implementation lands via the separate Claude Code session that consumes `prompt.md` in this same folder.
