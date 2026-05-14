# Step 5 — Consolidated header suite + accessibility (test-prompt)

## Context

Final canonical `tests/e2e/header.spec.ts` covering the data-driven smoke (SPEC's central promise), keyboard navigation (WCAG 2.1 AA), and axe-core accessibility. Steps 2–4 produce focused spec files; this step adds a single high-level suite for end-to-end behavior + a11y.

Read `TDD/02-TEMPLATE/03-header/SPEC.md` requirements 10, 29, 30.

## Framework

Playwright e2e, with `@axe-core/playwright` for accessibility (add as devDep if not present).

## Test file

`tests/e2e/header.spec.ts`.

## Public contract under test

- Header renders at every route (`/`, content routes).
- A new markdown file dropped into `content/2.syntax/` appears as a dropdown child after reload — no code change.
- Keyboard sequence Tab → Enter → ArrowDown → Enter → Escape produces the documented outcome.
- Axe scan on the header region surfaces zero **critical** violations.

## Test cases

- **Header presence**: at `/`, header element renders with logo, ≥1 nav trigger, 5 right-zone buttons.
- **Single-child root direct link**: "Lab" trigger renders without chevron; click navigates to `/lab`.
- **Multi-child root dropdown**: "Syntax" trigger renders with chevron; click opens panel with ≥2 child links; clicking a child navigates and closes the panel.
- **Data-driven smoke**:
  - `test.beforeAll`: write `content/2.syntax/_test-smoke.md` with frontmatter `{ title: 'Test Smoke', icon: 'i-lucide-flask-conical', description: 'fixture file for header smoke test' }`. Wait for HMR or trigger reload.
  - Test: `goto('/')`, open Syntax dropdown, assert a link with text "Test Smoke" is visible.
  - `test.afterAll`: delete the fixture file.
- **Keyboard — open**: focus a multi-child trigger via Tab; press Enter → dropdown opens.
- **Keyboard — cycle**: with dropdown open, ArrowDown moves focus to next child; ArrowUp moves back; focus is visible (not lost).
- **Keyboard — activate**: with a child focused, Enter navigates to that route.
- **Keyboard — Escape closes**: with dropdown open, Escape closes it and returns focus to the trigger.
- **Axe accessibility**: `await new AxeBuilder({ page }).include('header').analyze()`; assert zero violations with `impact === 'critical'`.

## Out of scope

- Manual a11y audits (documented in implementation plan, not automated here).
- Color-mode-specific visual regressions.
- Non-header pages.

## Note on tooling

If `@axe-core/playwright` is not in `devDependencies`, the test session should add it via `pnpm add -D @axe-core/playwright` and document the change in the step folder's notes.
