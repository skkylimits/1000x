# Header

## Summary

Deze customization vervangt de baseline-template-header door de definitieve 1000x-versie: logo links, hoofdmenu gecentreerd in het midden met zes module-categorieën, en vijf icon-only actie-knoppen rechts. De dropdown-content is data-driven uit de tree (zie Section sidebar, customization 02) zodat in-app aangemaakte hoofdstukken automatisch in het menu verschijnen. Voor lezers om vanuit elke pagina in twee klikken een andere module of een actie-knop te bereiken.

## Goals

- Lezers kunnen vanuit elke pagina in twee klikken een andere module of een actie-knop bereiken
- Hoofdmenu is data-driven uit de content-tree zodat structuur-mutaties (zie In-app content management, feature 02 in 03-features) automatisch in het menu verschijnen zonder code-wijziging
- Hoofdmenu-items zonder children gedragen zich consistent als directe link in plaats van een leeg dropdown
- De template-header wordt volledig vervangen; geen mengvorm met de baseline
- De header voelt visueel rustig: icon-only knoppen rechts, geen overbodige labels of toetsenbord-affordances zichtbaar in chrome
- Header is consistent qua dividers en active-state-styling met de rest van het chrome

## Requirements

- Linkerkant toont een klikbaar logo dat naar de home-route navigeert (zie Branding, customization 01 in 01-foundation, voor de logo-styling)
- Het midden bevat zes hoofdmenu-categorieën horizontaal gecentreerd: **The Lab**, **Syntax**, **Kitt**, **Vuln**, **Xpl01ts**, **Knowledge Base**
- Een hoofdmenu-item met meerdere children opent een dropdown op hover én klik; een chevron-indicator signaleert die dropdown
- Een hoofdmenu-item met geen of slechts één directe child rendert als directe link zonder dropdown en zonder chevron; navigatie gaat naar de scope-overview
- Sub-items in elk dropdown worden data-driven afgeleid uit de content-tree (zie Section sidebar, customization 02), inclusief icon en korte description per child uit frontmatter
- Rechterkant bevat vijf icon-only actie-knoppen in deze functionele rollen: command palette voor search (zie Search, customization 09), AI-assistent (zie AI assistent, feature 10 in 03-features), taalwissel (zie i18n, customization 02 in 01-foundation), light/dark-toggle, settings (zie Settings, feature 03 in 03-features)
- Geen tekst-labels naast de icon-only knoppen; toetsenbord-affordances zoals `Cmd+K` mogen alleen in tooltip of binnenin de geopende command palette verschijnen, niet in de header zelf
- De divider onder de header loopt edge-to-edge over de outer container, zonder inset of whitespace aan de zijkanten
- De active-state-underline van een geselecteerd hoofdmenu-item landt op die divider in plaats van zwevend erboven
- Op smal scherm collapsed het hoofdmenu naar een hamburger-knop (zie Mobiele layout, feature 07 in 03-features); actie-knoppen kunnen in een overflow-menu verdwijnen
- De template-header wordt volledig vervangen; geen gedeelde state met de oude versie
- Bij het toevoegen van een nieuwe module verschijnt deze automatisch in het juiste hoofdmenu-item zonder dat de header-component handmatig aangepast hoeft te worden
- Header is volledig toetsenbord-bedienbaar (WCAG 2.1 AA): pijltjes-toetsen navigeren tussen items, `Enter` activeert, `Escape` sluit dropdowns; iedere actie-knop heeft een toegankelijke naam
