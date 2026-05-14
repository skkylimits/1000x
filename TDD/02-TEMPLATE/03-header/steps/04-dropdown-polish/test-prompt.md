# Step 4 — Dropdown content polish (test-prompt)

## Context

Each dropdown child renders icon + title + 2-line clamped description from frontmatter (SPEC req 22). Truncation is CSS-only (`line-clamp: 2`). Existing root + child `index.md` files must carry `title`, `icon`, `description` frontmatter so the rendered dropdown is rich.

Read `TDD/02-TEMPLATE/03-header/SPEC.md` requirement 22.

## Framework

Playwright e2e (computed-style + DOM-shape assertions).

## Test file

`tests/e2e/header-dropdown.spec.ts`.

## Public contract under test

- A dropdown child element contains: an icon node, a title node, and a description node — each addressable as separate elements.
- The description node has computed `-webkit-line-clamp: 2`.
- A child with a long description is visibly height-capped near 2 line-heights.

## Test cases

- **Open dropdown**: `goto('/')`, click the "Syntax" trigger → dropdown panel becomes visible.
- **Shape of a child**: each visible child contains an icon element (`<svg>` or `[data-icon]`), a non-empty title element, and a description element.
- **Line-clamp applied**: a description node has computed style `-webkit-line-clamp: 2` (assert via `evaluate(el => getComputedStyle(el).webkitLineClamp)`).
- **Visual truncation**: a child with a description longer than 2 lines has rendered height ≤ ~2.2 × line-height (tolerance for padding).
- **Frontmatter required on roots**: navigating to `/lab`, `/syntax`, `/kb` succeeds; each corresponding menu item shows an icon and non-empty title (proves root `index.md` frontmatter is complete).

## Out of scope

- Actual content of descriptions (authored, not tested).
- Mobile-collapse of the dropdown (separate customization).
- Active styling within dropdowns (no SPEC requirement).
