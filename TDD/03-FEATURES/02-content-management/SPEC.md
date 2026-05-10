# In-app content management

## Summary

Nieuwe hoofdstukken, pagina's, levels en content-tabs aanmaken vanuit de UI zonder de codebase te openen. Alles wat structureel is (de tree, niet de inhoud zelf) kan via twee affordance-patronen: inline `+ nieuw …`-rij onderaan vertikale lijsten, en een sticky `+`-icoon aan het einde van horizontale tab-rijen. Voor lezers/auteurs die docs willen uitbreiden zonder build-cyclus.

## Goals

- Auteurs kunnen een hoofdstuk, pagina, level of content-tab aanmaken zonder de codebase te openen
- Iedere structuur-mutatie verschijnt direct in de sidebar (zie Section sidebar, Section sidebar, customization 02 in 02-TEMPLATE) en alle nav-surfaces
- Het `+`-affordance is altijd bereikbaar, ook tijdens scroll en via toetsenbord
- Eerste release werkt volledig lokaal en privé per browser; latere fases groeien naar drag-and-drop, grotere lokale opslag en backend-PR-flow

## Requirements

- Onder vertikale lijsten (chapter-lijst van een module, page-lijst van een hoofdstuk) verschijnt een subtiele inline rij _"+ nieuw hoofdstuk"_ of _"+ nieuwe pagina"_ onderaan de lijst, niet als losse iconen naast headings
- Naast horizontale tab-rijen — de AppLevelHeader op chrome-niveau (zie Levels, customization 04 in 02-TEMPLATE) en de TabBar in-content (zie Tabs, customization 05 in 02-TEMPLATE) — staat een klein `+`-icoontje aan het einde voor het toevoegen van een nieuwe level-folder of tab-page
- Het `+`-icoontje blijft tijdens horizontaal scrollen altijd zichtbaar en bedienbaar; het zit ook in de tab-order voor toetsenbordnavigatie
- Klik op een `+`-affordance toont een kleine inline input voor de naam; Enter creëert het nieuwe item (folder met `index.md` voor een level, of een `.md`-file voor een tab)
- Een nieuw aangemaakte pagina, level of tab opent direct in edit-mode (zie View / Edit-toggle met lokale drafts, feature 01 in 03-FEATURES)
- Een nieuwe level wordt aangemaakt als folder met `index.md`; de auteur start met een lege intro die gebruikt kan worden als landing voor die level
- Een nieuwe tab-page is een gewone `.md`-file in de tabs-container folder; frontmatter `title` wordt het tab-label
- Rechtermuisknop op een bestaand item (chapter, page, level, tab) opent een context-menu met minimaal _rename_ en _delete_
- Eerste release: alle structuur-mutaties leven als overlay in lokale browser-opslag onder een sleutel die de taal bevat (zie Internationalisatie, i18n, customization 02 in 01-FOUNDATION); de gerenderde sidebar mergt de echte content-tree met deze overlay
- Architectuur-scheiding read/write: de read-side blijft de composable `useNavTree()` uit Section sidebar (Section sidebar, customization 02 in 02-TEMPLATE); deze feature introduceert een Pinia store voor de write-side. Geen herschrijven van bestaande nav-surfaces — die lezen onveranderd uit de composable
- Mutatie-acties (`addChapter`, `addPage`, `addLevel`, `addContentTab`, `rename`, `delete`) leven als store-actions; iedere actie schrijft atomair naar de overlay-storage en triggert een recompute van `useNavTree()` zodat alle nav-surfaces direct meebewegen
- De tree-build is een pure functie `buildTree(rawContent, overlay)`; deze feature vult de `overlay`-parameter, die in Section sidebar, customization 02 in 02-TEMPLATE nog leeg is. Tijdens SSG blijft `overlay` leeg (privé-items lekken niet in de gerenderde HTML); na hydratie leest de store de overlay uit browser-opslag en geeft 'm door aan de tree-build
- De store is de eerste plek in de app waar Pinia binnenkomt; eerdere features hebben geen state-manager nodig en blijven op composables + `useState` werken
- Lokaal aangemaakte items zijn alleen voor die browser/sessie zichtbaar en niet voor anderen
- Lokale tree-mutaties worden meegenomen in de export/import via Settings (zie Settings, feature 03 in 03-FEATURES en View / Edit-toggle met lokale drafts, feature 01 in 03-FEATURES)
- Latere fase (drag-and-drop herordenen) past binnen dezelfde overlay-structuur zonder UI-breuk
- Latere fase (backend-save via PR-flow) maakt van een nieuwe pagina één commit dat zowel het markdown-bestand als de navigatie-config toevoegt
- Iedere mutatie-actie heeft een toetsenbord-equivalent en het inline input voldoet aan WCAG 2.1 AA
