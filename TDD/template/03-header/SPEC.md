# Header

## Summary

Deze customization vervangt de baseline-template-header door de definitieve 1000x-versie: logo links, hoofdmenu gecentreerd in het midden met module-categorieën, en vijf icon-only actie-knoppen rechts. De dropdown-content is data-driven uit de tree (zie Sidebar replacement, customization 02) zodat in-app aangemaakte hoofdstukken automatisch in het menu verschijnen. Voor lezers die snel tussen modules willen springen en de mini-app-launchers (search, AI, taal, thema, settings) willen bereiken.

## Goals

- Lezers krijgen één consistente header op alle pagina's met één-klik-toegang tot iedere module en mini-app
- Hoofdmenu is data-driven uit de content-tree zodat structuur-mutaties (zie In-app content management, feature 11) automatisch verschijnen
- De template-header wordt volledig vervangen; geen mengvorm met de baseline
- Header is consistent qua dividers en active-state-styling met de rest van het chrome

## Requirements

- De header levert drie zones: logo links, hoofdmenu gecentreerd in het midden met zes module-categorieën, vijf icon-only actie-knoppen rechts (zie Header met dropdown-menu's, feature 3)
- Hoofdmenu-items met meerdere children openen een dropdown op hover of klik; items met geen of één direct child renderen als directe link zonder chevron of dropdown
- Dropdown-content (icon, titel, korte beschrijving per child) komt uit de frontmatter van de child-directory en gebruikt de tree uit Sidebar replacement (customization 02)
- De vijf actie-knoppen rechts zijn icon-only zonder tekst-labels of zichtbare toetsenbord-affordances: Search, AI, i18n, light/dark toggle, Settings
- De divider onder de header loopt edge-to-edge over de outer container, zonder inset of whitespace aan de zijkanten
- De active-state-underline van een geselecteerd hoofdmenu-item landt op de divider zonder gat ertussen
- Logo klikt naar home (zie Branding, customization 01 voor de logo-styling)
- Op smal scherm collapsed het hoofdmenu naar een hamburger-knop (zie Mobiele layout, feature 16); actie-knoppen kunnen in een overflow-menu verdwijnen
- De template-header wordt volledig vervangen; geen gedeelde state met de oude versie
- Header is volledig toetsenbord-bedienbaar (WCAG 2.1 AA): pijltjes-toetsen navigeren tussen items, Enter activeert, Escape sluit dropdowns
