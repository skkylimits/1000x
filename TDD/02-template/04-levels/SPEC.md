# Levels

## Summary

Deze customization voegt een **chrome-level sub-header** toe — onder de hoofd-header — voor secties die meerdere levels van dezelfde topic aanbieden, zoals skill-niveaus (Junior/Mid/Senior), perspectief-keuzes (Aanvaller/Verdediger) of platform-keuzes (Windows/Linux/macOS). De levels leven als folders onder de scope-directory; iedere level is een eigen sub-tree met eigen pagina's. Klik een level → URL navigeert naar die level's first page. Voor lezers die per level door dezelfde topic willen lopen, en voor auteurs die levels in aparte folders onderhouden zonder file-suffix-magic.

## Goals

- Lezers schakelen in één klik tussen levels van dezelfde topic en blijven daarna binnen die level totdat ze actief switchen
- Auteurs onderhouden iedere level in een eigen folder met eigen pagina's; geen file-suffixes, geen content-collapse-logic
- URLs zijn ondubbelzinnig deelbaar (`/syntax/javascript/junior` is een eigen route, niet een querystring-overlay)
- Native Nuxt Content prev/next werkt automatisch correct binnen een level want routes zijn netjes nested
- Secties zonder `levels: true` tonen geen sub-header; geen lege chrome op gewone secties

## Requirements

### Frontmatter-contract

- Een directory wordt een levels-container door `levels: true` (boolean) of `levels: [<slug>, ...]` (geordende array van slug-namen) op zijn `index.md` te zetten
- De directe children van een levels-container zijn **folders**; iedere child-folder is een level
- Iedere level-folder heeft een eigen `index.md` met minimaal `title` en `icon`; ontbrekend `icon` op een level levert een build-error
- Een directory mag NIET tegelijk `levels: true` én `tabs: true` hebben; build faalt op die combinatie

### Rendering — chrome sub-header

- AppLevelHeader wordt gerendered als chrome-sub-header **onder de hoofd-header** wanneer een ancestor van de huidige route een levels-container is (zie scope walk-up in Section sidebar, customization 02)
- De sub-header toont één tab per level met icon + label (of icon-only bij overflow); de actieve level is altijd in icon + label zichtbaar
- Klikken op een level navigeert naar `/<scope>/<level>/` — de level's eigen `index.md` opent als first page van die level
- De sub-header verdwijnt zodra de route geen levels-container-ancestor meer heeft

### Sidebar-gedrag onder een levels-container

- De sidebar onder een levels-container toont alleen de pagina's van de **actieve level**, niet de levels zelf
- De levels-container-node verschijnt zelf NIET als entry in de sidebar; hij is een chrome-niveau navigatie via AppLevelHeader, niet een sidebar-entry
- Het scope-walk-up-algoritme uit Section sidebar (customization 04) hanteert de levels-container als grens, met als effective scope de actieve level-folder

### Volgorde

- Wanneer `levels` als array opgegeven is (`levels: [junior, mid, senior]`), volgt AppLevelHeader die volgorde
- Wanneer `levels: true` zonder array, valt de volgorde terug op alfabetisch op level-slug
- Bij `nav: [...]` op de levels-container's `index.md` wint die over de `levels`-array (consistent met de overall ordering-resolver)

### Persistence en deelbaarheid

- De gekozen level wordt vastgelegd in de URL (`/syntax/javascript/senior/...`); geen querystring nodig
- Bij hernieuwd bezoek aan de scope-root (`/syntax/javascript`) zonder explicit level kan een redirect plaatsvinden naar de laatst-bezochte level (gebruiker-voorkeur via Settings, feature 03 in 03-features) of naar de eerste level uit de array

### Combinatie met andere features

- Een level-folder mag eigen tabs-containers bevatten (zie Tabs, customization 05): bv. `javascript/junior/01-variables/index.md` met `tabs: true` waar children de tab-files zijn. Levels en tabs zijn onafhankelijke flags op verschillende directories
- Native Nuxt Content prev/next blijft natuurlijk binnen een level omdat de routes nested zijn; geen variant-aware wrapper nodig — Prev/next (customization 10) werkt unmodified

### Toegankelijkheid

- AppLevelHeader is volledig toetsenbord-bedienbaar; pijltjes-toetsen schakelen tussen levels, `Enter` activeert (WCAG 2.1 AA)
- De active-state-underline van de geselecteerde level landt op de divider van de container, consistent met de hoofd-header (zie Header, customization 03)
- Horizontale dividers tussen secties (header → level-header → content) lopen edge-to-edge met de outer container, zonder inset

## Constraints

- **Geen file-suffix-collapse** zoals het oude `<page>.<variant>.<lang>.md`-patroon; level-content leeft uitsluitend in folders
- **Geen variant-aware querystring-resolver**; URL is de single source of truth voor de actieve level
- **Geen automatische cross-level prev/next**; je verlaat een level alleen via expliciete level-switch in AppLevelHeader
- **Geen levels in de sidebar**; levels zijn chrome-navigatie, niet content-navigatie
- **Geen mengvorm met `tabs: true`** op dezelfde directory; één directory heeft maximaal één van beide flags
