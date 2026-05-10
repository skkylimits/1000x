# Test Plan — Step 2: Scope-bound sidebar UI

> Stub. Wordt ingevuld zodra Stap 2 wordt opgepakt.
>
> Stap-scope staat in [`../../SPEC.md`](../../SPEC.md) onder
> `## Implementation Steps` → **Step 2**.
>
> Verwachte test-vorm (op basis van de SPEC):
>
> - E2E (Playwright): sidebar toont scope-label + correcte children voor de
>   huidige route; navigeren naar een andere module wisselt de scope
> - E2E: chapter-expand/collapse via klik
> - E2E: actief item krijgt `aria-current="page"` en zit op de hoogte van het
>   info-gekleurde lijn-segment
> - E2E: orphan-pages (zonder chapter) renderen in dezelfde container met
>   gedeelde verticale lijn
> - E2E: een tabs-container verschijnt als leaf-entry (geen chevron, geen
>   tab-children in de sidebar); wanneer een tab-child de actieve route is,
>   krijgt de leaf `aria-current="true"` en de actieve border-kleur
> - Render-level dekking voor levels-containers wordt pas toegevoegd zodra
>   `01-FOUNDATION/03-content-stubs` levels-folders bevat — de data-laag
>   garandeert al dat zo'n container nooit als sidebar-entry rendert
> - Geen import van het oude template-sidebar-component meer in de codebase
>   (CI-check of ESLint-rule)
>
> Format-referentie: zie `01-tree-and-composable/test-plan.md` voor de
> structuur (Doel / Test-stack / Coverage / Acceptance criteria / Spot-checks).
