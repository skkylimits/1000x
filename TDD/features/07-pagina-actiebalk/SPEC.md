# Pagina-actiebalk

## Summary

Vier knoppen inline rechts naast de pagina-titel (H1), gegroepeerd in twee segmented buttons: View/Edit en Copy page met chevron-dropdown. Voor lezers die snel willen schakelen tussen lezen en bewerken (zie View / Edit-toggle met lokale drafts, feature 10) en die de pagina willen kopiëren of openen in een externe LLM.

## Goals

- Lezers kunnen vanuit elke pagina in één klik schakelen tussen view en edit, en in één klik kopiëren of doorsturen
- Acties zijn visueel gegroepeerd zodat het meteen duidelijk is welke twee dingen samen horen
- Latere uitbreidingen (PowerPoint, documentatie-export op basis van AI) passen in dezelfde dropdown zonder herinrichting

## Requirements

- De actiebalk staat inline rechts naast de paginatitel (H1) en bevat vier knoppen, niet meer en niet minder in de eerste release
- Knoppen zijn visueel gegroepeerd in twee segmented buttons: één voor View/Edit en één voor Copy page met chevron-dropdown
- Binnen één segmented button zijn segmenten aaneengesloten zonder gap; tussen de twee groepen zit een kleine gap omdat ze semantisch verschillende acties zijn
- De View/Edit-button toont één actief en één inactief segment; klikken op het inactieve segment wisselt de pagina-modus (zie View / Edit-toggle met lokale drafts, feature 10)
- De Copy page-button kopieert de pagina-content naar het klembord
- De chevron-knop naast Copy page opent een dropdown-menu met minimaal: _Copy as markdown_, _Open in Claude_, _Open in ChatGPT_, _View as markdown_
- De dropdown is uitbreidbaar zonder de actiebalk-structuur aan te passen; toekomstige opties (bv. _Genereer PowerPoint_, _Genereer documentatie_, beide leunend op de AI-laag — zie AI assistent in slide-panel, feature 19) verschijnen daar
- Op extra-smal scherm collapsed de hele actiebalk naar een dropdown-menu (zie Mobiele layout, feature 16)
- Iedere knop en dropdown-optie heeft een toetsenbord-equivalent en een toegankelijke naam (WCAG 2.1 AA)
- De View/Edit-state is per pagina; switchen op pagina A heeft geen invloed op pagina B
