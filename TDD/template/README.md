# Template Customizations

> Aanpassingen op de Nuxt UI docs-template baseline. Dit zit tussen `SCAFFOLDING.md` (foundation) en `features/` (eigen features) in.

---

## Waarom deze folder bestaat

De Nuxt UI docs-template levert al veel uit de doos: markdown rendering, code blocks, prose components, search, dark mode, auto-sidebar. Een aantal van die zaken doen wat we willen — die laten we met rust. Maar voor sommige onderdelen wijkt onze spec af van wat de template levert. Die wijken-af-werken zijn _customizations_, en ze zijn niet hetzelfde als nieuwe features.

Het verschil:

- **Een feature** (`features/`) — iets bouwen dat er nog niet is. Code-editor, card-trainer, AI-assistent
- **Een customization** (deze folder) — iets aanpassen dat er al is. De auto-sidebar van de template vervangen door een scope-bound versie, hun layout-chrome aanpassen, hun search uitbreiden met een scope-filter

Een customization verwijst meestal naar een feature-spec voor de _inhoudelijke_ eisen ("wat moet de scope-bound sidebar doen?"). De customization-doc beschrijft het werk om de template-versie te vervangen door wat de feature-spec voorschrijft. Twee documenten, één voor de wat-vraag, één voor de hoe-vraag.

---

## Volgorde van customizations

Geordend op afhankelijkheden — wat eerst moet staan voordat het volgende zinvol is. Eén PR per customization, geen vermenging.

| # | File | Status | Scope |
|---|---|---|---|
| 01 | `01-branding.md` | **Optioneel** | Fijn-tuning na foundation: red-shade, logo-spacing, favicon, OG image |
| 02 | `02-sidebar-replacement.md` | **Core** — eerst doen | Auto-sidebar vervangen door scope-bound versie. Tree-bron voor de rest |
| 03 | `03-layout-chrome.md` | **Groot** | Header met dropdowns + sub-header level-bar + breadcrumb + action bar + sliding right panel skeleton |
| 04 | `04-smart-toc.md` | Bovenop 03 | Variant-bewuste, tab-bewuste, scroll-driven ToC in het right panel uit 03 |
| 05 | `05-page-bottom.md` | Bovenop 02 | Changelog timeline + Prev/Next kaarten onder de content |
| 06 | `06-search-scope-filter.md` | Geïsoleerd | Scope-toggle in de search palette: huidige sectie of alles |

**Waarom deze volgorde:**

- **02 eerst** want sidebar = tree-bron. Header-dropdowns, prev/next, ToC-variants leunen er allemaal op
- **03 daarna** want die levert de visuele containers waar 04 en 05 hun content in plaatsen
- **04 en 05 parallel mogelijk** als 02 en 03 staan — geen overlap, raken verschillende delen
- **06 wanneer je wil** — geïsoleerd, kan eerder of later

**01-branding optioneel:**

Foundation heeft de basis-branding al gedaan (rood, 1000x-logo, site-naam). `01-branding.md` is voor latere fijn-tuning — exacte red-shade kiezen, OG image maken, favicon-set genereren. Niet kritisch voor de andere customizations.

---

## Wanneer is iets een customization vs een feature?

| Customization | Feature |
|---|---|
| Template levert iets, jij past het aan | Template levert het niet, jij bouwt het |
| Vervangt of overschrijft template-code | Geheel nieuwe componenten en logica |
| Verwijst naar feature-spec voor eisen | Eigen spec is bron van waarheid |
| Resultaat: dezelfde plek in UI, ander gedrag | Resultaat: nieuwe plek in UI |

In twijfelgeval: kijk in de template hoe het er nu uitziet. Bestaat het al en moeten we het anders krijgen → customization. Bestaat het niet → feature.

---

## Format per customization-doc

Elk customization-doc heeft deze secties:

- **Wat verandert** — welke template-files of components ik aanraak
- **Waarom** — link naar de feature-spec(s) die de eisen bevat
- **Aanpak** — vervangen of uitbreiden, en het hoe
- **Tests** — wat er moet werken na de customization
- **Open punten** — onzekerheden die tijdens implementatie opgelost moeten worden

Skelets bevatten de structuur en de links; de "Aanpak" en "Open punten" worden tijdens implementatie ingevuld zodra de template-codebase is geïnspecteerd.

---

## Workflow

Per customization:

1. **Lees de gerelateerde feature-spec(s)** in `features/` voor de inhoudelijke eisen
2. **Open de template-code** lokaal en kijk hoe het nu werkt
3. **Vul het customization-doc verder in** — Aanpak en Open punten vooral
4. **Maak een branch**: `customization/02-sidebar`, `customization/03-layout-chrome` etc.
5. **Schrijf tests vóór implementatie** — TDD-stijl, zoals we voor features doen
6. **Implementatie**, lokale verificatie, PR met scope helder afgebakend
7. **Merge** en pas door naar volgende customization

Eén PR = één customization. Niet bundelen — anders wordt review onmogelijk en rollback ook.

---

## Wat NIET in deze folder hoort

- **Foundation-werk** (branding setup, i18n config, dependencies, content-schema). Hoort in `SCAFFOLDING.md`
- **Nieuwe features** die de template niet levert (code-editor, card-trainer, AI-assistent, image-lightbox, etc.). Hoort in `features/`
- **Spec-wijzigingen**. Als de inhoudelijke eis verandert, pas `spec.md` of `features/<feature>/spec.md` aan

Als je twijfelt: post de vraag in de discussie-chat voordat je een customization-doc schrijft. Sneller dan achteraf splitsen.