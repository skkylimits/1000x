# Step 1 — Data-driven menu mapping (test-prompt)

## Context

This step ships a pure mapper that transforms `NavTree.roots` (from `app/utils/nav.ts`) into Nuxt UI's `NavigationMenuItem[]` shape, applying the SPEC's direct-link-vs-dropdown rule and `maxMenuItems` truncation. The mapper is the testable seam — `AppHeader.vue` consumes it via `computed()`.

Read `TDD/02-TEMPLATE/03-header/SPEC.md` for the menu-behavior requirements (lines 19–22, 29).

## Framework

Vitest unit tests. Config: `vitest.config.ts` (env `node`, `globals: false`, explicit imports).

## Test file

`tests/unit/header-menu.test.ts`. Mirror the style of `tests/unit/nav.test.ts` — factory helpers, focused `describe()` blocks.

## Public contract under test

The mapper lives at `app/utils/header-menu.ts` and exports:

```ts
import type { NavigationMenuItem } from '@nuxt/ui'
import type { NavNode } from './nav'

export interface BuildHeaderMenuOptions {
  maxItems: number
  currentPath: string
}

export function buildHeaderMenuItems(
  roots: NavNode[],
  opts: BuildHeaderMenuOptions
): NavigationMenuItem[]
```

Use factories analogous to `page()` / `dir()` from `tests/unit/nav.test.ts` to construct `NavNode` fixtures.

## Test cases

- **Empty input** → returns `[]`.
- **Truncation** → 8 roots in with `maxItems: 6` → exactly 6 items out, in input order.
- **Direct link when 0 children** → root with `children: []` emits `{ label, icon, to: root.path }` and **no** `children` key.
- **Direct link when 1 child** → same direct-link shape; the child is not surfaced as a dropdown.
- **Dropdown when ≥2 filtered children** → emits `{ label, icon, description, children: [...] }`; each child has `{ label, icon, to, description }` mapped from the source `NavNode`.
- **Filters `levels-container` children** → a root whose only children are `meta.kind === 'levels-container'` is treated as 0 effective children → direct link.
- **Filters `tabs-container` children** → same exclusion.
- **`active` flag — exact match** → `currentPath === root.path` → `active: true`.
- **`active` flag — descendant match** → `currentPath.startsWith(root.path + '/')` → `active: true`.
- **`active` flag — no match** → unrelated `currentPath` → `active` falsy on all items.
- **Icon passthrough** → root and child icons copied verbatim.
- **Description passthrough** → present descriptions copied; absent descriptions → field omitted (not empty string).

## Out of scope

- DOM/render assertions (covered by e2e in Steps 2–5).
- I18n of labels (labels come from frontmatter, no translation in the mapper).
- Mobile/responsive behavior.
- The `AppHeader.vue` template — only the pure mapper here.
