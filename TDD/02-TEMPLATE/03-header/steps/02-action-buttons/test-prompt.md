# Step 2 — Right-zone action buttons (test-prompt)

## Context

The header's right region renders exactly 5 icon-only action buttons in a fixed order: search, AI assistant, language, color-mode, settings. AI and Settings are disabled stubs with "Binnenkort" tooltips. All buttons keyboard-reachable with `aria-label` set. `⌘K` continues to open the search palette.

Read `TDD/02-TEMPLATE/03-header/SPEC.md` requirements 23, 24, 30.

## Framework

Playwright e2e. Config: `playwright.config.ts` (baseURL `http://localhost:3000`, Chromium, dev server auto-spawned).

## Test file

`tests/e2e/header-actions.spec.ts`. Mirror style of `tests/e2e/sidebar.spec.ts`.

## Public contract under test

- Header element renders 5 buttons in its right region.
- Each button is icon-only: no visible text node, but a non-empty `aria-label`.
- AI and Settings have `disabled` attribute and a Nuxt UI tooltip surfacing "Binnenkort" on hover.
- The search button opens the existing search palette on `Meta+K` / `Control+K`.

## Test cases

- **Button count**: `page.locator('header').first()` right region contains 5 buttons.
- **Button order**: DOM order matches `[search, ai, locale, color-mode, settings]`. Match by `aria-label` patterns: `/search/i`, `/ai/i`, `/taal|language/i`, `/theme|color/i`, `/settings|instellingen/i`.
- **Icon-only**: each button's visible text content is empty (or sr-only); `aria-label` is non-empty.
- **AI disabled**: AI button has `disabled` attribute set.
- **Settings disabled**: Settings button has `disabled` attribute set.
- **AI tooltip**: hover AI for ≥500ms → tooltip element appears with text matching `/binnenkort/i`.
- **Settings tooltip**: same for Settings.
- **⌘K opens palette**: from `/`, press `Meta+K` (or `Control+K` on Linux); a dialog/listbox role becomes visible.
- **Tab order**: from focused logo link, sequential Tab keypresses focus each menu trigger, then each right-zone button, without traps.

## Out of scope

- Menu data-driven behavior (Step 1).
- Divider/underline geometry (Step 3).
- Dropdown content rendering (Step 4).
- Mobile-hamburger collapse (separate customization).
