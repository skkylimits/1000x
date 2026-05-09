# Wiskundige formules en diagrammen

## Summary

Markdown-pagina's kunnen wiskundige formules en diagrammen bevatten via KaTeX (formules) en Mermaid (diagrammen). Beide zijn opt-in per pagina zodat de runtime-payload niet groeit voor content die deze features niet gebruikt. Vooral relevant voor cryptografie-formules, complexity-analyse, attack-flows en architectuur-diagrammen.

## Goals

- Auteurs kunnen wiskundige formules schrijven in markdown zonder afbeeldingen of LaTeX-screenshots
- Auteurs kunnen diagrammen schrijven als tekst in markdown — version-controlled, diff-baar, leesbaar in de bron
- Lezers zien correct gerenderde formules en diagrammen die meeschalen met theme en font-size
- Pagina's zonder formules of diagrammen krijgen geen extra runtime-payload

## Requirements

- KaTeX-syntax voor wiskunde: `$inline formule$` voor inline, `$$block formule$$` voor display-niveau
- Mermaid-syntax voor diagrammen: standaard markdown code-block met language `mermaid`
- Diagrammen ondersteunen tenminste flowcharts, sequence diagrams en class/ER-diagrammen — Mermaid's eigen scope
- Rendering past zich aan bij light/dark mode — diagram-kleuren en formule-typografie volgen de theme
- Runtime is opt-in per pagina: de KaTeX/Mermaid-libraries laden alleen op pagina's die ze daadwerkelijk gebruiken (detectie via frontmatter-vlag óf content-scan)
- Render-fouten in een formule of diagram laten de pagina niet crashen — fallback naar de raw bron met een dev-warning

## Technical

Conform de project-brede regel uit `spec.md`: eerst checken of Nuxt UI v4 / Nuxt Content het levert, dan een ecosystem-package inzetten, en pas als laatste eigen werk.

### Uit de doos — geen werk

- Niets specifiek voor deze feature; KaTeX en Mermaid zijn geen onderdeel van Nuxt UI of Nuxt Content's basis-set

### Configureren — kleine werk

- **KaTeX** via een **remark-plugin** in `nuxt.config.ts` onder `content.build.markdown.remarkPlugins`. De gebruikelijke keten is `remark-math` + `rehype-katex` (of `remark-katex` als single-package alternatief). KaTeX-CSS importeren in de globale stylesheet
- **Mermaid** via een Nuxt Content-extensie of een rehype-plugin die `pre code.language-mermaid` blocks transformeert naar een Mermaid-render. Op het moment van implementatie checken of er een `nuxt-mermaid` of vergelijkbaar pakket bestaat dat dit out-of-the-box doet
- **Theme-binding voor Mermaid**: configureren via `useColorMode` zodat diagram-kleuren mee-flippen bij light/dark switch — Mermaid heeft een `theme: 'dark' | 'default'` config-optie
- **Lazy loading** voor beide libraries: alleen importeren wanneer een pagina een math- of mermaid-block bevat. Optie 1 — frontmatter-vlag (`math: true` of `mermaid: true`) die de page-component leest om de runtime te laden. Optie 2 — content-scan tijdens build die het automatisch markeert. Optie 1 is simpeler, optie 2 is foutloos. Beslissen bij implementatie

### Zelf bouwen — echt werk

- **Auto-detectie van math/mermaid blocks** als we voor optie 2 boven gaan — een rehype-pass die de aanwezigheid markeert in page-meta zodat de page-component weet of de runtime nodig is
- **Error-fallback** voor render-fouten: als KaTeX of Mermaid een syntax-fout gooit, de raw bron tonen met een rode rand en een dev-warning. Niet de hele pagina laten crashen

### Open punten voor implementatie

- Of we lazy-loading via frontmatter-vlag of via auto-detectie doen — auto is robuuster maar vraagt iets meer infra
- Welk Nuxt-pakket voor Mermaid het meest onderhouden is op moment van implementatie — even rondkijken bij start van deze feature
