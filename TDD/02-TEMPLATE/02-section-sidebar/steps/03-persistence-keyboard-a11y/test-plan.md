# Test Plan — Step 3: Persistence, keyboard nav & WCAG 2.1 AA

> Stub. Wordt ingevuld zodra Stap 3 wordt opgepakt.
>
> Stap-scope staat in [`../../SPEC.md`](../../SPEC.md) onder
> `## Implementation Steps` → **Step 3**.
>
> Verwachte test-vorm (op basis van de SPEC):
>
> - E2E (Playwright): collapse-state per chapter overleeft een page-reload
>   (write naar localStorage via `settingsStore`-wrapper)
> - E2E: roving tabindex — `Tab` brengt focus de sidebar in als één group;
>   ↑/↓ navigeert tussen items in de visuele volgorde
> - E2E: ←/→ klapt een chapter dicht/open vanaf de chapter-button
> - E2E: `Enter` op een page-link navigeert
> - E2E: focus-visible ring is zichtbaar op het gefocuste item
> - Unit / integration: `useSidebarCollapse()` schrijft via `settingsStore`,
>   niet rechtstreeks naar `localStorage`, zodat feature 03 in 03-FEATURES dezelfde interface
>   kan hergebruiken
> - A11y: `aria-current="page"` op actief link, accessible names op alle
>   interactieve elementen, geen tooltip-overlay
>
> Format-referentie: `TDD/features/01-markdown-rendering/steps/01-base-rendering/test-plan.md` op de `01-markdown-rendering` branch (de oude features-folder bestond daar nog; de file dient als format-voorbeeld voor test-plan.md's).
