# Step 3 — Divider + active-state underline geometry (test-prompt)

## Context

Two visual contracts from SPEC §25–26:
1. The divider under the header runs **edge-to-edge** — no inset.
2. The active main-menu item's underline **lands on the divider** — its bottom edge coincides with the header's bottom border.

Pixel-level layout; verified via DOM bounding rects and computed styles.

Read `TDD/02-TEMPLATE/03-header/SPEC.md` requirements 25, 26.

## Framework

Playwright e2e (geometry / computed-style assertions).

## Test file

`tests/e2e/header-divider.spec.ts`.

## Public contract under test

- The header's bottom border bounding-rect spans the full viewport width.
- The `<UNavigationMenu>` active-indicator element has its bottom edge aligned with the header's bottom edge — within ±1px.

## Test cases

- **Border spans viewport — wide**: at 1280×800, header bottom border has `left === 0` and `right === viewport.width`.
- **Border spans viewport — narrow**: at 320×568, same assertion holds.
- **Underline lands on divider — exact-match route**: `goto('/syntax')`; the "Syntax" trigger's active-indicator bbox bottom Y equals the header's bbox bottom Y within ±1px.
- **Underline lands on divider — descendant route**: `goto('/syntax/git')`; same alignment.
- **Active indicator computed bottom**: `window.getComputedStyle(indicator).bottom === '-1px'` (or whatever value places its bottom edge on the border).
- **Inactive items have no underline at divider position**: a non-active trigger has no descendant element whose bbox bottom Y equals the header's bbox bottom Y.

## Out of scope

- Color of the underline (visual concern, not asserted).
- Hover-state animations (not in SPEC).
- Dropdown panel positioning (Step 4).
