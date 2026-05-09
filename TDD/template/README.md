# Template Customizations

> Aanpassingen op de Nuxt UI docs-template baseline. Dit zit tussen `SCAFFOLDING.md` (foundation) en `features/` (eigen features) in.

---

## Waarom deze folder bestaat

De Nuxt UI docs-template levert al veel uit de doos: markdown rendering, code blocks, prose components, search, dark mode, auto-sidebar. Een aantal van die zaken doen wat we willen — die laten we met rust. Maar voor sommige onderdelen wijkt onze spec af van wat de template levert. Die wijken-af-werken zijn _customizations_, en ze zijn niet hetzelfde als nieuwe features.

Het verschil:

- **Een feature** (`features/`) — iets bouwen dat er nog niet is. Code-editor, card-trainer, AI-assistent
- **Een customization** (deze folder) — iets aanpassen dat er al is. De auto-sidebar vervangen door een scope-bound versie, de header en sub-header van de template vervangen, hun search uitbreiden met een scope-filter

Een customization spec extraheert de inhoudelijke eisen uit de gerelateerde feature-spec(s) maar focust op het stuk dat de template-versie raakt. Overlap met de feature-spec is by design: de feature-spec is bron-van-waarheid voor "wat moet het uiteindelijk doen", de customization-spec is een gefocuste her-uitsnede voor het vervangings-werk op de template.

---

## Volgorde van customizations

Geordend op afhankelijkheden — wat eerst moet staan voordat het volgende zinvol is. Eén PR per customization, geen vermenging.

| # | File | Status | Scope |
|---|---|---|---|
| 01 | `01-branding/SPEC.md` | **Optioneel** | Fijn-tuning na foundation: red-shade, logo-spacing, favicon, OG image |
| 02 | `02-sidebar-replacement/SPEC.md` | **Core** — eerst doen | Auto-sidebar vervangen door scope-bound versie. Tree-bron voor de rest |
| 03 | `03-header/SPEC.md` | Bovenop 02 | Logo + hoofdmenu met dropdowns + vijf actie-knoppen rechts |
| 04 | `04-variant-tabs/SPEC.md` | Bovenop 02 | Sub-header met variant-tabs, overflow-collapse, querystring-sync |
| 05 | `05-page-chrome/SPEC.md` | Bovenop 02 | Breadcrumb + pagina-actiebalk + rechter-panel skelet als container |
| 06 | `06-content-tabs/SPEC.md` | Voor 07 | Markdown content-tabs binnen pagina's. Bron-data voor tab-bewuste smart ToC |
| 07 | `07-smart-toc/SPEC.md` | Bovenop 05 + 06 | Variant-bewuste, tab-bewuste, scroll-driven ToC in het rechter panel |
| 08 | `08-page-bottom/SPEC.md` | Bovenop 02 | Changelog timeline + Prev/Next kaarten onder de content |
| 09 | `09-search-scope-filter/SPEC.md` | Geïsoleerd | Scope-toggle in de search palette: huidige sectie of alles |

**Waarom deze volgorde:**

- **02 eerst** want sidebar = tree-bron. Header-dropdowns, prev/next, ToC-variants, breadcrumb leunen er allemaal op
- **03 / 04 / 05 daarna** — chrome-lagen die het visuele skelet leveren waar latere customizations hun inhoud in plaatsen. Onderling onafhankelijk dus parallelliseerbaar als 02 staat
- **06 voor 07** want de smart ToC is tab-bewust — content-tabs moeten bestaan voordat de ToC daarop kan reageren, anders bouw je hem twee keer
- **07 vereist 05 + 06** — leeft in het rechter-panel-skelet (uit 05) en moet tab-bewust zijn (uit 06)
- **08 parallel mogelijk** zodra 02 staat — raakt alleen de tree, niet het chrome
- **09 wanneer je wil** — geïsoleerd, kan eerder of later

**01-branding optioneel:**

Foundation heeft de basis-branding al gedaan (rood, 1000x-logo, site-naam). `01-branding/SPEC.md` is voor latere fijn-tuning — exacte red-shade kiezen, OG image maken, favicon-set genereren. Niet kritisch voor de andere customizations.

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

Elke customization heeft één SPEC.md in zijn eigen folder, met identiek format als feature-specs (`features/<n>/SPEC.md`):

- **Summary** — 1–3 zinnen: wat verandert er, welke template-versie wordt vervangen of uitgebreid, voor wie
- **Goals** — concrete outcomes die deze customization moet bereiken (3–6 bullets)
- **Requirements** — functionele eisen, doorgaans pulled uit de gerelateerde feature-spec(s) en gefocust op het stuk dat de template-versie raakt

Geen design, geen library- of file-keuzes, geen UI-positionering tot op de pixel. Het "hoe" leeft in de PR zelf — de spec beschrijft alleen het _wat_ en het _waarom_.

---

## Workflow

Per customization:

1. **Lees de SPEC.md** in `template/<n>/` plus de gerelateerde feature-spec(s) in `features/`
2. **Open de template-code** lokaal en kijk hoe het nu werkt
3. **Maak een branch**: `customization/02-sidebar`, `customization/03-header`, `customization/04-variant-tabs` etc.
4. **Schrijf tests vóór implementatie** — TDD-stijl, zoals we voor features doen
5. **Implementatie**, lokale verificatie, PR met scope helder afgebakend
6. **Merge** en pas door naar volgende customization

Eén PR = één customization. Niet bundelen — anders wordt review onmogelijk en rollback ook.

---

## Wat NIET in deze folder hoort

- **Foundation-werk** (branding setup, i18n config, dependencies, content-schema). Hoort in `SCAFFOLDING.md`
- **Nieuwe features** die de template niet levert (code-editor, card-trainer, AI-assistent, image-lightbox, etc.). Hoort in `features/`
- **Spec-wijzigingen**. Als de inhoudelijke eis verandert, pas `TDD/SPEC.md` of `TDD/features/<feature>/SPEC.md` aan

Als je twijfelt: post de vraag in de discussie-chat voordat je een customization-doc schrijft. Sneller dan achteraf splitsen.