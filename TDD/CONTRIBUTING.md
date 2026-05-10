# Contributing to 1000x

> Hoe werk in dit project georganiseerd is en hoe PRs scope-bewust blijven. Voor _wat_ gebouwd wordt: zie [`SPEC.md`](./SPEC.md) en [`FEATURES.md`](./FEATURES.md). Voor de eenmalige project-setup: zie [`01-FOUNDATION/SCAFFOLDING.md`](./01-FOUNDATION/SCAFFOLDING.md). Voor architectuur-discipline: zie [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Drie soorten werk

Het project bestaat uit drie soorten werk in drie geordende stages. Wanneer een task binnenkomt, classificeer hem eerst — niet door elkaar halen, anders worden PRs onmogelijk te reviewen.

**1. Foundation** (`01-FOUNDATION/`) — éénmalige setup vanuit de docs-template-baseline naar een gebrand 1000x-project: branding (rood, 1000x-logo), i18n (NL default, EN secondary), content-schema uitbreiden met 1000x-velden (`schemaVersion`, `scope`, `nav`, `levels`, `tabs`, `icon`), AGENTS.md voor agent-context, ESLint + antfu, eerste deploy, plus content-stubs als integration-testbed. Beschreven in `01-FOUNDATION/SCAFFOLDING.md` en `01-FOUNDATION/FOUNDATION.md`. Niet feature-bound.

**2. Template customizations** (`02-TEMPLATE/`) — werk waar de Nuxt UI docs-template of Nuxt Content iets levert dat afwijkt van wat onze spec voorschrijft. Dertien customizations: markdown-rendering, section-sidebar met `useNavTree`, header met dropdowns, levels (folder-based chrome-sub-header), tabs (file-based directory-tabs), page-chrome (breadcrumb + actiebalk), right-panel (skelet + switcher), smart-toc, changelog, prev-next, search met scope-filter, math/diagrammen, image-lightbox. Beschreven per onderdeel in `02-TEMPLATE/`. Iedere customization heeft één `SPEC.md`; grotere customizations hebben optioneel `steps/` sub-folders voor implementation-prompts.

**3. Eigen features** (`03-FEATURES/`) — tien features die de template niet levert: edit-met-drafts, content-management, settings, code-editor met execution, card-trainer, comments, mobiele-layout, PWA, auth-gate, AI-assistent. Brengen vaak nieuwe libraries mee (CodeMirror, Pyodide, etc.) en eigen state-management (Pinia komt binnen bij feature 02 — zie `ARCHITECTURE.md`). Beschreven per feature in `03-FEATURES/<nummer>-<naam>/SPEC.md`, met implementation-plannen in `03-FEATURES/<nummer>-<naam>/steps/<stap>/`.

## Verhouding tot de spec

De feature- en customization-specs beschrijven _wat_ het systeem moet doen — engine-agnostisch. `SPEC.md` (in de root) is de overall productspec; `FEATURES.md` is de drie-stage roadmap-index met links naar elke individuele SPEC. Een functie kan deels via een customization geïmplementeerd zijn (bijvoorbeeld de scope-bound sidebar via `02-TEMPLATE/02-section-sidebar/`) en deels via een feature-PR (bijvoorbeeld de in-app content management plus-knoppen via `03-FEATURES/02-content-management/`). Dat is geen probleem zolang elk PR scope-bewust blijft.

## Volgorde

Foundation → customizations → features. Een latere stage begint pas wanneer de eerdere áf is — anders bouw je op een fundament dat onder je vandaan beweegt. Binnen template-stage geldt outside-in: markdown-rendering → section-sidebar (geeft `useNavTree`) → header → levels → tabs → chrome → panel-inhoud → onderaan-pagina → extras. Zie `FEATURES.md` § Werk-volgorde principes en `02-TEMPLATE/README.md` § Volgorde voor de exacte ketting.
