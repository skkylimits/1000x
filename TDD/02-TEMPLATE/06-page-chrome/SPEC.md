# Page chrome

## Summary

Deze customization voegt twee kleine chrome-elementen rondom de pagina-content toe die de baseline-template niet of anders levert: de breadcrumb bovenaan de content en de pagina-actiebalk inline naast de H1. Beide zijn klein en hebben geen onderlinge afhankelijkheid. Voor lezers die context (waar zit ik?) en pagina-acties (lezen/bewerken/kopiëren) als vaste plek in de UI verwachten.

> Het rechter-panel-skelet (drie-kolom-layout, resize-handle, open/dicht-toggle, panel-switcher buttons) leeft in een eigen customization (zie Right panel, customization 07) zodat aanpassingen aan de panel-mechanica geen ripple geven op breadcrumb of actiebalk.

## Goals

- Lezers zien altijd hun positie in de tree (breadcrumb) en kunnen pagina-acties direct uitvoeren (actiebalk)
- Iedere chrome-laag heeft een eigen, smal scope zodat aanpassen of vervangen later geen ripple-effect heeft
- Mobiele layout (zie feature 07 in 03-FEATURES) heeft duidelijke breakpoints waar deze elementen collapsen of verhuizen

## Requirements

### Breadcrumb

- Een breadcrumb verschijnt bovenaan de pagina-content met sectie / hoofdstuk / pagina, gevoed door dezelfde tree als de sidebar (zie Section sidebar, customization 02)
- Op pagina's onder een levels-container zit de breadcrumb onder de AppLevelHeader (zie Levels, customization 04); anders direct onder de hoofd-header
- Iedere breadcrumb-segment is klikbaar en navigeert naar het bijbehorende niveau

### Pagina-actiebalk

- Naast de H1 van de pagina verschijnt een inline actiebalk met vier knoppen, niet meer en niet minder in de eerste release; geen losse rij erboven
- De vier knoppen zijn visueel gegroepeerd in twee segmented buttons: View/Edit als één groep, Copy page + dropdown-chevron als de tweede; binnen iedere groep aaneengesloten zonder gap; tussen de groepen een kleine gap omdat ze semantisch verschillende acties zijn
- De View/Edit-button toont één actief en één inactief segment; klikken op het inactieve segment wisselt de pagina-modus (zie View / Edit-toggle met lokale drafts, feature 01 in 03-FEATURES). De View/Edit-state is per pagina; switchen op pagina A heeft geen invloed op pagina B
- De Copy page-button kopieert de pagina-content naar het klembord
- De chevron-knop naast Copy page opent een dropdown met minimaal: _Copy as markdown_, _Open in Claude_, _Open in ChatGPT_, _View as markdown_
- De dropdown is uitbreidbaar zonder de actiebalk-structuur aan te passen; toekomstige opties (bv. _Genereer PowerPoint_, _Genereer documentatie_, beide leunend op de AI-laag — zie AI assistent, feature 10 in 03-FEATURES) verschijnen daar
- De toggle die het rechter panel opent en sluit leeft in deze actiebalk maar de panel-skeleton zelf en zijn switcher-buttons leven in Right panel (customization 07); deze customization spreekt alleen de open/dicht-state aan
- Op extra-smalle schermen (< 480px) collapsed de hele actiebalk naar een dropdown-menu (zie Mobiele layout, feature 07 in 03-FEATURES)

### Algemeen

- Iedere chrome-component is volledig toetsenbord-bedienbaar (WCAG 2.1 AA)
- De template-versies van breadcrumb en actiebalk worden vervangen of toegevoegd zonder gedeelde state met de baseline
