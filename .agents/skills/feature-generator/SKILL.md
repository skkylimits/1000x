---
name: feature-generator
description: Expand a TDD/SPEC.md into a three-stage TDD/FEATURES.md roadmap-index (`01-FOUNDATION/`, `02-TEMPLATE/`, `03-FEATURES/`) plus per-item SPEC.md stubs in each `<NN>-<slug>/` folder. Also keeps SPEC.md, FEATURES.md and the per-folder SPEC.md files in sync when any of them changes. Trigger when the user asks to "generate features", "create FEATURES.md", "expand the spec", "update features from spec", "sync spec and features", "classify a feature", "split into stages", or "expand the roadmap". Always use this skill when SPEC.md and FEATURES.md are in play together.
---

# Feature Generator Skill

Expand `TDD/SPEC.md` into a drie-stage `TDD/FEATURES.md` (roadmap-index met tabellen) plus per-stage folders met `SPEC.md`-stubs in iedere `<NN>-<slug>/`. Houd alle drie de bronnen in sync wanneer er één wijzigt.

Output gaat direct naar `TDD/` in de project-root — geen sandbox-paden, geen `present_files`. Claude Code toont diffs natively.

Voor de canonieke discipline rond drie stages, PR-grenzen en classificatie zie `TDD/CONTRIBUTING.md`. Voor de architectuur-regels (data-source uniqueness, Pinia-migratiepath) zie `TDD/ARCHITECTURE.md`.

---

## Step 1: Check for SPEC.md

Voordat je iets doet, check of `TDD/SPEC.md` bestaat in de huidige werkdirectory of door de gebruiker is aangeleverd.

**Als `TDD/SPEC.md` niet bestaat:**
Vertel de gebruiker: "There's no `TDD/SPEC.md` yet — you'll need to create one first. If you have the spec-generator skill enabled, I can kick that off for you now. Would you like to do that?"

Ga niet verder tot `SPEC.md` beschikbaar is.

---

## Step 2: Classify each piece of functionality

Lees `TDD/SPEC.md` volledig. Voor iedere discrete functionaliteit (uit User Roles, Core Features, Technical Stack), classificeer hem in één van de drie stages volgens deze heuristiek:

| Stage | Kenmerk |
|---|---|
| **Foundation** (`01-FOUNDATION/`) | Éénmalige setup: scaffolding, branding, i18n, content-schema, deploy-config, content-stubs als integration-testbed. Niet feature-bound, raken we niet meer aan zodra het staat |
| **Template customization** (`02-TEMPLATE/`) | Template/Nuxt levert iets, wij vervangen of breiden uit. Resultaat: dezelfde plek in de UI, ander gedrag. Geen nieuwe runtime-libraries |
| **Eigen feature** (`03-FEATURES/`) | Template levert het niet, wij bouwen het van scratch. Resultaat: nieuwe plek in de UI. Brengt vaak nieuwe libraries mee (CodeMirror, Pyodide, Pinia, etc.) |

**Beslisregel:**
- Bestaat het al in de baseline-template/Nuxt en moet het anders → **customization** (`02-TEMPLATE/`)
- Bestaat het niet in de baseline → **feature** (`03-FEATURES/`)
- Is het puur project-setup, niet feature-bound → **foundation** (`01-FOUNDATION/`)

Bij twijfel: lees `TDD/CONTRIBUTING.md` § "Drie soorten werk" en `TDD/02-TEMPLATE/README.md` § "Waarom deze stage bestaat" — die documenten zijn canoniek voor de discipline.

Nummering is **per stage**: foundation 01..N, template 01..N, features 01..N. Niet één doorlopende nummering over alle drie.

Volgorde binnen elke stage volgt implementatie-afhankelijkheden:

1. **Foundation eerst** — éénmalige scaffolding moet áf zijn voor je aan template begint
2. **Template outside-in** — markdown-rendering → section-sidebar (data-foundation) → header → levels → tabs → page-chrome → right-panel → smart-toc → onderaan-pagina → extras
3. **Features pas na template** — daar komen nieuwe runtimes en eigen state-management binnen

---

## Step 3: Generate FEATURES.md

Drop het oude User-flow + UI-overview skeleton-format. `FEATURES.md` is een **roadmap-index met drie tabellen**, niet de plek voor detail. Detail leeft in `SPEC.md` Core Features (1–2 zinnen + bullets) en in de per-folder `SPEC.md`.

Format:

````markdown
# [Product Name] — Roadmap

> Navigatie-index over de drie stages. Detail per item leeft in de eigen `SPEC.md`. Voor de overall productspec zie [`SPEC.md`](./SPEC.md); voor de architectuur-discipline zie [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## De drie stages

1. **`01-FOUNDATION/`** — éénmalige scaffold + [domain-specific setup items]. Zodra dit staat, raken we het niet meer aan
2. **`02-TEMPLATE/`** — zware tweaks bovenop wat de [baseline] out-of-the-box levert. Alles wat de lezer in chrome en rendering ziet ontstaat hier
3. **`03-FEATURES/`** — echt nieuwe functionaliteit die nieuwe libraries, eigen state-management en eigen interactie-modellen meebrengt

[Eén alinea werk-volgorde: foundation eerst en tot het écht klaar is. Dan template in een outside-in volgorde. Dan features.]

---

## 01-FOUNDATION

| | Item | Wat het doet |
|---|---|---|
| | [SCAFFOLDING.md](./01-FOUNDATION/SCAFFOLDING.md) | Stap-voor-stap setup-bron-van-waarheid |
| | [FOUNDATION.md](./01-FOUNDATION/FOUNDATION.md) | Initial-scaffold scope en non-goals |
| 01 | [01-<slug>](./01-FOUNDATION/01-<slug>/SPEC.md) | [Eén-regel beschrijving] |
| 02 | [02-<slug>](./01-FOUNDATION/02-<slug>/SPEC.md) | [Eén-regel beschrijving] |
| ... | | |

---

## 02-TEMPLATE

| | Customization | Wat het tweakt |
|---|---|---|
| 01 | [01-<slug>](./02-TEMPLATE/01-<slug>/SPEC.md) | [Eén-regel beschrijving] |
| 02 | [02-<slug>](./02-TEMPLATE/02-<slug>/SPEC.md) | [Eén-regel beschrijving] |
| ... | | |

---

## 03-FEATURES

| | Feature | Wat het toevoegt |
|---|---|---|
| 01 | [01-<slug>](./03-FEATURES/01-<slug>/SPEC.md) | [Eén-regel beschrijving] |
| 02 | [02-<slug>](./03-FEATURES/02-<slug>/SPEC.md) | [Eén-regel beschrijving] |
| ... | | |

---

## Werk-volgorde principes

- **Foundation eerst, en helemaal af** — geen half-werk meenemen naar template-tweaks
- **Template: outside-in** — [stage-specifieke ketting]
- **Features-stage komt pas wanneer template-stage stabiel is** — pas dán nieuwe runtimes en eigen interactie-modellen
- **Iedere customization en feature heeft één canonieke SPEC** in de eigen folder. Geen dubbele specs, geen drift
````

Foundation-tabel mag extra rijen voor non-numbered files (zoals `SCAFFOLDING.md`, `FOUNDATION.md`) bevatten — die hebben geen NN-prefix maar zijn wel onderdeel van de stage.

---

## Step 4: Per-stage folder layout

Voor iedere geclassificeerde item maak je de folder in de juiste stage:

```
TDD/01-FOUNDATION/<NN>-<slug>/SPEC.md
TDD/02-TEMPLATE/<NN>-<slug>/SPEC.md
TDD/03-FEATURES/<NN>-<slug>/SPEC.md
```

**Slug-conventie:** kebab-case, lowercased, abbreviated waar natuurlijk (bv. "Section sidebar" → `section-sidebar`, "View / Edit-toggle met lokale drafts" → `edit-met-drafts`, "In-app content management" → `content-management`).

**Numbering:** twee-cijferig met leading zero (`01`, `02`, ..., `13`), per stage opnieuw beginnend bij 01.

Per-folder `SPEC.md`-stub gebruikt het canonieke format uit `TDD/02-TEMPLATE/README.md` § "Format per customization":

```markdown
# [Item Name]

## Summary

[1–3 zinnen: wat verandert er of wat doet het, voor wie. Engine-agnostisch — geen library-keuzes hier.]

## Goals

- [Concrete outcome]
- [Concrete outcome]
- [3–6 bullets totaal]

## Requirements

- [Functionele eis]
- [Functionele eis]
- [...]

## Constraints

- [Wat expliciet niet in deze customization/feature hoort]
- [Cross-cutting concern dat een andere stage opeist]

## Implementation Steps

> Optioneel — alleen voor grotere items. Geordende stappen waarvan iedere stap zijn eigen `steps/<NN>-<slug>/prompt.md` + `test-prompt.md` krijgt op het moment dat de stap aan de beurt komt.
```

**Skip-regel:** als de folder al bestaat met een ingevulde `SPEC.md`, niet overschrijven. Alleen creëren als hij ontbreekt of een lege placeholder is.

**Cross-references** gebruiken het folder-formaat zodat ze blijven kloppen ongeacht hernummering elders:

- `(zie [Item], customization N in 01-FOUNDATION)` voor foundation-items
- `(zie [Item], customization N in 02-TEMPLATE)` voor template-items
- `(zie [Item], feature N in 03-FEATURES)` voor features

---

## Step 5: Syncing changes

Sync werkt over drie bronnen die in elkaar grijpen. Welke wijzigt bepaalt welke kant je propageert:

**Als `TDD/SPEC.md` is gewijzigd** (nieuwe Core Feature, feature verwijderd, scope veranderd):
- Update de relevante tabel-rij in `TDD/FEATURES.md`. Andere stages onaangeroerd laten
- Maak/verwijder/update de bijbehorende per-folder `SPEC.md` (Summary/Goals/Requirements)
- Houd cross-references consistent — folder-formaat overal

**Als `TDD/FEATURES.md` is gewijzigd** (item toegevoegd, verwijderd, of tussen stages verschoven):
- Update de bijbehorende sectie in `TDD/SPEC.md` Core Features
- Maak de per-folder `SPEC.md` aan in de nieuwe stage / verwijder uit de oude stage. Hernummer als nodig
- Werk cross-references in alle drie stages bij waar het item genoemd wordt

**Als een per-folder `SPEC.md` is gewijzigd** (Summary of Requirements substantieel veranderd):
- Update de eenregel-beschrijving in `TDD/FEATURES.md` tabel-rij
- Update `TDD/SPEC.md` Core Features als de scope-wijziging product-zichtbaar is (een lezer ziet er iets van). Pure interne refactors raken `SPEC.md` niet
- Werk cross-references bij in andere folders die naar dit item verwijzen

Bevestig altijd eerst met de gebruiker wat er gewijzigd is voordat je sync uitvoert. Dat voorkomt dat je drift in een richting propageert die de gebruiker niet bedoelde.

---

## Output

Direct naar `TDD/` in de project-root:

- `TDD/FEATURES.md` voor de roadmap-index
- `TDD/<NN-STAGE>/<NN>-<slug>/SPEC.md` voor elke per-folder stub
- `TDD/SPEC.md` alleen als sync hem ook raakt

Geen `/mnt/user-data/outputs/`-padding meer (Claude Code conventie). Geen `present_files`-aanroep — Claude Code toont diffs natively zodra je `Write` of `Edit` gebruikt.
