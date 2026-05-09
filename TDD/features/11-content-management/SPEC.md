# In-app content management

## Summary

Nieuwe hoofdstukken, pagina's, varianten en content-tabs aanmaken vanuit de UI zonder de codebase te openen. Alles wat structureel is (de tree, niet de inhoud zelf) kan via twee affordance-patronen: inline `+ nieuw …`-rij onderaan vertikale lijsten, en een sticky `+`-icoon aan het einde van horizontale tab-rijen. Voor lezers/auteurs die docs willen uitbreiden zonder build-cyclus.

## Goals

- Auteurs kunnen een hoofdstuk, pagina, variant of content-tab aanmaken zonder de codebase te openen
- Iedere structuur-mutatie verschijnt direct in de sidebar (zie Section sidebar, feature 2) en alle nav-surfaces
- Het `+`-affordance is altijd bereikbaar, ook tijdens scroll en via toetsenbord
- Eerste release werkt volledig lokaal en privé per browser; latere fases groeien naar drag-and-drop, grotere lokale opslag en backend-PR-flow

## Requirements

- Onder vertikale lijsten (chapter-lijst van een module, page-lijst van een hoofdstuk) verschijnt een subtiele inline rij _"+ nieuw hoofdstuk"_ of _"+ nieuwe pagina"_ onderaan de lijst, niet als losse iconen naast headings
- Naast horizontale tab-rijen (variant-tabs in de sub-header — zie Sub-header met variant-tabs, feature 8 — en content-tabs in de pagina — zie Markdown rendering & content-engine, feature 1) staat een klein `+`-icoontje aan het einde
- Het `+`-icoontje aan het einde van een tab-rij blijft tijdens horizontaal scrollen altijd zichtbaar en bedienbaar; het zit ook in de tab-order voor toetsenbordnavigatie
- Klik op een `+`-affordance toont een kleine inline input voor de naam; Enter creëert het nieuwe item
- Een nieuw aangemaakte pagina, variant of tab opent direct in edit-mode (zie View / Edit-toggle met lokale drafts, feature 10)
- Een nieuwe variant gebruikt de huidige pagina-content als startpunt zodat de auteur niet vanaf nul begint
- Een nieuwe content-tab wordt automatisch in het markdown-bestand ingevoegd op de juiste plek
- Rechtermuisknop op een bestaand item (chapter, page, variant, tab) opent een context-menu met minimaal _rename_ en _delete_
- Eerste release: alle structuur-mutaties leven als overlay in lokale browser-opslag onder een sleutel die de taal bevat (zie Internationalisatie, feature 4); de gerenderde sidebar mergt de echte content-tree met deze overlay
- Lokaal aangemaakte items zijn alleen voor die browser/sessie zichtbaar en niet voor anderen
- Lokale tree-mutaties worden meegenomen in de export/import via Settings (zie Settings, feature 12 en View / Edit-toggle met lokale drafts, feature 10)
- Latere fase (drag-and-drop herordenen) past binnen dezelfde overlay-structuur zonder UI-breuk
- Latere fase (backend-save via PR-flow) maakt van een nieuwe pagina één commit dat zowel het markdown-bestand als de navigatie-config toevoegt
- Iedere mutatie-actie heeft een toetsenbord-equivalent en het inline input voldoet aan WCAG 2.1 AA
