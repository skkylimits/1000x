# Section sidebar

## Summary

Deze customization vervangt de auto-sidebar van de Nuxt UI docs-template door één scope-bound navigatie-tree die zichzelf bouwt uit het filesystem en frontmatter, en alle nav-surfaces voedt: sidebar, header-dropdowns (zie Header, customization 03), prev/next (zie Prev/next, customization 10), smart ToC (zie Smart ToC, customization 08), breadcrumb (zie Page chrome, customization 06), AppLevelHeader (zie Levels, customization 04) en TabBar (zie Tabs, customization 05). Resultaat is dezelfde plek in de UI maar fundamenteel ander gedrag: scope-grenzen, doorlopende active-line, en een tree die levels-containers en tabs-containers correct interpreteert in plaats van een platte auto-sidebar. Voor lezers die per module een afgebakende navigatie willen in plaats van een endless tree, en voor auteurs die hun structuur uitsluitend in markdown bepalen.

## Goals

- Lezers krijgen scope-bound navigatie per module in plaats van de hele site-tree
- De sidebar wordt de gedeelde tree-bron voor alle andere nav-surfaces (header-dropdowns, prev/next, smart ToC, breadcrumb, level-header, tab-bar)
- De tree kent het verschil tussen gewone pagina's, chapters, levels-containers en tabs-containers; iedere consumer leest één veld (`kind`) en weet wat te doen
- Lokale tree-mutaties uit In-app content management (zie feature 02 in 03-FEATURES) verschijnen direct in de sidebar zonder full reload

## Requirements

### Tree-build

- De navigatie-tree wordt opgebouwd uit drie lagen die samengevoegd worden: filesystem-walk, frontmatter (per pagina en per directory `index.md`), en lokale tree-mutaties (zie In-app content management, feature 02 in 03-FEATURES)
- Iedere node in de tree krijgt een `kind`-veld:
  - `'page'` — een gewone single-file pagina
  - `'chapter'` — een directory met child-pages, geen levels of tabs flag
  - `'levels-container'` — een directory met `levels: true` of `levels: [...]` op zijn `index.md`
  - `'tabs-container'` — een directory met `tabs: true` of `tabs: [...]` op zijn `index.md`
  - `'level'` — een directory die direct child is van een levels-container
  - `'tab'` — een file of directory die direct child is van een tabs-container
- Een directory's `index.md` rendert als de directory zelf en verschijnt nooit als kind van zichzelf in de tree (`index.md`-hoist)
- Een directory mag NIET tegelijk `levels: true` én `tabs: true` hebben; build faalt met een heldere error op deze combinatie
- Volgorde-prioriteit: expliciete `nav: [...]` array op slugs in directory's `index.md` > `order: N` per pagina > alfabetisch op title; voor levels-containers en tabs-containers wint `nav: [...]` ook over de `levels: [...]` / `tabs: [...]` array

### Scope walk-up en effective scope

- Een directory's `index.md` bepaalt of die directory een sidebar-scope-grens is via één frontmatter-veld met de waarden `'self'`, `'children'` of geen veld (erft van parent)
- Walk-up-algoritme bepaalt de actieve scope: vanaf de huidige route omhoog tot de eerste node met expliciete scope-waarde; geen match betekent fallback naar de top-level categorie
- Wanneer de gevonden scope een **levels-container** is, wordt de **effective scope** voor sidebar-rendering de actieve **level** (de descendant op het pad), niet de levels-container zelf. AppLevelHeader handelt het switchen tussen levels op chrome-niveau af
- Een platte lookup-structuur naast de tree garandeert constant-time scope-walks per page-change

### Sidebar-rendering

- Scope-label bovenaan met verplicht icon; daaronder chapters met chevron rechts of pages direct in een ingesprongen container; pages zonder chapter staan in dezelfde container alsof er een onzichtbaar standaard-chapter is
- Pages binnen één container delen één doorlopende verticale lijn aan de linkerkant: grijs voor inactief, info-kleur op de hoogte van de actieve pagina, zonder dubbele lijnen of gat (per-item `border-left` van 1.5px, default tertiary-border-kleur, swapt naar info-kleur op active)
- Iedere chapter en scope-label heeft een verplicht icon uit de frontmatter; ontbrekend icon levert een build-error
- **Levels-containers** verschijnen NIET als sidebar-entries; ze worden door AppLevelHeader op chrome-niveau afgehandeld. De sidebar toont alleen children van de actieve level
- **Tabs-containers** verschijnen wél als sidebar-entries maar gerenderd als **leaf** (één entry, geen chevron, geen children-rendering). Hun tab-children leven uitsluitend in de TabBar in-content (zie Tabs, customization 05), niet in de sidebar
- Active-state-detectie: een sidebar-entry is active wanneer `route.path === node.path` OF `route.path.startsWith(node.path + '/')` (zodat een tabs-container active is wanneer een van zijn tabs actief is)
- Sidebar-collapse-state per chapter wordt onthouden tussen sessies (zie Settings, feature 03 in 03-FEATURES)
- Tijdens SSG bevat de initiële render alleen filesystem + frontmatter; lokaal aangemaakte items verschijnen pas na hydratie en zijn per definitie privé

### Composable architectuur

- Alle nav-surfaces lezen de tree via één composable `useNavTree()` als single source; geen component roept direct `queryCollection` aan en geen logica wordt gedupliceerd — dit houdt In-app content management (feature 02 in 03-FEATURES) chirurgisch in plaats van een refactor
- Geen state-manager in deze customization: read-side blijft puur composable. De tree-build is een pure functie met een optionele overlay-parameter die nu leeg is; In-app content management (feature 02 in 03-FEATURES) vult die parameter en voegt de write-side toe (zie `ARCHITECTURE.md` § Pinia-migratiepath)
- De auto-sidebar-rendering van de baseline-template wordt vervangen omdat scope-bound rendering OOTB niet bestaat. **De data-laag eronder blijft OOTB**: `queryCollection('docs')` voedt onze tree, `useAsyncData` cachet, andere consumers (search, navigation provide) blijven met Nuxt Content's API werken. We vervangen alleen het sidebar-render-pad en de tree-interpretatie; geen rebuild van het content-systeem
- Iedere navigatie-actie is toetsenbord-bedienbaar (WCAG 2.1 AA)

## Constraints

**Niet hier — andere features eigenen het op:**

- Geen search-input, command-palette of `Cmd+K` in de sidebar; hoort bij Search (customization 11)
- Geen drag-and-drop reordering of inline rename-op-hover; hoort bij In-app content management (feature 02 in 03-FEATURES) en View / Edit-toggle (feature 01 in 03-FEATURES)
- Geen TabBar of AppLevelHeader rendering in de sidebar; die leven respectievelijk in-content (Tabs, customization 05) en in chrome (Levels, customization 04)
- Geen locale-switcher (zie i18n, customization 02 in 01-FOUNDATION), theme-toggle of settings-paneel (feature 03 in 03-FEATURES), of changelog-indicator (customization 09) in de sidebar
- Geen breadcrumb-fragment ín de sidebar; breadcrumb is een eigen surface (Page chrome, customization 06)

**UX dat de spec niet vraagt:**

- Geen accordion-mode (auto-collapse van sibling-chapters); meerdere chapters tegelijk expanded is expliciet toegestaan
- Geen sticky scope-label tijdens scroll, geen custom scrollbar styling
- Geen counts/badges naast chapters (`12 pages`), geen pinning, favorites of "recently visited"-sectie
- Geen hover-preview van pagina-content, geen tooltips op chapter-icons; WCAG accessible names volstaan
- Geen loading skeletons — SSG levert de echte content op first paint
- Animaties beperken tot chevron-rotatie en chapter-height-collapse; geen panel slide-ins of fades
- Auto-scroll-to-active op mount mag, maar alleen via `scrollIntoView({ block: 'nearest' })` — geen intersection-observer-tracking of viewport-bookkeeping

**Architectuur en dependencies:**

- Geen Pinia, Vuex of andere state-manager in deze customization; `useNavTree()` blijft de enige toegang. De write-side komt pas in feature 02 in 03-FEATURES (zie `ARCHITECTURE.md`)
- Geen VueUse-dep voor de localStorage-wrapper rond collapse-state; inline of een lokale composable is voldoende
- Geen swappable storage-adapters, generieke `<Tree>`-component, event-bus, plugin-systeem of provider-pattern bovenop de composable — abstractie pas bij een tweede concreet gebruik
- Geen Zod-validatie over de hele tree; alleen de frontmatter-contracten (`scope`, `icon`, `nav`, `order`, `levels`, `tabs`) valideren
- Geen memoization- of caching-laag bovenop de tree-walk vóórdat er een meetbaar performance-probleem is
- Geen telemetrie of analytics op nav-clicks
- **Geen file-suffix-collapse** voor varianten; levels en tabs zijn folder-based (zie Levels, customization 04 en Tabs, customization 05)

**Test- en tooling-grenzen:**

- Geen E2E-tests voor levels of tabs edge-cases voordat Levels (customization 02) en Tabs (customization 03) daadwerkelijk leven
- Geen Storybook entries voor sub-states; Playwright tegen echte routes is het toetsbed
- Geen ARIA-overload (`role=tree` + `aria-level` + `aria-setsize`); leun op de primitieven die Nuxt UI levert

**Scope-discipline:**

- Geen demo-chapter, voorbeeld-pagina of hardcoded starter-content onder de scope-label; alle content leeft in `content/`
- Geen nieuwe frontmatter-velden zonder requirement in deze of een gelinkte customization
- Geen "opfris-refactor" van bestaande sidebar-code buiten wat deze SPEC vraagt
- Geen eigen icon-collectie aanmaken bovenop de scaffold totdat er echte custom icons nodig zijn

## Implementation Steps

Drie geordende, reviewbare stappen. Elke stap is groot genoeg om een zinvol stuk gedrag op te leveren en klein genoeg om in één review-sessie door te lopen. Per stap krijgt de bijbehorende map onder `steps/` straks een `prompt.md` (de Claude Code task) en een `test-plan.md` (groen-criteria), opgesteld op het moment dat de stap aan de beurt komt — niet preemptief.

### Step 1 — Tree-build & `useNavTree()` composable

Het pure data-fundament zonder UI-wijziging. Walkt de `docs`-collection, parseert frontmatter, bouwt de hiërarchische tree én de platte lookup, en stelt `useNavTree()` beschikbaar als single source voor elke nav-surface die er straks op leunt — header (customization 03), AppLevelHeader (customization 04), TabBar (customization 05), breadcrumb (customization 06), smart ToC (customization 08) en prev/next (customization 10) lezen allemaal uit deze ene composable. Faalt de build met een heldere error op een ontbrekend `icon` op een chapter-, scope-label- of level-node, of op een directory die zowel `levels` als `tabs` declareert. Bestaande sidebar blijft ongewijzigd op zijn baseline-render draaien.

**Wat erin zit:**

- `buildTree(pages, overlay?)` als pure functie; `overlay`-parameter is aanwezig maar wordt als no-op behandeld (In-app content management, feature 02 in 03-FEATURES, vult 'm)
- `index.md`-hoist: directory's `index.md` wordt de directory-node en verschijnt nooit als kind van zichzelf; de `index.md`-frontmatter wint voor de directory
- Kind-detection per node: `'page' | 'chapter' | 'levels-container' | 'tabs-container' | 'level' | 'tab'`, afgeleid uit frontmatter (`levels`, `tabs`) en parent-context
- Order-resolver: expliciete `nav: [...]` op directory's `index.md` > `order: N` per pagina > alfabetisch op title; voor levels-containers en tabs-containers wint `nav: [...]` ook over de `levels: [...]` / `tabs: [...]`-array
- Frontmatter-contract validatie: ontbrekend `icon` op chapter/scope-label/level → throw met file-pad in de message; tegelijk `levels` én `tabs` op één directory → throw
- Walk-up scope-resolver: vanaf een routePath omhoog tot de eerste node met expliciete `scope: 'self' | 'children'`; geen match → fallback naar de top-level ancestor
- Walk-up effective-scope-resolver: bij scope = levels-container is de effective scope de actieve level-folder op het pad (AppLevelHeader handelt het level-switchen straks zelf af op chrome-niveau)
- Platte `lookup` Map<path, NavNode> naast de hiërarchische tree, voor constant-time scope-walks per page-change
- `useNavTree()` als Nuxt composable, backed by `useState` zodat alle nav-surfaces SSR/CSR dezelfde tree zien zonder dubbele content-fetches
- Derived composables `useCurrentScope()`, `useEffectiveScope()`, `useBreadcrumb()` als pure computeds bovenop `useNavTree()` + `useRoute()`

**Wat eruit blijft:**

- Geen UI-werk; `SectionSidebar.vue` blijft op zijn baseline-render draaien tot Step 2
- Geen overlay-merge (feature 02 in 03-FEATURES); `overlay`-parameter blijft no-op
- Geen `usePrevNext` of flatten-walk; prev/next consumeert `useNavTree` straks, maar de logica leeft in customization 10 in 02-TEMPLATE
- Geen AppLevelHeader-rendering (customization 04 in 02-TEMPLATE) of TabBar-rendering (customization 05 in 02-TEMPLATE); deze stap markeert alleen `kind`
- Geen persistence, keyboard nav of WCAG-uitwerking (Step 3)

**Tests:**

- Unit (Vitest) over `buildTree`: basis tree-shape, `index.md`-hoist, platte `lookup`-mapping
- Unit over kind-detection: alle zes kinds (`page`, `chapter`, `levels-container`, `tabs-container`, `level`, `tab`) correct geclassificeerd vanuit synthetic frontmatter-fixtures
- Unit over de order-resolver: `nav: [...]` overrulet, `order: N` daarna, alfabetisch op title als fallback; slugs niet in `nav` vallen aan de staart in alfabetische volgorde; `nav` overrulet ook `levels: [...]` en `tabs: [...]`
- Unit over icon-validatie: ontbrekend `icon` op chapter, scope-label of level throwt met de file-pad in de message; leaf-pages zonder icon throwen niet
- Unit over flag-conflict: `levels: true` én `tabs: true` op dezelfde directory throwt met de offending path
- Unit over `walkScope`: declared scope wordt gevonden, walk-up stopt bij eerste expliciete waarde, fallback naar top-level wanneer geen scope op het pad, unknown route → `null`
- Unit over `walkEffectiveScope`: bij levels-container ancestor levert het de actieve level-folder op het pad; bij gewone scope levert het dezelfde node als `walkScope`; op de levels-container's eigen `index.md`-route levert het de levels-container zelf
- Unit over `walkBreadcrumb`: bekend pad → `[root, ..., current]`; onbekend pad → `[]`
- Geen E2E — er verandert niets aan de UI

### Step 2 — Scope-bound sidebar UI

Vervangt de auto-sidebar uit de Nuxt UI docs-template door tree-driven rendering uit `useNavTree()` + `useEffectiveScope()`. Implementeert het visuele model: scope-label met verplicht icon, chapters met chevron, orphan-pages in een impliciete container, één doorlopende verticale lijn met info-gekleurde active-positie, tabs-containers als leaf-entries en levels-containers volledig onzichtbaar (chrome leeft straks in AppLevelHeader). Active-state via path-prefix-match zodat een tabs-container active is wanneer één van zijn tabs in de URL staat.

**Wat erin zit:**

- `SectionSidebar.vue` consumeert `useNavTree()` + `useEffectiveScope()` + `useRoute()`
- Scope-label bovenaan met verplicht icon en titel uit de huidige effective scope (bij levels-actief: de level-folder's icon en titel, niet die van de levels-container)
- Chapters met chevron rechts; expanded toont children in een ingesprongen container
- Orphan-pages (geen chapter-parent) renderen in dezelfde ingesprongen container alsof er een onzichtbaar standaard-chapter is, met gedeelde verticale lijn
- Tabs-containers renderen als leaf-entry — geen chevron, tab-children worden NIET in de sidebar getoond (ze leven in de TabBar in-content, customization 05 in 02-TEMPLATE)
- Levels-containers verschijnen NIET als sidebar-entries; de sidebar toont alleen de children van de **actieve level**
- Active-line: per-item `border-left` van 1.5px; actieve pagina krijgt info-kleur, inactieve siblings de tertiary-border-kleur — één doorlopende lijn zonder dubbele linies of gat
- Active-state-detectie: `route.path === node.path` OF `route.path.startsWith(node.path + '/')`, zodat een tabs-container active is wanneer een van zijn tabs open is
- `aria-current="page"` op het actieve link
- Auto-sidebar van de baseline-template (`UContentNavigation`) verwijderd uit het render-pad; ESLint-rule of CI/grep-check weigert nieuwe imports

**Wat eruit blijft:**

- Collapse-state alleen runtime in deze stap; persistence over sessies komt in Step 3
- Keyboard navigatie beperkt tot wat de browser default doet; roving tabindex en pijltjes-handlers komen in Step 3
- Lokale tree-mutaties (feature 02 in 03-FEATURES) zijn niet zichtbaar — `overlay`-parameter blijft leeg

**Tests:**

- E2E (Playwright): scope-label rendert met icon en titel uit het `index.md` van de huidige effective scope; bij levels-actief is dat de level-folder, niet de levels-container
- E2E: chapter expand/collapse via klik; meerdere chapters tegelijk expanded werkt (geen accordion)
- E2E: actief item krijgt `aria-current="page"` en de info-gekleurde `border-left`; inactieve siblings hebben tertiary-border-kleur
- E2E: navigeren naar een pagina in een andere scope wisselt de sidebar-content
- E2E: orphan-pages renderen in dezelfde ingesprongen container met gedeelde verticale lijn
- E2E: een tabs-container verschijnt als leaf-entry; klikken navigeert naar de hub-route; tabs-children NIET zichtbaar in sidebar
- E2E: een tabs-container is active in de sidebar wanneer een van zijn tabs in de URL staat
- E2E: een levels-container verschijnt NIET als entry; alleen children van de actieve level worden getoond, en switchen tussen levels (via een dummy AppLevelHeader-link of directe URL) wisselt de getoonde children
- CI- of grep-check: geen imports van `UContentNavigation` meer in `app/`

### Step 3 — Persistence, keyboard nav & WCAG 2.1 AA

Laatste stap die de sidebar productie-rijp maakt. Collapse-state per chapter persisteert via een dunne `settingsStore`-wrapper rond localStorage; Settings (feature 03 in 03-FEATURES) hergebruikt straks dezelfde interface zonder de sidebar aan te passen. Volledige keyboard-navigatie met roving tabindex, pijltjes-handlers en focus-visible styling die WCAG 2.1 AA passeert.

**Wat erin zit:**

- `useSidebarCollapse()` composable schrijft via een `settingsStore`-wrapper rond localStorage; geen externe dep, geen VueUse
- Roving tabindex binnen de sidebar als één focus-group
- Toetsenbord-handlers: ↑/↓ tussen items in visuele volgorde, ←/→ collapse/expand op chapter-buttons, `Enter` activeert link
- Focus-visible styling via een data-attribute, niet op default `:focus`
- Accessible names op elk interactief element; geen tooltip-overlay
- E2E coverage voor collapse-persistence-over-reload en de volledige keyboard-flow

**Wat eruit blijft:**

- Drag-and-drop reordering (feature 02 in 03-FEATURES)
- Inline rename / context-menu-acties (feature 01 + feature 02 in 03-FEATURES)
- Alles dat in `## Constraints` expliciet als "niet hier" gemarkeerd staat

**Tests:**

- E2E (Playwright): collapse-state per chapter overleeft een page-reload
- E2E: meerdere chapters kunnen onafhankelijk gecollapsed/expanded zijn; beide states overleven reload
- E2E: `Tab` brengt focus de sidebar in; ↑/↓ navigeert tussen focusable items in visuele volgorde
- E2E: ←/→ op een chapter-button collapse/expand met juiste `aria-expanded`-update
- E2E: `Enter` op een gefocuste page-link navigeert naar die pagina
- E2E: focus-visible ring (`data-focus-visible="true"`) verschijnt alleen na keyboard focus, niet na muis-klik
- Unit/integration: `useSidebarCollapse()` schrijft via de `settingsStore`-interface, niet rechtstreeks naar `localStorage`, zodat Settings (feature 03 in 03-FEATURES) dezelfde interface kan hergebruiken
- A11y: elk interactief element heeft een toegankelijke naam; geen `role="tree"`, `aria-level` of `aria-setsize` in de markup
- Optioneel: `@axe-core/playwright` smoke test op een representatieve pagina, zero `serious` of `critical` violations
