# Contributing to 1000x

> Hoe werk in dit project georganiseerd is en hoe PRs scope-bewust blijven. Voor _wat_ gebouwd wordt: zie `SPEC.md`. Voor de eenmalige project-setup: zie `SCAFFOLDING.md`.

## Drie soorten werk

Het project bestaat uit drie soorten werk die naast elkaar leven en elk een eigen plek hebben in de documentatie. Wanneer een task binnenkomt, classificeer hem eerst — niet door elkaar halen, anders worden PRs onmogelijk te reviewen.

**1. Foundation** — éénmalige setup vanuit de docs-template-baseline naar een gebrand 1000x-project: branding (rood, 1000x-logo), i18n (NL default, EN secondary), content-schema uitbreiden met 1000x-velden (`schemaVersion`, `scope`, `nav`, `variants`), AGENTS.md voor agent-context, ESLint + antfu, eerste deploy. Beschreven in `SCAFFOLDING.md`. Niet feature-bound.

**2. Template customizations** — werk waar de Nuxt UI docs-template iets levert dat afwijkt van wat onze spec voorschrijft: layout-chrome (header met dropdown-menu's, level-bar voor variant-tabs, sliding rechter-panel, breadcrumb, action bar), sidebar-replacement met scope-binding, smart variant-aware ToC, search met scope-filter. Beschreven per onderdeel in `template/`. Verwijst voor inhoudelijke eisen naar de feature-specs.

**3. Eigen features** — de 21 features uit de spec die de template niet levert: code-editor met execution, card trainer, AI-assistent, View/Edit-toggle, in-app content-management, comments, auth-gate, PWA, mobile, etc. Beschreven per feature in `features/<nummer>-<naam>/SPEC.md`, met implementatie-plannen in `features/<nummer>-<naam>/steps/<stap>/`.

## Verhouding tot de spec

De feature-specs in `SPEC.md` (sectie "Core Features") en in `features/` beschrijven _wat_ het systeem moet doen — engine-agnostisch, los van of het werk in categorie 1, 2 of 3 valt. Een feature kan deels via een customization geïmplementeerd zijn (bijvoorbeeld feature 2 sidebar via `template/SIDEBAR-REPLACEMENT.md`) en deels via een eigen feature-PR (bijvoorbeeld de plus-knoppen functioneel maken via feature 11). Dat is geen probleem zolang elk PR scope-bewust blijft.

## Volgorde

Foundation → customizations → features. Een feature begint pas wanneer de bijbehorende customizations áf zijn — anders bouw je op een fundament dat onder je vandaan beweegt.