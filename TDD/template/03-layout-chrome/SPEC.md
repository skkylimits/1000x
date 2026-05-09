# Layout chrome

## Summary

Deze customization vervangt de header, layout-skeleton en chrome rondom de content van de Nuxt UI docs-template door de definitieve 1000x-versie. Levert de visuele containers waarin Header met dropdown-menu's (feature 3), Pagina-actiebalk (feature 7), Sub-header met variant-tabs (feature 8), het rechter-panel-skelet uit Rechter panel met conditionele panel-switcher en smart ToC (feature 5) en de breadcrumb uit Section sidebar (feature 2) hun plek krijgen.

## Goals

- Lezers ervaren een consistent visueel ritme over alle pagina's: header → sub-header → breadcrumb → content + actiebalk → rechter panel
- Iedere chrome-laag levert een eigen container zodat downstream features daar inhoud in kunnen plaatsen zonder eigen chrome te bouwen
- Dividers en active-states zijn visueel gefuseerd zonder dubbele lijnen of gaten
- Ruimte voor latere fases (sub-header levels-collapse, AI-panel-overlay) is in het skelet meegenomen

## Requirements

- De header levert drie zones: logo links, hoofdmenu gecentreerd in het midden met zes module-categorieën, vijf icon-only actie-knoppen rechts (zie Header met dropdown-menu's, feature 3)
- Hoofdmenu-items met meerdere children openen een dropdown; items met geen of één direct child renderen als directe link zonder chevron of dropdown
- Dividers tussen header-zones lopen edge-to-edge over de outer container, zonder inset of whitespace aan de zijkanten; geldt voor alle dividers tussen hoofdsecties (header, sub-header, content)
- De active-state-underline van een geselecteerd hoofdmenu-item of variant-tab landt op de divider van de container zonder gat ertussen
- Onder de header verschijnt op pagina's met varianten een sub-header (zie Sub-header met variant-tabs, feature 8); pagina's zonder varianten tonen geen sub-header
- Onder de sub-header (of direct onder de header bij pagina's zonder varianten) verschijnt een breadcrumb met sectie / hoofdstuk / pagina, gevoed door dezelfde tree als de sidebar (zie Section sidebar, feature 2)
- Het content-skelet biedt drie kolommen: sidebar links, content midden, rechter panel rechts (zie Rechter panel met conditionele panel-switcher en smart ToC, feature 5)
- Tussen content en rechter panel zit een resize-handle die de breedte aanpast binnen min ~220px en max ~480px; default ~280px
- Rechts naast de paginatitel (H1) levert het skelet ruimte voor de pagina-actiebalk (zie Pagina-actiebalk, feature 7) inline en niet als losse rij erboven
- Het rechter panel is op desktop standaard open en volledig sluitbaar via een toggle; bij sluiten krijgt de content-kolom de vrijgekomen breedte
- Het skelet biedt een container voor de AI-slide-panel (zie AI assistent in slide-panel, feature 19) die over de content heen kan klappen zonder de andere chrome-lagen te raken
- Op smal scherm collapsed het chrome volgens Mobiele layout (feature 16): hamburger-knop, slide-in-sidebar, bottom-sheet of slide-in-rechter-panel
- Iedere chrome-component is volledig toetsenbord-bedienbaar (WCAG 2.1 AA)
- Het skelet is uitbreidbaar voor latere fases (levels-collapse in sub-header) zonder herinrichting
- De template-versies van header, layout en chrome worden volledig vervangen; geen gedeelde state met de oude chrome
