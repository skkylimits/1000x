# Sidebar replacement

## Summary

Deze customization vervangt de auto-sidebar van de Nuxt UI docs-template door de scope-bound versie uit Section sidebar (feature 2), inclusief variant-collapse uit Sub-header met variant-tabs (feature 8). Resultaat is dezelfde plek in de UI maar fundamenteel ander gedrag: scope-grenzen, doorlopende active-line en variant-collapse in plaats van een platte auto-sidebar. Voor lezers die per module een afgebakende navigatie willen in plaats van een endless tree.

## Goals

- Lezers krijgen scope-bound navigatie per module in plaats van de hele site-tree
- De sidebar wordt de gedeelde tree-bron voor alle andere nav-surfaces (header-dropdowns, prev/next, smart ToC, breadcrumb)
- Variant-files collapsen tot één logische node zodat de sidebar niet vervuild wordt door drie versies van dezelfde pagina
- Lokale tree-mutaties uit In-app content management (feature 11) verschijnen direct in de sidebar zonder full reload

## Requirements

- De navigatie-tree wordt opgebouwd uit drie lagen die samengevoegd worden: filesystem-walk, frontmatter (per pagina en per directory `index.md`), en lokale tree-mutaties (zie In-app content management, feature 11)
- Een directory's `index.md` bepaalt of die directory een sidebar-scope-grens is via één frontmatter-veld met de waarden "self", "children" of geen veld (erft van parent)
- Walk-up-algoritme bepaalt de actieve scope: vanaf de huidige route omhoog tot de eerste node met expliciete scope-waarde; geen match betekent fallback naar de top-level categorie
- Volgorde-prioriteit: expliciete `nav: [...]` array op slugs, daarna `order: N` per pagina, daarna alfabetisch op title
- Sidebar-rendering: scope-label bovenaan met verplicht icon; daaronder chapters met chevron rechts of pages direct in een ingesprongen container; pages zonder chapter staan in dezelfde container alsof er een onzichtbaar standaard-chapter is (zie Section sidebar, feature 2)
- Pages binnen één container delen één doorlopende verticale lijn aan de linkerkant: grijs voor inactief, info-kleur op de hoogte van de actieve pagina, zonder dubbele lijnen of gat
- Iedere chapter en scope-label heeft een verplicht icon uit de frontmatter; ontbrekend icon levert een build-error
- Variant-files (`<page>.<variant>.<lang>.md`) collapsen tot één logische node met een `variants`-lijst (zie Sub-header met variant-tabs, feature 8); ze verschijnen niet als drie aparte sidebar-entries
- Een directory's `index.md` rendert als de directory zelf en verschijnt nooit als kind van zichzelf in de tree
- De sidebar voedt downstream surfaces (header-dropdowns — zie Header met dropdown-menu's, feature 3 — prev/next — zie Changelog en navigatie onderaan pagina, feature 6 — smart ToC — zie Rechter panel met conditionele panel-switcher en smart ToC, feature 5 — en breadcrumb)
- Sidebar-collapse-state wordt onthouden tussen sessies (zie Settings, feature 12)
- Tijdens SSG bevat de initiële render alleen filesystem + frontmatter; lokaal aangemaakte items verschijnen pas na hydratie en zijn per definitie privé
- Een platte lookup-structuur naast de tree garandeert constant-time scope-walks per page-change
- Alle nav-surfaces lezen de tree via één composable `useNavTree()` als single source; geen component roept direct `queryCollection` aan en geen logica wordt gedupliceerd — dit houdt feature 11 (In-app content management) chirurgisch in plaats van een refactor
- Geen state-manager in deze feature: read-side blijft puur composable. De tree-build is een pure functie met een optionele overlay-parameter die nu leeg is; feature 11 vult die parameter en voegt de write-side toe (zie In-app content management, feature 11)
- De auto-sidebar van de baseline-template wordt volledig vervangen; geen mengvorm waarbij delen van de oude sidebar blijven leven
- Iedere navigatie-actie is toetsenbord-bedienbaar (WCAG 2.1 AA)

## Constraints

**Niet hier — andere features eigenen het op:**

- Geen search-input, command-palette of `Cmd+K` in de sidebar; hoort bij Search (feature 9)
- Geen drag-and-drop reordering of inline rename-op-hover; hoort bij In-app content management (feature 11) en View / Edit-toggle (feature 10)
- Geen variant-tab UI in een sidebar-entry; tabs leven in de sub-header (feature 8) en de sidebar weet alleen *dat* er varianten zijn via `variants[]`
- Geen locale-switcher (feature 4), theme-toggle of settings-paneel (feature 12), of changelog-indicator (feature 6) in de sidebar
- Geen breadcrumb-fragment ín de sidebar; breadcrumb is een eigen surface (feature 5)

**UX dat de spec niet vraagt:**

- Geen accordion-mode (auto-collapse van sibling-chapters); meerdere chapters tegelijk expanded is expliciet toegestaan
- Geen sticky scope-label tijdens scroll, geen custom scrollbar styling
- Geen counts/badges naast chapters (`12 pages`), geen pinning, favorites of "recently visited"-sectie
- Geen hover-preview van pagina-content, geen tooltips op chapter-icons; WCAG accessible names volstaan
- Geen loading skeletons — SSG levert de echte content op first paint
- Animaties beperken tot chevron-rotatie en chapter-height-collapse; geen panel slide-ins of fades
- Auto-scroll-to-active op mount mag, maar alleen via `scrollIntoView({ block: 'nearest' })` — geen intersection-observer-tracking of viewport-bookkeeping

**Architectuur en dependencies:**

- Geen Pinia, Vuex of andere state-manager in deze feature; `useNavTree()` blijft de enige toegang. De write-side komt pas in feature 11
- Geen VueUse-dep voor de localStorage-wrapper rond collapse-state; inline of een lokale composable is voldoende
- Geen swappable storage-adapters, generieke `<Tree>`-component, event-bus, plugin-systeem of provider-pattern bovenop de composable — abstractie pas bij een tweede concreet gebruik
- Geen Zod-validatie over de hele tree; alleen de frontmatter-contracten (`scope`, `icon`, `nav`, `order`) valideren
- Geen memoization- of caching-laag bovenop de tree-walk vóórdat er een meetbaar performance-probleem is
- Geen telemetrie of analytics op nav-clicks

**Test- en tooling-grenzen:**

- Geen E2E-tests voor variant-collapse edge-cases voordat feature 8 daadwerkelijk leeft
- Geen Storybook entries voor sub-states; Playwright tegen echte routes is het toetsbed
- Geen ARIA-overload (`role=tree` + `aria-level` + `aria-setsize`); leun op de primitieven die Nuxt UI levert

**Scope-discipline:**

- Geen demo-chapter, voorbeeld-pagina of hardcoded starter-content onder de scope-label; alle content leeft in `content/`
- Geen nieuwe frontmatter-velden zonder requirement in deze of een gelinkte feature
- Geen "opfris-refactor" van de bestaande `SectionSidebar.vue` uit `01-markdown-rendering` buiten wat deze SPEC vraagt (doorlopende lijn met active-segment, scope-walk, variant-collapse, single-composable read-side, vervanging van auto-sidebar)
- Geen eigen icon-collectie aanmaken bovenop de scaffold totdat er echte custom icons nodig zijn

## Implementation Steps

Geordende, reviewbare stappen. Elke stap is groot genoeg om iets zinvols op te leveren en klein genoeg om in één review-sessie door te lopen. Per stap krijgt de bijbehorende map onder `steps/` een `prompt.md` (de Claude Code task) en een `test-plan.md` (groen-criteria), opgesteld op het moment dat de stap aan de beurt komt.

### Step 1 — Tree-build & `useNavTree()` composable

Het pure data-fundament zonder UI-wijziging. Walkt `content/`, parseert frontmatter, bouwt de hiërarchische tree én de platte lookup. Levert scope walk-up, order-resolver, variant-collapse en `index.md`-hoist. Faalt de build met heldere error op een ontbrekend `icon` op een chapter- of scope-node. Stelt `useNavTree()` beschikbaar als single source voor alle consumers.

**Wat erin zit:**

- `buildTree(rawContent, overlay?)` als pure functie; de `overlay`-parameter is aanwezig maar leeg (feature 11 vult 'm)
- Order-resolver: expliciete `nav: [...]` array > `order: N` per pagina > alfabetisch op title
- Walk-up scope-resolver: vanaf een routePath omhoog tot de eerste node met expliciete `scope`-waarde
- Variant-collapse via filename-regex `<base>.<variant>.<lang>.md`; resulteert in één node met `variants[]`
- `index.md`-hoist: directory's `index.md` wordt de directory-node, verschijnt nooit als kind van zichzelf
- Frontmatter-contract validatie: ontbrekend `icon` op chapter/scope-label → throw met file-pad
- `useNavTree()` als Nuxt composable, backed by `useState` zodat alle nav-surfaces dezelfde tree zien
- Derived composables `useCurrentScope()`, `useBreadcrumb()`, `usePrevNext()` als pure computeds bovenop `useNavTree()`

**Wat eruit blijft:**

- Geen UI-werk; bestaande `SectionSidebar.vue` blijft op zijn hardcoded chapters draaien
- Geen overlay-merge (feature 11)
- Geen persistence, keyboard nav of a11y-uitwerking — komt in latere stappen

**Tests:**

- Unit (Vitest) over `buildTree`: basis tree-shape, `index.md`-hoist, platte `lookup`-mapping
- Unit over de order-resolver: expliciete `nav: [...]` overrulet, `order: N` daarna, alfabetisch als fallback; slugs niet in `nav` vallen aan de staart in alfabetische volgorde
- Unit over variant-collapse: drie sibling-files `<base>.<variant>.<lang>.md` leveren één node met `meta.variants` met de juiste ids
- Unit over icon-validatie: ontbrekend `icon` op chapter of scope-label gooit een error met de file-pad in de message; leaf-pages zonder icon throwen niet
- Unit over `walkScope` (declared scope, walk-up tot eerste expliciete waarde, fallback naar top-level, unknown route → null)
- Unit over `walkBreadcrumb` en `flattenForPrevNext` (variant-collapsed nodes verschijnen één keer; pure scope-labels worden uitgesloten)
- Geen E2E in deze stap — er verandert niets aan de UI

### Step 2 — Scope-bound sidebar UI

Vervangt de hardcoded chapters in `SectionSidebar.vue` (en de auto-sidebar uit de Nuxt UI docs-template) door tree-driven rendering uit `useNavTree()`. Implementeert het visuele model uit de SPEC: scope-label met icon, chapters met chevron, orphan-pages in een impliciete container, doorlopende verticale lijn met actief-segment, variant-collapse als één entry.

**Wat erin zit:**

- `SectionSidebar.vue` consumeert `useNavTree()` + `useRoute()`; geen `queryCollection`-call meer in het component
- Scope-label bovenaan met verplicht icon
- Chapters met chevron rechts; expanded toont children in een ingesprongen container
- Orphan-pages renderen in dezelfde container als chapter-children, alsof er een onzichtbaar standaard-chapter is
- Active-line: per-item `border-left` (1.5px) op iedere page-link binnen een ingesprongen container, default in de tertiary-border-kleur en op het actieve item geswapt naar de info-kleur (zie implementatie-hint in `TDD/SPEC.md` § Section sidebar). Geen `border-left` op de container-wrapper; geen gat tussen items zodat de individuele borders visueel één doorlopende lijn vormen
- `aria-current="page"` op het actieve link
- Variant-collapse zichtbaar: één sidebar-entry per logische pagina, ongeacht hoeveel variant-files
- Auto-sidebar van de baseline-template expliciet unregisterd; ESLint-rule of CI-check weigert imports van het oude component

**Wat eruit blijft:**

- Collapse-state alleen runtime; geen persistence over sessies
- Keyboard navigatie beperkt tot native browser-tab; geen roving tabindex of pijltjes-handlers
- Lokale tree-mutaties (feature 11) niet zichtbaar — `overlay` blijft leeg

**Tests:**

- E2E (Playwright): scope-label rendert met icon en titel uit het `index.md` van de huidige scope
- E2E: chapter expand/collapse via klik op de chapter-button; meerdere chapters tegelijk expanded werkt (geen accordion)
- E2E: actief item krijgt `aria-current="page"` en de info-gekleurde `border-left`; inactieve siblings hebben de muted border-kleur
- E2E: variant-collapse zichtbaar — een set van drie variant-files levert één sidebar-entry op
- E2E: navigeren naar een pagina in een andere module wisselt de sidebar-content naar die scope
- E2E: orphan-pages (zonder chapter-parent) renderen in dezelfde ingesprongen container met gedeelde verticale lijn
- CI of grep-check: geen imports van `UContentNavigation` meer in `app/`

### Step 3 — Persistence, keyboard nav & WCAG 2.1 AA

Laatste stap die de sidebar productie-rijp maakt. Collapse-state per chapter persisteert via een `settingsStore`-interface (localStorage als eerste implementatie; feature 12 hergebruikt deze interface ongewijzigd). Volledige keyboard-navigatie en WCAG 2.1 AA-conformiteit.

**Wat erin zit:**

- `useSidebarCollapse()` composable schrijft naar een `settingsStore`-wrapper rond localStorage; geen externe dep
- Roving tabindex binnen de sidebar als één focus-group
- Toetsenbord-handlers: ↑/↓ tussen items in volgorde, ←/→ collapse/expand op chapter-buttons, `Enter` activeert link
- Focus-visible styling via data-attribute, niet op default `:focus`
- Accessible names op elk interactief element; geen tooltip-overlay
- E2E coverage voor collapse-persistence-over-reload en volledige keyboard-flow

**Wat eruit blijft:**

- Drag-and-drop reordering (feature 11)
- Inline rename / context-menu-acties (feature 10 en 11)
- Alles dat in `## Constraints` expliciet als "niet hier" gemarkeerd staat

**Tests:**

- E2E (Playwright): collapse-state per chapter overleeft een page-reload
- E2E: meerdere chapters kunnen onafhankelijk gecollapsed/expanded zijn; beide states overleven reload
- E2E: `Tab` brengt focus de sidebar in; ↑/↓ navigeert tussen focusable items in visuele volgorde
- E2E: ←/→ op een chapter-button collapse/expand met juiste `aria-expanded`-update
- E2E: `Enter` op een gefocuste page-link navigeert naar die pagina
- E2E: focus-visible ring (`data-focus-visible="true"`) verschijnt alleen na keyboard focus, niet na muis-klik
- Unit / integration: `useSidebarCollapse()` schrijft via `settingsStore`-interface, niet rechtstreeks naar `localStorage`, zodat feature 12 dezelfde interface kan hergebruiken
- A11y: elk interactief element heeft een toegankelijke naam; geen `role="tree"`, `aria-level` of `aria-setsize` in de markup
- Optioneel: `@axe-core/playwright` smoke test op een representatieve pagina, zero `serious` of `critical` violations
