# Content stubs

## Summary

Deze foundation-customization vult `content/` met een minimaal maar realistisch demo-tree dat alle render-paden uit de stage-2 customizations dekt: scope-walk (self/children/fallback), folder-based levels (Junior/Mid/Senior als subtree-switch via Levels customization 02), file-based tabs (Tailwind-stijl alternatieve pages via Tabs customization 03), MDC inline `::tabs`-blocks voor kleine alternatives binnen één page, standalone topics zonder children, en een knowledge-base zonder eigen scope. Foundation eindigt pas wanneer dit tree-bed staat — anders kunnen 02-levels, 03-tabs, 04-section-sidebar etc. niet tegen werkelijke variërende content ontwikkelen. De Nuxt-content-template's eigen demo (`getting-started`, `essentials`, `ai`) blijft staan als coverage van de baseline markdown-render-features (callouts, code, embeds, prose).

## Goals

- Alle scope-modes (`self`, `children`, fallback zonder scope) hebben minimaal één demo-pagina zodat de tree-build elke tak kan testen
- `levels: true` heeft een realistische case op sectie-niveau (hele topic in 3 level-folders Junior/Mid/Senior)
- `tabs: true` heeft minstens twee cases: één Tailwind-stijl op section-niveau (installation: vite/postcss/cli) en één geneste binnen een level (variables: let/const/var binnen Junior)
- MDC inline `::tabs`-blocks zijn aanwezig op minstens één pagina voor de browser/node of npm/yarn/pnpm-stijl small-alternatives
- De header-dropdowns hebben genoeg modules om hun zes-categorieën-layout te kunnen tonen
- Een standalone module zonder dropdown-children (alleen index → directe link) is aanwezig zodat de header-edge-case getest wordt
- De Nuxt-content-template baseline-content blijft als markdown-render coverage; wij voegen alleen 1000x-specifieke structuur toe

## Tree-bed

```
content/
├── 1.getting-started/        # baseline-template, blijft staan voor markdown coverage
├── 2.essentials/             # baseline-template, blijft staan voor markdown coverage
├── 3.ai/                     # baseline-template, blijft staan voor markdown coverage
├── index.md                  # site root; scope: self, icon
│
├── 4.lab/                    # standalone module — index only, geen children
│   └── index.md              # scope: self, icon, geen nav of levels of tabs
│                             # → header-item rendert als directe link zonder dropdown
│
├── 5.installation/           # tabs-container op section-niveau (Tailwind-stijl)
│   ├── index.md              # scope: self, icon, tabs: true, nav: [vite, postcss, cli]
│   ├── vite.md               # tab-page, eigen H1, eigen body, eigen ToC
│   ├── postcss.md
│   └── cli.md
│
├── 6.syntax/                 # scope-bound module met meerdere subtopics
│   ├── index.md              # scope: self, icon, nav: [javascript, git]
│   ├── javascript/           # levels-container (Junior/Mid/Senior)
│   │   ├── index.md          # icon, levels: true (of nav: [junior, mid, senior])
│   │   ├── junior/           # level-folder met eigen pagina's
│   │   │   ├── index.md      # icon, intro voor Junior level
│   │   │   ├── 01-variables/ # tabs-container genest binnen een level
│   │   │   │   ├── index.md  # tabs: true, icon, optionele intro
│   │   │   │   ├── let.md    # tab-page; bevat ook MDC ::tabs voor browser/node-snippets
│   │   │   │   ├── const.md
│   │   │   │   └── var.md
│   │   │   ├── 02-functions.md  # gewone single-file pagina binnen level
│   │   │   └── 03-closures.md
│   │   ├── mid/
│   │   │   ├── index.md
│   │   │   ├── 01-async.md
│   │   │   └── 02-modules.md
│   │   └── senior/
│   │       ├── index.md
│   │       ├── 01-event-loop.md
│   │       └── 02-memory.md
│   └── git/                  # standalone subtopic — orphan pages, geen levels of tabs
│       ├── index.md          # scope: self, icon, nav: [basics, branches]
│       ├── basics.md
│       └── branches.md
│
└── 7.kb/                     # Knowledge Base — GEEN scope-veld, valt terug op fallback
    ├── shellcode.md
    └── owasp.md
```

## Coverage-matrix

| Te testen surface | Hoe deze tree dat raakt |
|---|---|
| `scope: self` | `lab/index.md`, `installation/index.md`, `syntax/index.md`, `git/index.md`, `junior/index.md` |
| `scope: children` | optioneel via aanvullende stub; `javascript/index.md` kan deze rol spelen indien gewenst |
| Geen scope (fallback) | `kb/shellcode.md`, `kb/owasp.md` |
| Standalone module, geen dropdown-children | `lab/` (header rendert als directe link) |
| Header-categorie met dropdown | `syntax/` toont `javascript`, `git` in dropdown |
| **`levels: true`** met folder-children | `syntax/javascript/` (Junior/Mid/Senior als level-folders) |
| AppLevelHeader render onder hoofd-header | route inside `/syntax/javascript/...` |
| Effective-scope = actieve level | sidebar onder Junior toont Junior's pagina's |
| **`tabs: true`** op section-niveau (Tailwind-stijl) | `installation/` met vite/postcss/cli als tab-files |
| **`tabs: true`** genest binnen een level | `syntax/javascript/junior/01-variables/` met let/const/var |
| TabBar in-content render onder H1 | route inside `/installation/...` of `/syntax/javascript/junior/01-variables/...` |
| Tabs-container als sidebar-leaf | `installation` en `01-variables` verschijnen als één entry, geen tab-children in sidebar |
| MDC inline `::tabs` binnen een file | `let.md` met browser/node-snippets |
| Orphan pages onder een scope (geen chapter, geen tabs, geen levels) | `git/basics.md`, `git/branches.md` |

## Frontmatter-conventies in de stubs

- Iedere `index.md` heeft minimaal `title` en `icon`; `scope: self|children` waar de matrix het vereist (of bewust afwezig voor fallback-tests)
- `nav: [<slug>, ...]` op `index.md` bepaalt expliciete volgorde van children (slugs, taal-onafhankelijk — zie i18n, customization 02 in 01-FOUNDATION)
- `levels: true` (boolean) of `levels: [<slug>, ...]` (array) op `index.md` markeert een levels-container; build faalt als ook `tabs` gezet is
- `tabs: true` (boolean) of `tabs: [<slug>, ...]` (array) op `index.md` markeert een tabs-container; build faalt als ook `levels` gezet is
- Alle chapter-, scope- en level-`index.md`-files MOETEN `icon` hebben (zie Section sidebar, customization 02 — build-error bij ontbrekend icon)
- Tab-files (children van tabs-container) hebben eigen `title` en optioneel eigen `icon`; de title wordt het tab-label

## Wat NIET in deze customization hoort

- **Geen runtime-implementatie** van level-rendering, tab-rendering of sidebar — die leven in stage-2 customizations 02, 03, 04
- **Geen `<page>.<variant>.<lang>.md`-content** — dat oude per-page-variant-model is afgeschaft; level-content leeft uitsluitend in folders (zie Levels, customization 04)
- **Geen `useNavTree` of build-logic** — alleen content-files met juiste frontmatter
- **Geen vertaling naar EN** voor alle stubs in deze pas; NL-only is voldoende voor stage-2 tests. Per-page `<page>.en.md` mag waar relevant maar is niet verplicht voor het testbed
- **Geen "echte" inhoudelijke pagina's**; korte placeholder-tekst (1-3 paragrafen NL) volstaat. Wel **realistische H2/H3/H4 koppen** op enkele pagina's zodat smart-ToC iets te tonen heeft
- **Geen i18n-strings of locale-specifieke content** in de stubs; UI-strings leven in `i18n/locales/*.json`, niet in content-frontmatter

## Implementation note

Deze stubs zijn pure markdown + frontmatter; geen code-changes nodig. Ze worden onder `content/` toegevoegd zodra Foundation stage 1 (clone + brand + i18n + schema) klaar is en stage 2 (template customizations) start. Geen aparte implementation-step nodig in deze SPEC; één PR voegt de tree toe.
