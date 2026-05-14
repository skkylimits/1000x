# Step 3 — Divider + active-state underline geometry (test-prompt)

## Context

Two visual contracts from SPEC §25–26:
1. The divider under the header runs **edge-to-edge** — no inset.
2. The active main-menu item's underline **lands on the divider** — its bottom edge coincides (within sub-pixel tolerance) with the header's bottom border. No whitespace between bar and divider.

Implementation notes (set during build session):
- Nuxt UI v4's `<UNavigationMenu>` does **not** ship a horizontal active-underline out of the box (its `highlight` prop is for nested/`level: true` navigation). The build session paints the underline as a Tailwind `::after` pseudo applied to the active link via the mapper.
- The active link gets a marker class `app-header-active` plus the `after:*` utility classes that paint the bar.
- The bar's vertical position uses a negative `bottom` offset so its **bottom edge** lands on the header's bottom border line. The exact offset depends on header height vs link intrinsic height; tests verify the visual outcome, not the literal pixel value.

Pixel-level layout; verified via DOM bounding rects and computed pseudo styles.

Read `TDD/02-TEMPLATE/03-header/SPEC.md` requirements 25, 26.

## Framework

Playwright e2e (geometry / computed-style assertions).

## Test file

`tests/e2e/header-divider.spec.ts`.

## Public contract under test

- The header's bottom border bounding-rect spans the full viewport width at all viewport sizes.
- The active link has a stable marker class (`app-header-active`) so tests can locate it.
- The active link's `::after` pseudo paints a non-transparent underline (the primary brand color).
- The underline's **bottom edge** (computed via the parent link's bbox + the pseudo's CSS `bottom` value) coincides with the header's bottom edge within ±2px.
- Inactive triggers do not receive the marker class.

## Test cases

- **Border spans viewport — wide**: at 1280×800, header element bbox has `left === 0` and `right === viewport.width`.
- **Border spans viewport — narrow**: at 320×568, same assertion holds.
- **Marker class on active link**: at `/syntax`, exactly one `.app-header-active` exists inside the header.
- **No marker on inactive trigger**: at `/lab`, the Syntax trigger button's class list does NOT include `app-header-active`.
- **Underline paints a color**: at `/syntax`, the active link's `::after` has a non-transparent `backgroundColor`.
- **Underline geometry — exact-match route**: at `/syntax`, compute `afterBottomY = link.boundingRect.bottom - parseFloat(getComputedStyle(link, '::after').bottom)` and assert it equals `header.boundingRect.bottom` within ±2px.
- **Underline geometry — descendant route**: at `/syntax/git`, same alignment check passes.

## Out of scope

- The specific pixel value of the `bottom` offset (`-16px` in the current build) — that's an implementation detail tied to header height and link content size; testing the visual outcome (geometry) is more robust.
- Color of the underline beyond non-transparency (theme-token concern).
- Hover-state animations (not in SPEC).
- Dropdown panel positioning (Step 4).
