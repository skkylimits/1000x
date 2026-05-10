# 02-template — Customizations op de Nuxt UI docs-template

> Stage 2 van drie. Alles wat de baseline-template levert maar wij anders willen, leeft hier. Voor de bredere roadmap zie [`../FEATURES.md`](../FEATURES.md); voor architectuur-discipline zie [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Waarom deze stage bestaat

De Nuxt UI docs-template + Nuxt Content leveren al veel uit de doos: markdown rendering, code blocks, prose components, search, dark mode, auto-sidebar, ToC, prev/next, breadcrumb. Een aantal van die zaken doen wat we willen — die laten we met rust. Maar voor **alle items in deze folder** wijkt onze spec genoeg af van de baseline dat we de template-versie volledig of grotendeels vervangen.

Een customization is geen feature in de engere zin, maar architectonisch zwaar genoeg dat we ze als één behandelen: één folder, één canonieke SPEC, één PR. Het verschil:

| **Customization** (deze stage) | **Feature** (`03-features/`) |
|---|---|
| Template/Nuxt levert iets, wij vervangen of breiden uit | Template levert het niet, wij bouwen het van scratch |
| Resultaat: dezelfde plek in de UI, ander gedrag | Resultaat: nieuwe plek in de UI |
| Geen nieuwe runtime-libraries | Brengt vaak nieuwe libraries mee (CodeMirror, Pyodide, ...) |

## Volgorde

Dertien customizations, gegroepeerd per laag. Elke laag bouwt op de vorige.

**Laag A — Markdown content (geen chrome aangeraakt)**

| # | Customization | Hangt af van |
|---|---|---|
| 01 | [markdown-rendering](./01-markdown-rendering/SPEC.md) — base prose + MDC inline `::tabs` voor kleine alternatives | — |

**Laag B — Tree-bron én visible sidebar**

| # | Customization | Hangt af van |
|---|---|---|
| 02 | [section-sidebar](./02-section-sidebar/SPEC.md) — `useNavTree()` + scope-walk + kind-detection (page/chapter/levels-container/tabs-container/level/tab) + index-hoist + levels-effective-scope + tabs-container-leaf rendering | 01 |

Section-sidebar Step 1 (`buildTree` + `useNavTree`) is de data-foundation die alle latere customizations consumeren. Step 2 maakt de sidebar visueel. Step 3 polish (persistence + keyboard + a11y).

**Laag C — Chrome consumers van de tree**

| # | Customization | Hangt af van |
|---|---|---|
| 03 | [header](./03-header/SPEC.md) — zes module-dropdowns + vijf icon-only actie-knoppen | 02 |
| 04 | [levels](./04-levels/SPEC.md) — AppLevelHeader chrome-sub-header voor secties met `levels: true` (folder-based) | 02 |
| 05 | [tabs](./05-tabs/SPEC.md) — TabBar in-content onder H1 voor directories met `tabs: true` (file-based siblings) | 02 |

`03/04/05` parallel mogelijk zodra `02` staat. Allemaal consumeren `useNavTree`.

**Laag D — Page-niveau chrome**

| # | Customization | Hangt af van |
|---|---|---|
| 06 | [page-chrome](./06-page-chrome/SPEC.md) — breadcrumb + actiebalk inline naast H1 | 02 |
| 07 | [right-panel](./07-right-panel/SPEC.md) — drie-kolom skelet + resize + open/close + switcher buttons | 02 |

**Laag E — Inhoud van het rechter-panel**

| # | Customization | Hangt af van |
|---|---|---|
| 08 | [smart-toc](./08-smart-toc/SPEC.md) — scroll-driven, auto-fit ToC (tab/level-awareness via routing) | 07 |

**Laag F — Onderaan-pagina**

| # | Customization | Hangt af van |
|---|---|---|
| 09 | [changelog](./09-changelog/SPEC.md) — commit-timeline van git | 02 |
| 10 | [prev-next](./10-prev-next/SPEC.md) — scope-bound wrapper rond `queryCollectionItemSurroundings` (level-awareness komt gratis via URL-nesting) | 02 |

Splitsing van changelog en prev-next omdat ze technisch heel verschillend zijn (git-introspect vs. nav-walk).

**Laag G — Extras**

| # | Customization | Hangt af van |
|---|---|---|
| 11 | [search](./11-search/SPEC.md) — scope-toggle bovenop OOTB full-text search | 02 |
| 12 | [math-en-diagrammen](./12-math-en-diagrammen/SPEC.md) — KaTeX (formules) + Mermaid (diagrammen), opt-in per page | 01 |
| 13 | [image-lightbox](./13-image-lightbox/SPEC.md) — klik op afbeelding → fullscreen overlay met alt als caption | 01 |

## Format per customization

Elke customization heeft één `SPEC.md` in zijn eigen folder met:

- **Summary** — 1–3 zinnen: wat verandert er, voor wie
- **Goals** — concrete outcomes (3–6 bullets)
- **Requirements** — functionele eisen, gefocust op wat de template-versie raakt
- **Constraints** (optioneel) — wat expliciet niet hier hoort
- **Implementation Steps** (optioneel) — geordende stappen met `steps/` sub-folders voor `prompt.md` + `test-prompt.md`

Geen design tot op de pixel; geen library- of file-keuzes in de SPEC. Het "hoe" leeft in de PR.

## Workflow

Per customization:

1. **Lees de SPEC.md** plus relevante cross-refs (foundation, andere customizations)
2. **Open de template-code** lokaal en kijk hoe het nu werkt
3. **Schrijf tests vóór implementatie** — `tests/unit/` of `tests/e2e/` aan repo root
4. **Implementatie**, lokale verificatie, PR met scope helder afgebakend
5. **Merge** en pas door naar volgende customization

Eén PR = één customization. Niet bundelen — anders wordt review onmogelijk en rollback ook.

## Wat NIET in deze folder hoort

- **Foundation-werk** (scaffolding, branding setup, i18n-config, content-schema, deploy-config, demo-content stubs) → [`01-foundation/`](../01-foundation/)
- **Echt nieuwe features** die de template niet levert (code-editor, card-trainer, comments, AI-assistent, etc.) → [`03-features/`](../03-features/)
- **Spec-wijzigingen aan de overall productspec** → `TDD/SPEC.md`

Als je twijfelt of iets customization of feature is: kijk of de template/Nuxt het al levert. Bestaat het al en moeten we het anders krijgen → customization. Bestaat het niet → feature.
