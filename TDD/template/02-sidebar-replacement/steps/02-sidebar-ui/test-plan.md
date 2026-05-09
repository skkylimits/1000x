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
> - E2E: variant-collapse zichtbaar — drie `<page>.<variant>.<lang>.md`-files
>   leveren één sidebar-entry op
> - E2E: orphan-pages (zonder chapter) renderen in dezelfde container met
>   gedeelde verticale lijn
> - Geen import van het oude template-sidebar-component meer in de codebase
>   (CI-check of ESLint-rule)
>
> Format-referentie:
> [`TDD/features/01-markdown-rendering/steps/01-base-rendering/test-plan.md`](../../../../features/01-markdown-rendering/steps/01-base-rendering/test-plan.md)
> op de `01-markdown-rendering` branch.
