# 1000x — Onboarding

> Start hier als je nieuw bent in dit project — agent of mens. Eén pagina die laat zien hoe de documentatie georganiseerd is en in welke volgorde je 'm leest.

## TL;DR

Twee bestanden om mee te beginnen, in deze volgorde:

1. **`AGENTS.md`** — canonical project-context, code-style, conventions. Jouw startpunt voor élke task.
2. **`TDD/FEATURES.md`** — de drie-stage roadmap met links naar elke individuele SPEC.

Daarna lees je per task wat relevant is. Het diagram hieronder toont hoe alles aan elkaar hangt.

## Doc-flow

```
                 ┌──────────────────────┐                ┌──────────────────────┐
                 │     CLAUDE.md        │                │     GEMINI.md        │
                 │   (één zin:          │                │   (één zin:          │
                 │   "Lees AGENTS.md")  │                │   "Lees AGENTS.md")  │
                 └──────────┬───────────┘                └──────────┬───────────┘
                            │                                       │
                            └─────────────────┬─────────────────────┘
                                              │
                                              ▼
                          ┌──────────────────────────────────────┐
                          │            AGENTS.md                 │
                          │  (canonical agent context)           │
                          │                                      │
                          │  • Project-intro (wat 1000x is)      │
                          │  • Documentatie-structuur (refs)     │
                          │  • Stack (Nuxt 4, Nuxt UI v4, ...)   │
                          │  • Drie soorten werk (stages)        │
                          │  • Code style samenvatting           │
                          │  • Conventions                       │
                          │  • Componenten / Iconen / Content    │
                          │  • Niet doen                         │
                          │  • Verification commands             │
                          └──────┬─────────────────────┬─────────┘
                                 │                     │
        ┌────────────────────────┼─────────────┬───────┴──────────┬──────────────────┐
        │                        │             │                  │                  │
        ▼                        ▼             ▼                  ▼                  ▼
┌──────────────┐  ┌─────────────────┐  ┌────────────────┐  ┌─────────────┐  ┌──────────────┐
│  TDD/SPEC.md │  │ TDD/FEATURES.md │  │   TDD/         │  │   TDD/      │  │   TDD/       │
│              │  │                 │  │ ARCHITECTURE.md│  │  TOOLING-   │  │  CONTRIBUTING│
│ Productspec  │  │ Drie-stage      │  │                │  │ STRATEGY.md │  │  .md         │
│ "wat het     │  │ roadmap-index   │  │ Twee scal-     │  │             │  │              │
│  systeem     │  │ + per-stage     │  │ regels +       │  │ ESLint conf,│  │ Proces +     │
│  doet"       │  │ tabellen        │  │ Pinia-path +   │  │ VSCode,     │  │ classifi-    │
│              │  │                 │  │ OOTB-first     │  │ EditorCfg   │  │ catie van    │
│              │  │                 │  │ data-flow      │  │             │  │ werk         │
└──────────────┘  └────────┬────────┘  └────────────────┘  └─────────────┘  └──────────────┘
                           │
                           │  (FEATURES.md is de directory-spil — links per stage)
                           │
        ┌──────────────────┼───────────────────────┬────────────────────────┐
        │                  │                       │                        │
        ▼                  ▼                       ▼                        ▼
┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 01-FOUNDATION/ │  │  02-TEMPLATE/    │  │  03-FEATURES/    │  │  Per item:       │
│                │  │                  │  │                  │  │                  │
│ SCAFFOLDING.md │  │ README.md        │  │ README.md        │  │  SPEC.md         │
│ FOUNDATION.md  │  │ ↓ bevat de       │  │ ↓ bevat trigger- │  │  + optioneel     │
│ README.md      │  │   OOTB-first     │  │   criteria voor  │  │  steps/          │
│                │  │   decision-rule  │  │   stage-3 work   │  │  (prompt.md +    │
│ Items:         │  │                  │  │                  │  │  test-prompt.md) │
│ 01-branding    │  │ Items 01..13:    │  │ Items 01..10:    │  │                  │
│ 02-i18n        │  │ markdown-rendr   │  │ edit-met-drafts  │  └──────────────────┘
│ 03-content-    │  │ section-sidebar  │  │ content-mgmt     │
│   stubs        │  │ header           │  │ settings         │
│                │  │ levels           │  │ code-editor      │
└────────────────┘  │ tabs             │  │ card-trainer     │
                    │ page-chrome      │  │ comments         │
                    │ right-panel      │  │ mobiele-layout   │
                    │ smart-toc        │  │ pwa-offline      │
                    │ changelog        │  │ toegang-private  │
                    │ prev-next        │  │ ai-assistent     │
                    │ search           │  │                  │
                    │ math-en-diagrm   │  │                  │
                    │ image-lightbox   │  │                  │
                    └──────────────────┘  └──────────────────┘
```

## Concrete reading-volgorde voor een fresh agent

1. Claude Code start → leest **`CLAUDE.md`** automatisch (default behavior)
2. CLAUDE.md zegt: *"Lees `AGENTS.md`"*
3. Agent leest **`AGENTS.md`** → krijgt project-intro, drie-stage structuur, code-style, en doc-pointers
4. Voor de specifieke task pakt de agent de relevante doc:

| Vraag | Doc om te lezen |
|---|---|
| Wat moet feature X doen? | **`TDD/SPEC.md`** of de feature-eigen `SPEC.md` in `TDD/02-TEMPLATE/<n>/` of `TDD/03-FEATURES/<n>/` |
| Welke volgorde? | **`TDD/FEATURES.md`** |
| Hoe structureer ik composables / state / data-flow? | **`TDD/ARCHITECTURE.md`** |
| Wat is de OOTB-first regel? | **`TDD/02-TEMPLATE/README.md`** § Decision-rule |
| Welke ESLint / VS Code config? | **`TDD/TOOLING-STRATEGY.md`** |
| Hoe classificeer ik mijn PR? | **`TDD/CONTRIBUTING.md`** |
| Stap-voor-stap setup van foundation? | **`TDD/01-FOUNDATION/SCAFFOLDING.md`** |

## Voor mensen die het project openen

Als je een mens bent en dit project voor het eerst ziet:

- Lees deze pagina (`ONBOARDING.md`) voor de oriëntatie
- Skim `AGENTS.md` voor stack + drie-stage structuur
- Open `TDD/FEATURES.md` voor de roadmap
- Klik door naar de specifieke `SPEC.md` van wat je wil bouwen of begrijpen

## Bestandsstructuur op een rij

```
1000x/                         # repo root
├── ONBOARDING.md              # ← jij bent hier
├── CLAUDE.md                  # → AGENTS.md
├── GEMINI.md                  # → AGENTS.md
├── AGENTS.md                  # canonical agent context
├── README.md                  # project-intro voor github / mens-eerste lezers
├── LICENSE
├── .gitignore
│
├── TDD/                       # alle planning + specs
│   ├── SPEC.md                # productspec (wat het systeem doet)
│   ├── FEATURES.md            # roadmap-index met links
│   ├── ARCHITECTURE.md        # twee scalability-regels + Pinia-path + OOTB-flow
│   ├── CONTRIBUTING.md        # proces + classificatie
│   ├── TOOLING-STRATEGY.md    # ESLint / VS Code / EditorConfig deep-dive
│   │
│   ├── 01-FOUNDATION/         # stage 1: setup
│   │   ├── SCAFFOLDING.md
│   │   ├── FOUNDATION.md
│   │   ├── README.md
│   │   └── 01-branding/, 02-i18n/, 03-content-stubs/
│   │
│   ├── 02-TEMPLATE/           # stage 2: 13 customizations bovenop docs-template
│   │   ├── README.md          # bevat de OOTB-first decision-rule
│   │   └── 01-markdown-rendering/ ... 13-image-lightbox/
│   │
│   └── 03-FEATURES/           # stage 3: 10 echte features
│       ├── README.md
│       └── 01-edit-met-drafts/ ... 10-ai-assistent/
│
├── app/                       # Nuxt source
├── content/                   # markdown content
├── server/                    # server routes
├── tests/                     # Vitest unit + Playwright E2E
└── ... (Nuxt-standard files)
```

## Nog te beginnen

Het project zit nog in de planning-fase: alle SPECs zijn geschreven, de implementatie gaat starten via `TDD/01-FOUNDATION/SCAFFOLDING.md` sectie 1. Foundation eerst, dan template-customizations in volgorde, dan features.
