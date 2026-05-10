# 02-TEMPLATE — Customizations op de Nuxt UI docs-template

> Stage 2 van drie. Alles wat de baseline-template levert maar wij anders willen, leeft hier. Voor de bredere roadmap zie [`../FEATURES.md`](../FEATURES.md); voor architectuur-discipline zie [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Waarom deze stage bestaat

De Nuxt UI docs-template + Nuxt UI v4 + Nuxt Content leveren al veel uit de doos: markdown rendering, code blocks, prose components, search, dark mode, auto-sidebar, ToC, prev/next, breadcrumb, changelog-component, en meer. Een groot deel daarvan doet wat we willen — die laten we onaangeroerd. Sommige onderdelen tweaken we (extension via dunne wrapper). Slechts enkele vervangen we volledig, en alleen wanneer de OOTB-versie aantoonbaar niet voldoet aan de spec.

Een customization is geen feature in de engere zin, maar architectonisch zwaar genoeg dat we ze als één behandelen: één folder, één canonieke SPEC, één PR. Het verschil:

| **Customization** (deze stage) | **Feature** (`03-FEATURES/`) |
|---|---|
| Nuxt UI / Nuxt Content / docs-template levert iets, wij behouden / extenden / vervangen | Niets levert het OOTB, wij bouwen het van scratch |
| Resultaat: dezelfde plek in de UI, soms ander gedrag | Resultaat: nieuwe plek in de UI |
| Geen nieuwe runtime-libraries | Brengt vaak nieuwe libraries mee (CodeMirror, Pyodide, ...) |

## Decision-rule: OOTB-first

**Default**: gebruik wat Nuxt UI v4, Nuxt Content en de docs-template uit de doos leveren.

**Replacement-trigger**: alleen vervangen / extenden wanneer een van deze drie waar is:

1. De OOTB-versie levert het gevraagde gedrag uit de SPEC niet (bv. scope-bound sidebar bestaat niet OOTB)
2. De OOTB-versie breekt aantoonbaar onder onze content-modellen (bv. file-based tabs die het standaard ToC-gedrag forceert om verkeerde headings te tonen — pas dan een smart-ToC inbouwen)
3. We voegen iets nieuws toe dat geen OOTB-equivalent heeft (bv. KaTeX, Mermaid, image-lightbox)

**Volgorde van aanpak per customization**, in deze prioriteit:

1. **OOTB hergebruiken**: gebruik de Nuxt UI v4 component (incl. de Pro-componenten die nu in v4 unified zijn — bv. `<UContentToc>`, `<UContentSearch>`, `<UBreadcrumb>`, `<UChangelog>`) of de Nuxt Content API direct
2. **Slot-overriden of theming**: als smaak verschilt, theme via `app.config.ts` of slot-content per Nuxt UI's documentatie. Geen eigen rebuild
3. **Dunne wrapper rond OOTB**: als de SPEC iets vraagt dat een kleine layer bovenop OOTB nodig heeft (bv. scope-filter rond `queryCollectionItemSurroundings` voor prev/next, of git-data integratie bovenop `<UChangelog>`)
4. **Volledig vervangen**: alleen wanneer (1)-(3) niet werken. Documenteer in de SPEC welke OOTB-onderzoeksstap je gedaan hebt en waarom 'ie tekortschoot

**Wat dit voor de 13 customizations betekent**:

| Aanpak | Customizations |
|---|---|
| **Vervangt OOTB** (echt verschillend gedrag) | 02 section-sidebar, 03 header (omdat onze 6+5-layout fundamenteel afwijkt) |
| **Extension van OOTB** (dunne wrapper) | 09 changelog (`<UChangelog>` + git-data), 10 prev-next (`queryCollectionItemSurroundings` + scope-filter), 11 search (`<UContentSearch>` + scope-toggle) |
| **OOTB hergebruiken, alleen tweak** (theming of slot) | 06 page-chrome breadcrumb (`<UBreadcrumb>`), 08 smart-toc (`<UContentToc>` als basis, scroll-driven gedrag pas inbouwen wanneer file-based tabs of levels het OOTB-gedrag breken), 07 right-panel (docs-template levert skelet) |
| **Nieuw, geen OOTB** | 01 markdown-rendering (extends schema), 04 levels, 05 tabs, 12 math-en-diagrammen, 13 image-lightbox |

Iedere customization SPEC verwijst impliciet naar deze decision-rule. Geen herhaling per SPEC nodig.

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

- **Foundation-werk** (scaffolding, branding setup, i18n-config, content-schema, deploy-config, demo-content stubs) → [`01-FOUNDATION/`](../01-FOUNDATION/)
- **Echt nieuwe features** die de template niet levert (code-editor, card-trainer, comments, AI-assistent, etc.) → [`03-FEATURES/`](../03-FEATURES/)
- **Spec-wijzigingen aan de overall productspec** → `TDD/SPEC.md`

Als je twijfelt of iets customization of feature is: kijk of de template/Nuxt het al levert. Bestaat het al en moeten we het anders krijgen → customization. Bestaat het niet → feature.
