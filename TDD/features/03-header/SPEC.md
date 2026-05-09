# Header met dropdown-menu's

## Summary

Top-bar met logo links, hoofdmenu gecentreerd in het midden en vijf icon-only actie-knoppen rechts. Het hoofdmenu kent zes module-categorieën die ieder een dropdown openen met sub-items uit de content-tree (zie Section sidebar, feature 2). Voor lezers om snel tussen modules en mini-apps te springen.

## Goals

- Lezers kunnen vanuit elke pagina in twee klikken een andere module of een actie-knop bereiken
- In-app aangemaakte hoofdstukken (zie In-app content management, feature 11) verschijnen automatisch in het juiste dropdown zonder code-wijziging
- Hoofdmenu-items zonder children gedragen zich consistent als directe link in plaats van een leeg dropdown
- De header voelt visueel rustig: icon-only knoppen rechts, geen overbodige labels of toetsenbord-affordances zichtbaar in chrome

## Requirements

- Linkerkant toont een klikbaar logo dat naar de home-route navigeert
- Het midden bevat zes hoofdmenu-categorieën horizontaal gecentreerd: The Lab, Syntax, Kitt, Vuln, Xpl01ts, Knowledge Base
- Een hoofdmenu-item met meerdere children opent een dropdown op hover én klik; een item met een chevron-indicator signaleert die dropdown
- Een hoofdmenu-item met geen of slechts één directe child rendert als directe link zonder dropdown en zonder chevron; navigatie gaat naar de scope-overview
- Sub-items in elk dropdown worden data-driven afgeleid uit de content-tree, inclusief icon en korte description per child uit frontmatter
- Rechterkant bevat vijf icon-only actie-knoppen in deze functionele rollen: command palette voor search (zie Search, feature 9), AI-assistent (zie AI assistent in slide-panel, feature 19), taalwissel (zie Internationalisatie, feature 4), light/dark-toggle, settings (zie Settings, feature 12)
- Geen tekst-labels naast de icon-only knoppen; toetsenbord-affordances zoals `Cmd+K` mogen alleen in tooltip of binnenin de geopende command palette verschijnen, niet in de header zelf
- De divider onder de header loopt edge-to-edge over de outer container; de active-state-underline van een geselecteerd hoofdmenu-item landt op die divider in plaats van zwevend erboven
- Iedere actie-knop heeft een toetsenbord-equivalent en een toegankelijke naam (WCAG 2.1 AA)
- Bij het toevoegen van een nieuwe module verschijnt deze in het juiste hoofdmenu-item zonder dat de header-component handmatig aangepast hoeft te worden
