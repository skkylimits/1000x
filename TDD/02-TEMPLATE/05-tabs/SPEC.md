# Tabs

## Summary

Deze customization voegt **file-based content-tabs** toe — een tab-bar in de content-kolom (onder H1, voor body) waarmee een reeks alternatieve sibling-pagina's getoond wordt als tabs. Iedere tab is een eigen markdown-file in dezelfde folder als een `index.md` met `tabs: true`. Klik een tab → URL navigeert naar die file. Voor pagina's die alternatieve invalshoeken aanbieden waarvoor je naar specifieke tabs wil kunnen linken (Tailwind-stijl: Vite/PostCSS/CLI installation; Microsoft-stijl: CLI/Portal/PowerShell), in tegenstelling tot kleine inline-alternatieven die in een MDC `::tabs`-block thuishoren (zie Markdown rendering, customization 01).

## Goals

- Auteurs schrijven elke tab als een eigen markdown-file zodat de individuele tabs hanteerbaar blijven en losstaand kunnen worden bewerkt
- Lezers krijgen per tab een eigen URL (deelbaar, indexeerbaar door search), eigen ToC, eigen scroll-positie
- Pagina's zonder `tabs: true` op hun parent-directory tonen geen tab-bar; geen lege chrome op gewone pagina's
- De tab-bar voelt visueel onderdeel van de content (in-content, onder H1), niet van het page-frame — anders dan AppLevelHeader die wél chrome is
- Tabs en levels zijn onafhankelijk: een tab-page kan onder een level-folder leven, en een tab-page mag in z'n body óók nog inline MDC `::tabs`-blocks gebruiken

## Requirements

### Frontmatter-contract

- Een directory wordt een tabs-container door `tabs: true` (boolean) of `tabs: [<slug>, ...]` (geordende array van slug-namen) op zijn `index.md` te zetten
- De directe children van een tabs-container zijn **files** (`.md`); iedere file is een tab
- De `index.md` zelf telt niet als tab; het mag intro-tekst bevatten die boven de tab-bar verschijnt op de hub-route, of leeg blijven als de hub direct redirect naar de eerste tab
- Iedere tab-file heeft een eigen `title` in de frontmatter; deze wordt gebruikt als tab-label
- Een directory mag NIET tegelijk `tabs: true` én `levels: true` hebben; build faalt op die combinatie

### Rendering — TabBar in-content

- De TabBar wordt automatisch geïnjecteerd door de page-renderer wanneer de huidige route's parent-directory een tabs-container is — geen handmatig `::tab-bar`-block in elk markdown-file
- De TabBar verschijnt **direct onder de H1** van de page, vóór de body-content
- De TabBar toont één tab per child-file met de file's `title` als label; eventueel met icon als de file frontmatter een `icon` heeft
- De active tab is gemarkeerd op basis van de huidige URL; de active-state-underline landt op de container-divider zonder gat ertussen, consistent met andere active-state-stylings
- Bij overflow scrollt de tab-rij horizontaal (touch-swipe, trackpad-scroll, shift+scrollwheel — allemaal native); een subtiele schaduw aan de zichtbare rand signaleert dat er meer is

### Sidebar-gedrag

- Een tabs-container verschijnt in de sidebar als **één leaf-entry** (niet als chapter met children); de tab-files zijn niet zichtbaar in de sidebar
- Klik op de tabs-container in de sidebar → navigatie naar de tabs-container's hub-route (`/<…>/index.md`); page-renderer laadt de hub of redirect naar eerste tab afhankelijk van of de hub eigen content heeft
- De sidebar-entry van de tabs-container is active wanneer de huidige route exact de container-pad is OF een descendant ervan (one-of-the-tabs)

### Volgorde

- Wanneer `tabs` als array opgegeven is (`tabs: [vite, postcss, cli]`), volgt de TabBar die volgorde
- Wanneer `tabs: true` zonder array, valt de volgorde terug op alfabetisch op file-slug
- Bij `nav: [...]` op de tabs-container's `index.md` wint die over de `tabs`-array (consistent met de overall ordering-resolver)

### Combinatie met andere features

- Een tab-file kan in zijn body inline MDC `::tabs`-blocks gebruiken voor kleine alternatieven (npm/yarn/pnpm-stijl); deze leven naast de file-based TabBar zonder conflict (zie Markdown rendering, customization 01)
- Een tabs-container mag onder een levels-folder leven (`/javascript/junior/01-variables/index.md` met `tabs: true`); levels en tabs zijn flags op verschillende directories
- Native Nuxt Content prev/next walks normaal door de tree; voor pages onder een tabs-container kan prev/next overgeslagen of gefilterd worden (zie Prev/next, customization 10)

### Persistence en deelbaarheid

- De gekozen tab wordt vastgelegd in de URL (`/installation/vite`); geen querystring nodig
- Bij hernieuwd bezoek aan de tabs-container's hub-route zonder explicit tab kan een redirect plaatsvinden naar de eerste tab uit de volgorde

### Toegankelijkheid

- TabBar is volledig toetsenbord-bedienbaar; pijltjes-toetsen schakelen tussen tabs, `Enter` activeert (WCAG 2.1 AA)
- Iedere tab heeft een toegankelijke naam (de title); icon-only bij overflow toont label als tooltip op hover/focus
- Focus volgt de actieve tab na navigatie

## Constraints

- **Geen file-suffix-collapse** of MDC-magic; tab-content leeft uitsluitend in losse `.md`-files in dezelfde folder
- **Geen tab-rij in de chrome** (geen sub-header); TabBar leeft in de content-kolom onder H1
- **Geen tab-children in de sidebar**; de tabs-container is een sidebar-leaf
- **Geen mengvorm met `levels: true`** op dezelfde directory; één directory heeft maximaal één van beide flags
- **Geen automatische cross-tab prev/next** in de body-rendering; tabs zijn alternatieven, geen sequentie. Prev/next-walks blijven page-niveau (en kunnen tabs-children helemaal overslaan)
- **MDC inline `::tabs`-blocks zijn NIET deze customization** — die leven in Markdown rendering (customization 01) en zijn voor kleine inline alternatieven (≤10 regels per tab, geen aparte URL nodig)
