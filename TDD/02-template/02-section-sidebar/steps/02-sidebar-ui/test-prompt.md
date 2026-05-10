# Claude Code Prompt — Step 2 Tests: Playwright E2E for the scope-bound sidebar

## Project context

This task writes the **tests** for the second implementation step of **template customization 02 — Section sidebar** for the 1000x project. Dutch is the primary language, English secondary. Code style follows `@antfu/eslint-config` via `@nuxt/eslint` — tabs, single quotes, no semicolons, no Prettier.

**Read these documents before starting:**

- `TDD/SPEC.md` — overall product spec; **§ Core Features → 2. Section sidebar** is the conceptual reference for the visible behaviour
- `TDD/02-template/02-section-sidebar/SPEC.md` — this customization in detail. **§ Implementation Steps → Step 2** lists the component contract; **§ Implementation Steps → Step 2 → Tests** is the green-criteria checklist; **§ Constraints** lists what stays out
- `TDD/02-template/02-section-sidebar/steps/02-sidebar-ui/prompt.md` — the implementation prompt for Step 2. The component contract and DOM shape this test prompt asserts on **must match** that document; if there is a discrepancy, the implementation prompt wins and you flag it in your final report
- `AGENTS.md` — established conventions

**Workflow context — test-first:**

You write tests against a UI that **does not exist yet**. Step 2 will replace the docs-template's `<UContentNavigation>` with a `<SectionSidebar>` component that consumes `useNavTree()` from Step 1. Until both Step 1 and Step 2 implementations land, the tests fail — either the dev server crashes during boot (`buildTree` throws on missing icons) or the new selectors don't exist. That red state is intentional. Once both steps ship and the demo content has the required frontmatter (see **Demo content prerequisites** below), every test in this suite must turn green without modification. If a test stays red, the implementation deviates from the contract — fix the implementation, not the test.

**Test infrastructure already exists at the repo root** — Playwright is installed with chromium, `playwright.config.ts` points at `tests/e2e/`, the `pnpm dev` webServer is wired up, and `pnpm test:e2e` runs the suite. You only write the test file.

## Task

Write Playwright E2E tests in `tests/e2e/sidebar.spec.ts` that exercise the scope-bound sidebar against the existing docs-template demo content under `content/`. Cover the visible behaviours from `TDD/02-template/02-section-sidebar/SPEC.md` § Step 2 → Tests. **You write tests only — no production code, no components, no content edits, no schema changes.**

**In scope for this task:**

1. Create `tests/e2e/sidebar.spec.ts` with the test cases listed below
2. Verify the suite is **red** by running `pnpm test:e2e` — every new test should fail until Step 1 and Step 2 implementations land

**Out of scope:**

- Anything inside `app/` (components, layouts, composables, utils) — Step 2's implementation prompt owns it
- Adding or editing demo content frontmatter — that is a separate user task documented under **Demo content prerequisites** below
- Vitest unit tests — Step 1's test prompt covers the pure-function side
- Persistence / keyboard / a11y E2E tests — Step 3's test prompt owns those
- Variant-collapse rendering as an E2E test — the demo content has no variant files; the unit test from Step 1 already covers the data-layer collapse, and a render-level test is deferred until variant content exists

## Demo content prerequisites — what the user prepares before tests can pass

The current demo content uses the docs-template's `.navigation.yml`-driven structure with number-prefixed filenames (`1.getting-started/`, `2.essentials/`, `3.ai/`). For Step 2 tests to actually pass, the user (or a separate Claude Code session) must add the required frontmatter to each top-level directory's `index.md` so `buildTree` doesn't throw at boot. **You do not perform this prep — you only assume it has been done by the time the tests run green.**

Minimum frontmatter the user adds before running this suite green:

- `content/index.md` — already present
- `content/1.getting-started/1.index.md` — needs `icon`, `scope: self`, optional `nav` for ordering
- `content/2.essentials/index.md` — needs to be created with `title`, `icon`, `scope: self`
- `content/3.ai/index.md` — needs to be created with `title`, `icon`, `scope: self`
- All leaf pages keep their existing frontmatter; `icon` is **not** required on leaves

Document this dependency clearly in your final report so the user knows the gating step.

## Prerequisites — what you can assume

- The repo root contains `playwright.config.ts` (testDir `./tests/e2e`, chromium project, webServer auto-starts `pnpm dev` on port 3000)
- `package.json` defines `test:e2e` (= `playwright test`)
- Chromium is downloaded (`~/.cache/ms-playwright/chromium-*`)
- `tests/e2e/` exists (currently with only a `.gitkeep` placeholder)
- The current branch is `01-template`. Step 1 and Step 2 implementations have **not** been merged yet
- Demo content lives at `content/{1.getting-started, 2.essentials, 3.ai}` with the routes `/getting-started`, `/getting-started/installation`, `/getting-started/usage`, `/essentials/markdown-syntax`, `/essentials/code-blocks`, `/essentials/prose-components`, `/essentials/images-embeds`, `/ai/mcp`, `/ai/llms`

Before starting, run:

```bash
pnpm test:e2e --list
```

You should see "no tests" or a small fixed count. Add your file. After Step 1 + Step 2 + content prep all land, the same command should report your tests as discovered and (when run) passing.

## Deliverables

```
tests/
└── e2e/
    └── sidebar.spec.ts        ← NEW: Playwright E2E for the scope-bound sidebar
```

Do **not** create or modify anything outside `tests/e2e/sidebar.spec.ts`. The `git status` after this task should list **only** that one file. No `app/` edits, no `content/` edits, no config changes.

## Component contract — what the tests target

These DOM-level facts must be true once Step 2 ships. The tests assert on them.

- The sidebar mounts inside `app/layouts/docs.vue` as `<SectionSidebar />`. There is **no** `<UContentNavigation>` rendered anywhere in `app/`
- The sidebar root is `<nav>` and is the only `<nav>` rendered inside `<UPageAside>` (the docs-template's left aside slot)
- The first row inside the `<nav>` is the **scope-label** — a non-button element containing an `<UIcon>` (rendered as an `<svg>` or an iconify-class element) plus the scope title text
- Chapters render as `<button type="button">` elements with `aria-expanded="true|false"` (Step 2 sets default `true`; Step 3 will hook up persistence). Each chapter button contains an icon, a title, and a chevron icon (`lucide:chevron-right`) that rotates on expand
- Page leaves render as `<a>` (via `<NuxtLink>`) with `border-l` styling. The active page also carries `aria-current="page"`
- Multiple chapters can be expanded simultaneously — clicking one chapter does **not** collapse its siblings
- Orphan pages (children of the scope without a chapter parent) render in the same indented container as chapter children, with the same per-item border-left active-line treatment

If the demo content has no nested chapters under any top-level directory (which is the current state), chapter-related assertions in this prompt should still **be present in the file** but use `test.fixme()` (Playwright's "not implemented yet" annotation) rather than `test()`. They become real tests once content with nested chapters exists. Note these as `fixme` in your final report.

## File spec — `tests/e2e/sidebar.spec.ts`

Skeleton:

```ts
import { expect, test } from '@playwright/test'

test.describe('section sidebar — scope-bound rendering', () => {
	test('renders a single <nav> in the left aside, with a scope-label as the first row', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const navs = page.locator('aside nav')
		await expect(navs).toHaveCount(1)
		// scope-label is the first child div/row inside <nav> and contains an icon + the scope title
		// adjust the selector to match the implementation; the assertion is "there is exactly one scope-label and it has both an icon and visible text"
	})

	test('the scope-label shows the icon from the directory index.md frontmatter', async ({ page }) => {
		await page.goto('/getting-started/installation')
		// the scope-label row holds an iconify-rendered <svg> or [data-icon] element
		const icon = page.locator('aside nav').locator('svg, [class*=iconify], [data-icon]').first()
		await expect(icon).toBeVisible()
	})

	test('navigating between top-level directories swaps the sidebar contents', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const before = await page.locator('aside nav').textContent()
		await page.goto('/essentials/markdown-syntax')
		const after = await page.locator('aside nav').textContent()
		expect(before).not.toEqual(after)
		// the new scope-label title differs from the old one
	})
})

test.describe('section sidebar — active page indicator', () => {
	test('the active page link has aria-current="page"', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const active = page.locator('aside nav [aria-current="page"]')
		await expect(active).toHaveCount(1)
		await expect(active).toContainText(/installation/i)
	})

	test('only one link is marked as the active page', async ({ page }) => {
		await page.goto('/essentials/markdown-syntax')
		await expect(page.locator('aside nav [aria-current="page"]')).toHaveCount(1)
	})

	test('navigating to another page moves the aria-current marker', async ({ page }) => {
		await page.goto('/getting-started/installation')
		await expect(page.locator('aside nav [aria-current="page"]')).toContainText(/installation/i)
		await page.locator('aside nav a', { hasText: /usage/i }).click()
		await expect(page).toHaveURL(/\/getting-started\/usage$/)
		await expect(page.locator('aside nav [aria-current="page"]')).toContainText(/usage/i)
	})
})

test.describe('section sidebar — orphan pages container', () => {
	test('a scope without nested chapters renders its pages in a single indented container', async ({ page }) => {
		await page.goto('/essentials/markdown-syntax')
		// every page-link in the current scope shares the same parent container element
		const pageLinks = page.locator('aside nav a').filter({ hasText: /^(markdown syntax|code blocks|prose components|images.*embeds)$/i })
		await expect(pageLinks).toHaveCount(4)
		// they all live as siblings under one container; assert via a common ancestor selector that the implementation uses
	})

	test('the active page link has the info-coloured border-left class while siblings do not', async ({ page }) => {
		await page.goto('/getting-started/installation')
		const active = page.locator('aside nav [aria-current="page"]')
		// assert the active link has a class that maps to --ui-primary border, and a sibling does not
		// the exact class strings depend on the implementation; this assertion uses the contract that the active-state
		// classes differ from the inactive-state classes in a way that is observable via getAttribute('class')
		await expect(active).toHaveClass(/border-\(--ui-primary\)|border-primary/)
	})
})

test.describe('section sidebar — chapters (deferred until content has nested chapters)', () => {
	test.fixme('clicking a chapter button toggles its child page-list', async ({ page }) => {
		// no demo content currently has nested chapters; un-fixme this test once content exists
	})

	test.fixme('multiple chapters can be expanded simultaneously', async ({ page }) => {
		// no demo content currently has nested chapters; un-fixme this test once content exists
	})
})

test.describe('auto-sidebar fully replaced', () => {
	test('the page does not render the docs-template UContentNavigation component', async ({ page }) => {
		await page.goto('/')
		// UContentNavigation renders distinct DOM patterns; the simplest invariant is that
		// our <nav> is the only nav rendered inside <aside>, and it has the scope-label structure
		// rather than the template's flat list of all routes
		const navs = page.locator('aside nav')
		await expect(navs).toHaveCount(1)
		// a heuristic: the new sidebar shows only the current scope's children (a small finite count)
		const linkCount = await page.locator('aside nav a').count()
		expect(linkCount).toBeLessThan(15) // arbitrary upper bound — the auto-sidebar would list many more
	})
})
```

Adapt the selectors to match the actual DOM that Step 2's components produce. The implementation prompt specifies the structure (`<nav>` root, `<button>` chapters with `aria-expanded`, `<NuxtLink>` page leaves with `aria-current` and `border-l` classes) — match those.

When in doubt about a selector, prefer `getByRole(...)` / `getByText(...)` / `[aria-current="page"]` over class-based selectors; classes can change, semantic queries cannot. The one exception is the active-state class assertion above — the SPEC explicitly contracts on the `border-(--ui-primary)` token, so a class match is the right tool.

## Code style

- Tabs for indentation, single quotes, no semicolons — `@antfu/eslint-config` is the source of truth
- Explicit imports of `test`, `expect` from `@playwright/test`
- Group tests in `describe` blocks per behaviour theme — matches the file spec above
- Use `test.beforeEach` only when the same setup is repeated three or more times in the same describe; otherwise inline `await page.goto(...)` per test reads more clearly
- Prefer `getByRole`, `getByText`, attribute selectors over CSS class selectors (with the documented exception above)

## Acceptance criteria

- ✅ `pnpm test:e2e --list` discovers the new file and reports the test cases (excluding the `fixme`-marked ones from the run count)
- ✅ Running `pnpm test:e2e` reports every active (non-`fixme`) test as **failing** until Step 1, Step 2, and the demo-content frontmatter prep all land — that is the intended red state
- ✅ `pnpm lint` passes on the new file
- ✅ `git status` shows **only** `tests/e2e/sidebar.spec.ts` as a new file — no incidental edits anywhere
- ✅ Every behaviour rule under "Component contract" maps to at least one assertion in the file
- ✅ Chapter-related tests are present as `test.fixme(...)` with a comment explaining the demo-content gap; they are not silently dropped

## What NOT to do

- ❌ **Do not** create or modify anything in `app/`, `content/`, `i18n/`, `public/`, or any other production directory
- ❌ **Do not** modify `package.json`, `playwright.config.ts`, `vitest.config.ts`, `.gitignore`, or any other repo-level file
- ❌ **Do not** install dependencies; the toolchain is already in place
- ❌ **Do not** install `@axe-core/playwright` here — that's an optional Step 3 consideration, not Step 2's concern
- ❌ **Do not** add Vitest unit tests in this file or anywhere; this prompt covers Playwright E2E only
- ❌ **Do not** write tests against persistence, keyboard navigation, or focus-visible behaviour — those belong to Step 3's test prompt
- ❌ **Do not** assert on internal implementation details (e.g. specific Vue refs, the names of sub-components, internal CSS classes that the SPEC doesn't contract on)
- ❌ **Do not** mock the dev server; Playwright's webServer auto-start in `playwright.config.ts` handles it
- ❌ **Do not** silently drop the chapter-related tests because the current demo content has no chapters; mark them `fixme` with a comment so the gap is visible
- ❌ **Do not** use snapshot testing or visual-regression screenshots; assert on DOM and roles

## When you're done

1. Run `pnpm test:e2e --list` and confirm the new tests are discovered
2. Run `pnpm test:e2e` once with the dev server starting fresh; confirm every active test fails (because Step 1/Step 2 implementations don't exist yet) and the `fixme` tests are reported as such
3. Run `pnpm lint` and confirm zero errors on the new file
4. Summarize:
   - The number of `test(...)` blocks per describe and a one-line note on which behaviour each block covers
   - The number of `test.fixme(...)` blocks and what un-blocks each one (e.g. "demo content needs nested chapters")
   - The demo-content frontmatter changes the user must make before tests can pass green (icon, scope, missing index.md files)
   - Confirmation that `git status` shows only `tests/e2e/sidebar.spec.ts`

5. Stop. **Do not** start the Step 2 implementation. Implementation lands via the separate Claude Code session that consumes `prompt.md` in this same folder.
