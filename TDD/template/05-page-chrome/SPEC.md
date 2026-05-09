# Page chrome

## Summary

Deze customization voegt drie kleine chrome-elementen rondom de pagina-content toe die de baseline-template niet of anders levert: de breadcrumb bovenaan de content, de pagina-actiebalk inline naast de H1, en het rechter-panel-skelet als container voor latere panel-views. Drie elementen worden gebundeld omdat ze elk klein zijn en geen onderlinge afhankelijkheid hebben. Voor lezers die context (waar zit ik?), pagina-acties (lezen/bewerken/kopiëren) en het rechter panel als vaste plek in de UI verwachten.

## Goals

- Lezers zien altijd hun positie in de tree (breadcrumb), kunnen pagina-acties direct uitvoeren (actiebalk), en hebben een vaste plek voor het rechter panel
- Het rechter-panel-skelet biedt een container die latere customizations (smart ToC, code-editor, comments) kunnen vullen zonder eigen chrome te bouwen
- Iedere chrome-laag heeft een eigen, smal scope zodat aanpassen of vervangen later geen ripple-effect heeft
- Mobiele layout (feature 16) heeft duidelijke breakpoints waar deze elementen collapsen of verhuizen

## Requirements

### Breadcrumb

- Een breadcrumb verschijnt bovenaan de pagina-content met sectie / hoofdstuk / pagina, gevoed door dezelfde tree als de sidebar (zie Section sidebar, feature 2 en Sidebar replacement, customization 02)
- Op pagina's met een variant-sub-header (zie Variant-tabs sub-header, customization 04) zit de breadcrumb onder de sub-header; anders direct onder de hoofd-header
- Iedere breadcrumb-segment is klikbaar en navigeert naar het bijbehorende niveau

### Pagina-actiebalk

- Naast de H1 van de pagina verschijnt een inline actiebalk met vier knoppen, niet als losse rij erboven (zie Pagina-actiebalk, feature 7)
- De vier knoppen zijn visueel gegroepeerd in twee segmented buttons: View/Edit als één groep, Copy page + dropdown-chevron als de tweede; binnen iedere groep: aaneengesloten zonder gap; tussen de groepen: kleine gap
- De chevron-knop opent een dropdown met copy- en export-opties (zie View / Edit-toggle met lokale drafts, feature 10 en AI assistent in slide-panel, feature 19)
- Op extra-smalle schermen (< 480px) collapsed de actiebalk naar een dropdown-menu (zie Mobiele layout, feature 16)

### Rechter-panel skelet

- Het content-skelet biedt drie kolommen op desktop: sidebar links, content midden, rechter panel rechts (zie Rechter panel met conditionele panel-switcher en smart ToC, feature 5)
- Tussen content en rechter panel zit een resize-handle die de breedte aanpast binnen min ~220px en max ~480px; default ~280px
- Het rechter panel is op desktop standaard open en volledig sluitbaar via een toggle uit de actiebalk; bij sluiten krijgt de content-kolom de vrijgekomen breedte
- Open/dicht-staat, breedte en actieve view worden onthouden als gebruiker-voorkeur (zie Settings, feature 12)
- Het skelet biedt een container voor de AI-slide-panel (zie AI assistent in slide-panel, feature 19) die over de content heen kan klappen zonder het skelet zelf te raken
- Op smal scherm collapsed het rechter panel naar een bottom-sheet of slide-in (zie Mobiele layout, feature 16); resize-handle vervalt

### Algemeen

- Iedere chrome-component is volledig toetsenbord-bedienbaar (WCAG 2.1 AA)
- De template-versies van deze drie elementen worden vervangen of toegevoegd zonder gedeelde state met de baseline
