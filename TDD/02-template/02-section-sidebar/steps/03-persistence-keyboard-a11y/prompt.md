# Claude Code Prompt — Step 3: Persistence, keyboard nav & WCAG 2.1 AA

## Project context

This task closes out **template customization 02 — Section sidebar** for the 1000x project: an internal "second brain" and interactive learning system, built on the [Nuxt UI docs-template](https://github.com/nuxt-ui-templates/docs) baseline. Dutch is primary, English secondary. Code style follows `@antfu/eslint-config` via `@nuxt/eslint` — tabs, single quotes, no semicolons, no Prettier.

**Read these documents before starting:**

- `TDD/SPEC.md` — overall product spec, especially **§ 12. Settings** for the localStorage `ui:{key}` convention, and the cross-cutting WCAG 2.1 AA requirement
- `TDD/02-template/02-section-sidebar/SPEC.md` — this customization in detail. Read **§ Implementation Steps → Step 3** for this task's scope and **§ Constraints** for what stays out
- `TDD/03-features/03-settings/SPEC.md` — the future feature that will reuse the `settingsStore` interface introduced here. The interface must be designed so feature 03 in 03-features can adopt it without rewriting Step 3's code
- `AGENTS.md` — conventions, including the `ui:{key}` localStorage scheme and the no-VueUse rule for this customization

**Steps 1 and 2 are complete.** The data layer ships:

- `app/utils/nav.ts` — `buildTree`, `walkScope`, `walkBreadcrumb`, `flattenForPrevNext`, `NavNode`, `NavTree`
- `app/composables/useNavTree.ts`, `useCurrentScope.ts`, `useBreadcrumb.ts`, `usePrevNext.ts`

The UI layer ships:

- `app/components/layout/SectionSidebar.vue` — top-level, consumes `useNavTree()` + `useCurrentScope()`
- `app/components/layout/SidebarChapter.vue` — chapter button + collapsible page-list (currently uses a local `ref<boolean>` initialised to `true`)
- `app/components/layout/SidebarPageList.vue` — pages with per-item `border-left` active-line and `aria-current="page"`
- `app/layouts/docs.vue` — mounts `<SectionSidebar />`, `<UContentNavigation>` is gone

This step makes the sidebar production-ready: collapse-state survives reloads, keyboard navigation works end-to-end, and the component is WCAG 2.1 AA compliant.

## Task

Three interlocking pieces:

1. **Persistence layer.** Introduce a generic `settingsStore` interface backed by localStorage under the `ui:{key}` namespace per `TDD/SPEC.md`. Wire `SidebarChapter`'s expand/collapse state through it via a new composable. Feature 12 (Settings) will reuse the same interface untouched
2. **Keyboard navigation.** Roving tabindex inside `<SectionSidebar>` so the entire sidebar is one focus group. ↑/↓ moves between focusable items in visual order, ←/→ collapses or expands a chapter from its button, `Enter` activates the focused link. Focus-visible styling via a `data-focus-visible` attribute, not the default `:focus`
3. **WCAG 2.1 AA polish.** Accessible names on all interactive elements, no ARIA-overload, no `role="tree"` / `aria-level` / `aria-setsize`. Conformance-check via Playwright + (optionally) `@axe-core/playwright`

**In scope for this step:**

1. `app/utils/settingsStore.ts` — generic key-value interface, default localStorage adapter, SSR-safe
2. `app/composables/useSidebarCollapse.ts` — reactive collapse-state per chapter path; reads/writes through `settingsStore`
3. Modifications to `SidebarChapter.vue` so the `expanded` ref is sourced from `useSidebarCollapse(chapter.path)` instead of a fresh local `ref(true)`
4. Modifications to `SectionSidebar.vue` (and sub-components) for roving tabindex and keyboard handlers
5. Focus-visible styling driven by a data-attribute (`data-focus-visible="true"`) so the ring appears only after keyboard focus, not after a click
6. Accessible names: every interactive element has a clear text label or `aria-label`; chapter buttons announce expanded state via `aria-expanded`
7. Playwright E2E coverage: persistence over reload, full keyboard flow, focus-visible behaviour
8. Optional: an `@axe-core/playwright` smoke test confirming zero serious WCAG violations on a representative page

**Out of scope for this step (assigned to other features — do not anticipate):**

- Drag-and-drop reordering — feature 02 in 03-features
- Inline rename / context menu actions — features 10 and 11
- Migration of the `settingsStore` adapter from localStorage to IndexedDB — phase-2 of feature 01 in 03-features/11/12
- Migration of UI-state from localStorage to a user profile — phase 3, IAM-dependent
- Anything in `§ Constraints` of the customization SPEC

## Prerequisites — what you can assume

- The current branch has Steps 1 and 2 merged; the components from Step 2 exist and behave per the Step 2 acceptance criteria
- The demo content under `content/` renders correctly through the new sidebar; `buildTree` does not throw at boot
- Nuxt 4's `useState` is the recommended primitive for SSR-safe client state. Combined with `onMounted` for localStorage hydration, no extra dep is needed
- Nuxt UI v4's interactive components already provide most a11y primitives (focus rings, keyboard activation on `<button>`/`<a>`). You are extending, not reimplementing
- localStorage is browser-only. Code that touches it must guard with `import.meta.client` or run inside `onMounted`

Before starting, run from the project root:

```bash
pnpm dev
```

Tab through the sidebar with the keyboard. Note that today every chapter button is a separate tab-stop and arrow keys do nothing — this is what Step 3 fixes.

## Deliverables

```
app/
├── utils/
│   └── settingsStore.ts                         ← NEW: generic localStorage-backed key-value store with stable interface for feature 03 in 03-features
├── composables/
│   └── useSidebarCollapse.ts                    ← NEW: reactive collapse state per chapter path, hydrates from settingsStore
└── components/
    └── layout/
        ├── SectionSidebar.vue                   ← MODIFIED: roving tabindex root, keyboard handlers, focus-visible state
        ├── SidebarChapter.vue                   ← MODIFIED: expanded ref sourced from useSidebarCollapse, aria-expanded, ←/→ handlers
        └── SidebarPageList.vue                  ← MODIFIED: tabindex management, ↑/↓ handlers, focus-visible class

tests/
└── e2e/
    ├── sidebar-persistence.spec.ts              ← NEW: collapse-state survives reload
    └── sidebar-keyboard.spec.ts                 ← NEW: arrow keys, Enter, ←/→, focus-visible
```

Do **not** add new dependencies for the persistence or keyboard work. `@axe-core/playwright` is optional and may be added if you choose to include the a11y smoke test.

## File specs

### `app/utils/settingsStore.ts`

A small, intentionally generic interface so feature 03 in 03-features (Settings) can adopt it. Default adapter writes to `localStorage` under the `ui:` prefix. SSR-safe — reads return the provided default if `localStorage` is unavailable; writes silently no-op on the server.

```ts
export interface SettingsStore {
	get: <T>(key: string, defaultValue: T) => T
	set: <T>(key: string, value: T) => void
	remove: (key: string) => void
}

const NAMESPACE = 'ui:'

function isClient() {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function createLocalStorageStore(): SettingsStore {
	return {
		get<T>(key: string, defaultValue: T): T {
			if (!isClient())
				return defaultValue
			try {
				const raw = window.localStorage.getItem(`${NAMESPACE}${key}`)
				if (raw === null)
					return defaultValue
				return JSON.parse(raw) as T
			}
			catch {
				return defaultValue
			}
		},
		set<T>(key: string, value: T) {
			if (!isClient())
				return
			try {
				window.localStorage.setItem(`${NAMESPACE}${key}`, JSON.stringify(value))
			}
			catch {
				// QuotaExceededError or storage disabled — silently swallow.
				// A user-facing banner for quota issues is feature 01 in 03-features's job.
			}
		},
		remove(key: string) {
			if (!isClient())
				return
			try {
				window.localStorage.removeItem(`${NAMESPACE}${key}`)
			}
			catch { /* */ }
		},
	}
}

/** Module-level singleton; consumers do not pick adapters. */
export const settingsStore: SettingsStore = createLocalStorageStore()
```

Notes:

- The `SettingsStore` interface is the contract feature 03 in 03-features will reuse. Keep it minimal — just `get` / `set` / `remove`. No batch operations, no schema validation, no events. Add those only when feature 03 in 03-features has a concrete need
- The `ui:` namespace matches `TDD/SPEC.md` § Settings. Do not change it
- The adapter is `localStorage` only in this step. The IndexedDB migration is phase 2 and lives behind the same interface

### `app/composables/useSidebarCollapse.ts`

Reactive collapse state, one entry per chapter path. Hydrates lazily on first read after mount; SSR returns the default (expanded) so first paint is consistent.

```ts
import { settingsStore } from '~/utils/settingsStore'

const KEY = 'sidebar:collapsed'

interface CollapseMap {
	[chapterPath: string]: boolean
}

function readMap(): CollapseMap {
	return settingsStore.get<CollapseMap>(KEY, {})
}

function writeMap(map: CollapseMap) {
	settingsStore.set(KEY, map)
}

/**
 * Returns a Ref<boolean> that represents whether `chapterPath` is expanded.
 * Default is `true` (expanded) when no entry exists.
 * Writes through to localStorage on change.
 */
export function useSidebarCollapse(chapterPath: string) {
	const state = useState<CollapseMap>('sidebar:collapse', () => ({}))

	if (import.meta.client && Object.keys(state.value).length === 0)
		state.value = readMap()

	const expanded = computed<boolean>({
		get: () => {
			const v = state.value[chapterPath]
			return v === undefined ? true : v
		},
		set: (next) => {
			state.value = { ...state.value, [chapterPath]: next }
			writeMap(state.value)
		},
	})

	return expanded
}
```

Notes:

- `useState` keeps the map shared across all `<SidebarChapter>` instances during the page lifetime — flipping one chapter does not re-read localStorage
- Hydration runs once on first client read; SSR renders all chapters expanded (the default)
- Writes are synchronous through `settingsStore` — fine for this scale (few chapters, cheap stringify)
- The default-expanded behaviour matches the current Step 2 state; no surprise on first visit

### `app/components/layout/SidebarChapter.vue` — modify

Replace the local `ref(true)` with `useSidebarCollapse(props.chapter.path)`. Add `aria-expanded` to the chapter button so screen readers announce the collapsed state. Add a keyboard handler for ←/→: `ArrowLeft` collapses, `ArrowRight` expands.

Skeleton diff (illustrative):

```vue
<script setup lang="ts">
import type { NavNode } from '~/utils/nav'

const props = defineProps<{ chapter: NavNode }>()

const expanded = useSidebarCollapse(props.chapter.path)

function onKey(e: KeyboardEvent) {
	if (e.key === 'ArrowRight' && !expanded.value) {
		e.preventDefault()
		expanded.value = true
	}
	else if (e.key === 'ArrowLeft' && expanded.value) {
		e.preventDefault()
		expanded.value = false
	}
}
</script>

<template>
	<div class="flex flex-col">
		<button
			type="button"
			:aria-expanded="expanded"
			class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-(--ui-text) transition-colors hover:bg-(--ui-bg-elevated) data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-(--ui-primary)"
			@click="expanded = !expanded"
			@keydown="onKey"
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
			v-if="expanded && chapter.children.length"
			:pages="chapter.children"
			class="ml-4 mt-0.5"
		/>
	</div>
</template>
```

Notes:

- ↑/↓ between items is handled at the parent `<SectionSidebar>` level via roving tabindex; chapters do not own that movement
- `aria-expanded` reflects the boolean state and updates on every toggle
- `data-[focus-visible=true]:ring-…` is the focus-visible ring; a small directive or wrapper at the `<SectionSidebar>` level sets/unsets the data-attribute based on whether focus arrived via keyboard

### `app/components/layout/SectionSidebar.vue` — modify

Make the `<nav>` the focus-group root. Track which item is focused, manage `tabindex="0"` on the focused one and `tabindex="-1"` on the rest, handle ↑/↓ to move focus through the visible-and-focusable items in document order. Track whether the most recent focus event came from keyboard or mouse so the focus-visible ring shows only on keyboard focus.

Implementation sketch:

```ts
// inside <script setup>
const focusableSelector = '[data-nav-focusable="true"]'
const navRef = ref<HTMLElement | null>(null)

function focusables(): HTMLElement[] {
	if (!navRef.value)
		return []
	return Array.from(navRef.value.querySelectorAll<HTMLElement>(focusableSelector))
		.filter(el => el.offsetParent !== null) // skip hidden
}

function moveFocus(delta: 1 | -1) {
	const items = focusables()
	const i = items.findIndex(el => el === document.activeElement)
	if (i < 0)
		return
	const next = items[(i + delta + items.length) % items.length]
	next?.focus()
}

function onNavKey(e: KeyboardEvent) {
	if (e.key === 'ArrowDown') {
		e.preventDefault()
		moveFocus(1)
	}
	else if (e.key === 'ArrowUp') {
		e.preventDefault()
		moveFocus(-1)
	}
}

let lastInputWasKeyboard = false
function onKeydownGlobal() { lastInputWasKeyboard = true }
function onPointerdownGlobal() { lastInputWasKeyboard = false }

function onFocusIn(e: FocusEvent) {
	const el = e.target as HTMLElement | null
	if (el?.matches(focusableSelector))
		el.dataset.focusVisible = lastInputWasKeyboard ? 'true' : 'false'
}

function onFocusOut(e: FocusEvent) {
	const el = e.target as HTMLElement | null
	if (el?.matches(focusableSelector))
		delete el.dataset.focusVisible
}

onMounted(() => {
	window.addEventListener('keydown', onKeydownGlobal, true)
	window.addEventListener('pointerdown', onPointerdownGlobal, true)
})
onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydownGlobal, true)
	window.removeEventListener('pointerdown', onPointerdownGlobal, true)
})
```

Then in the template, attach `ref="navRef"`, `@keydown="onNavKey"`, `@focusin="onFocusIn"`, `@focusout="onFocusOut"`. Each focusable element (chapter button, page link) should carry `data-nav-focusable="true"` and be `tabindex="-1"` by default; only one element at a time gets `tabindex="0"` (managed via a small ref or a derived computed based on the currently-focused path).

A simpler alternative — and acceptable here — is to give every focusable item `tabindex="0"` initially and skip the roving-tabindex management. The arrow keys still work via the `@keydown` handler at `<SectionSidebar>` level. If you choose this, document the trade-off in your final report (extra tab-stops vs simpler implementation).

### `app/components/layout/SidebarPageList.vue` — modify

Add `data-nav-focusable="true"` and the focus-visible Tailwind classes to each `<NuxtLink>`:

```vue
<NuxtLink
	v-for="page in pages"
	:key="page.path"
	:to="page.path"
	:aria-current="route.path === page.path ? 'page' : undefined"
	data-nav-focusable="true"
	class="flex w-full items-center border-l py-1.5 pl-4 pr-2 text-left transition-colors data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-(--ui-primary)"
	:class="route.path === page.path
		? 'border-(--ui-primary) text-(--ui-primary) font-medium'
		: 'border-(--ui-border) text-(--ui-text-muted) hover:text-(--ui-text-highlighted)'"
>
	{{ page.title }}
</NuxtLink>
```

`Enter` activates `<NuxtLink>` natively — no extra handler required.

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
		const chapter = page.getByRole('button').filter({ hasText: /essentials/i }).first()
		// expanded by default — collapse it
		await chapter.click()
		await expect(chapter).toHaveAttribute('aria-expanded', 'false')

		await page.reload()
		const sameChapter = page.getByRole('button').filter({ hasText: /essentials/i }).first()
		await expect(sameChapter).toHaveAttribute('aria-expanded', 'false')
	})

	test('multiple chapters can be collapsed independently', async ({ page }) => {
		await page.goto('/')
		// adapt to actual demo content; assert two chapters can be in different states
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

	test('Tab brings focus into the sidebar nav', async ({ page }) => {
		await page.keyboard.press('Tab')
		// keep tabbing until focus lands inside <nav>; assert we get there in a small bounded number of presses
	})

	test('ArrowDown moves focus to the next focusable item', async ({ page }) => {
		// focus the active page-link via Tab presses or page.focus('[aria-current="page"]')
		await page.locator('[aria-current="page"]').focus()
		const before = await page.evaluate(() => document.activeElement?.textContent)
		await page.keyboard.press('ArrowDown')
		const after = await page.evaluate(() => document.activeElement?.textContent)
		expect(after).not.toEqual(before)
	})

	test('ArrowRight on a collapsed chapter expands it; ArrowLeft on expanded collapses', async ({ page }) => {
		const chapter = page.getByRole('button').filter({ hasText: /essentials/i }).first()
		await chapter.focus()
		// start expanded → ArrowLeft collapses
		await page.keyboard.press('ArrowLeft')
		await expect(chapter).toHaveAttribute('aria-expanded', 'false')
		// ArrowRight expands again
		await page.keyboard.press('ArrowRight')
		await expect(chapter).toHaveAttribute('aria-expanded', 'true')
	})

	test('Enter on a focused page-link navigates to that page', async ({ page }) => {
		const link = page.getByRole('link', { name: /usage/i }).first()
		await link.focus()
		await page.keyboard.press('Enter')
		await expect(page).toHaveURL(/usage/)
	})

	test('focus-visible ring appears on keyboard focus and disappears on click', async ({ page }) => {
		const link = page.getByRole('link', { name: /installation/i }).first()
		await link.focus()
		await expect(link).toHaveAttribute('data-focus-visible', 'true')

		await page.locator('body').click({ position: { x: 10, y: 10 } })
		await link.focus()
		await link.click()
		await expect(link).not.toHaveAttribute('data-focus-visible', 'true')
	})
})
```

Adapt the selectors to the demo content's actual chapter/page titles as you implement.

### Optional — `@axe-core/playwright` smoke test

If time permits, add `@axe-core/playwright` and run it over a couple of representative pages, asserting zero `serious` or `critical` violations. This is optional; if you skip it, document the choice in your final report.

## Code style

- Tabs for indentation, single quotes, no semicolons — `@antfu/eslint-config` is the source of truth
- TypeScript on; explicit return types on every public export of `app/utils/settingsStore.ts`
- Composables follow the auto-import convention — no manual `import` of `useNavTree`, `useSidebarCollapse`, etc. inside Vue files
- No `any`. Prefer `unknown` plus narrowing where types are dynamic
- Tailwind v4 token classes (`--ui-primary`, `--ui-border`, `--ui-text-muted`) for colours; no hex literals

## Acceptance criteria

- ✅ `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit), and `pnpm test:e2e` all pass
- ✅ `pnpm dev` starts on `http://localhost:3000` without errors
- ✅ Collapse a chapter, reload — that chapter is still collapsed
- ✅ Two chapters can be in different collapse-states; both states persist independently after reload
- ✅ Tabbing into the sidebar reaches the focusable items; arrow ↑/↓ moves between them in visual order
- ✅ Arrow ←/→ on a chapter button collapses/expands and updates `aria-expanded`
- ✅ `Enter` on a focused page-link navigates
- ✅ The focus-visible ring (`data-focus-visible="true"`) appears only on keyboard focus, not on mouse-click focus
- ✅ Every interactive element has an accessible name; `aria-current="page"` on the active link is preserved from Step 2
- ✅ No `role="tree"`, `aria-level`, or `aria-setsize` anywhere in the sidebar markup
- ✅ `localStorage` keys for the sidebar are namespaced under `ui:sidebar:…`; nothing escapes the namespace
- ✅ `git status` shows only the new files plus the modified Step 2 components — no incidental edits
- ✅ No new dependencies in `package.json` (or only `@axe-core/playwright` if you opted into the optional a11y smoke test)

## What NOT to do

- ❌ **Do not** import `vueuse`, `@vueuse/core`, or any other state/storage helper. `useState` plus `settingsStore` is the whole stack
- ❌ **Do not** write directly to `localStorage` from the composable or component — go through `settingsStore` so feature 03 in 03-features can swap the adapter later
- ❌ **Do not** add Pinia or any other state-manager. The write-side store comes in feature 02 in 03-features; sidebar collapse is a user preference, not a content mutation
- ❌ **Do not** change the `ui:` namespace prefix — `TDD/SPEC.md` § Settings fixes it
- ❌ **Do not** add accordion-mode behaviour
- ❌ **Do not** add `role="tree"`, `aria-level`, `aria-setsize`, `aria-owns`, or any other tree-specific ARIA. The sidebar is a `<nav>` with buttons and links — that markup is already accessible
- ❌ **Do not** add tooltips on icons or chapter rows
- ❌ **Do not** add a separate "settings panel" UI here; this step only ships the storage interface that feature 03 in 03-features will reuse
- ❌ **Do not** auto-collapse all chapters on first visit — the default is expanded
- ❌ **Do not** use intersection observers to auto-scroll to the active item. If scroll-to-active is needed, use a single `scrollIntoView({ block: 'nearest' })` call on mount
- ❌ **Do not** edit `app/utils/nav.ts` or any composable from Step 1
- ❌ **Do not** edit `app/app.vue` or remove the `provide('navigation', ...)` it does — that still feeds `<UContentSearch>`
- ❌ **Do not** anticipate the IndexedDB migration. The adapter swap is phase-2 work and out of scope

## When you're done

1. Run through every acceptance criterion. If something doesn't pass, fix it before reporting back
2. Summarize:
   - Which files you created or modified (under **Deliverables**)
   - Whether you implemented full roving tabindex (single tab-stop with arrow movement) or kept every item as a tab-stop (simpler) — with the reasoning
   - Whether you included the optional `@axe-core/playwright` smoke test
   - Any deviations from this prompt with reasoning
   - Confirmation that no new dependencies (besides optional axe) landed in `package.json`

3. Stop. Customization 02 (Section sidebar) is complete. The next customization or feature is the user's call.
