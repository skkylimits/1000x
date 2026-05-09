# Header met dropdown-menu's

## Summary

Een persistente bovenbalk met logo, zes hoofdcategorieën en vijf icon-only actie-knoppen. De globale navigatie- en actie-laag van de app, altijd zichtbaar op iedere pagina.

## Goals

- Snelle toegang tot de zes module-categorieën van het systeem
- Globale acties (search, AI, taal, thema, settings) altijd één klik weg
- Categorieën reflecteren automatisch de live content-structuur — geen handmatige sync met een hardcoded lijst

## Requirements

- Linkerkant: logo, klikbaar naar de homepagina
- Midden: zes hoofdcategorieën — _The Lab_, _Syntax_, _Kitt_, _Vuln_, _Xpl01ts_, _Knowledge Base_
- Een hoofdcategorie met meerdere kinderen rendert als dropdown-menu, opent op hover of klik
- Een hoofdcategorie met geen of één kind rendert als directe link, zonder chevron, met dezelfde styling als de andere categorieën — klik gaat direct naar de scope-overview
- De render-rule is data-driven: zero of one direct child → directe link; meerdere → dropdown
- Sub-items in elke dropdown zijn data-driven uit de content-tree, zodat in-app aangemaakte hoofdstukken (feature 11) automatisch in het menu verschijnen
- Iedere dropdown sub-item leest icon en description uit frontmatter
- De actieve hoofdcategorie heeft een onderstreping die exact op de bottom-divider van de header landt — geen zwevende lijn met een gat ertussen
- Rechterkant: vijf icon-only actie-knoppen, geen tekst-labels — _Search_, _AI_, _taalwissel_, _light/dark_, _Settings_
- Toetsenbord-affordances zoals shortcut-hints zijn niet zichtbaar in de header; een hint hoort in de tooltip of binnen het geopende component
- Search-knop opent een command palette (zie feature 9)
- AI-knop opent een slide-panel (zie feature 19)
- Tooltips op hover voor de icon-only knoppen

Vereist dat feature 2 (section sidebar / navigatie-bron) gebouwd is voor de data-driven dropdown-content.
