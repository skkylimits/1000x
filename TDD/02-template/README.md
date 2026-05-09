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

De definitieve volgorde-revisit komt apart aan bod (afhankelijkheden tussen customizations + content-stub-prep in foundation). Voorlopige volgorde-discipline:

- **`01-markdown-rendering` eerst** — content-rendering is het fundament. Sidebar/ToC/changelog hebben rijke content nodig om getest te kunnen worden
- **`02-section-sidebar` daarna** — levert de tree-bron die alle nav-surfaces voedt (header-dropdowns, prev/next, smart ToC, breadcrumb)
- **`03-header`, `04-variant-tabs`, `05-page-chrome`** — chrome-lagen, parallelliseerbaar zodra `02` staat
- **`06-content-tabs` vóór `07-rechter-panel-en-toc`** — de smart ToC is tab-bewust, dus content-tabs moeten eerder bestaan
- **`07-rechter-panel-en-toc`** vereist `05` (rechter-panel-skelet) + `06` (content-tabs)
- **`08-changelog-en-prev-next`** — onafhankelijk zodra de tree-bron uit `02` staat
- **`09-search`** — geïsoleerd, kan op elk moment
- **`10-math-en-diagrammen`, `11-image-lightbox`** — markdown-rendering enhancements, hangen van `01-markdown-rendering` af

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
