# In-app content management

## Summary

Nieuwe hoofdstukken, pagina's, varianten en content-tabs kunnen direct vanuit de UI worden aangemaakt. Geen codebase-aanpassing nodig om content uit te breiden — de markdown-editor blijft alleen voor inhoud zelf, terwijl structuur-mutaties hun eigen affordances hebben.

## Goals

- Iedereen kan nieuwe structuur toevoegen zonder de codebase te openen
- Aanmaken voelt direct: van klik tot bewerkbare nieuwe pagina is één flow
- Bestaande items zijn ook hernoembaar of verwijderbaar zonder bron-files te bewerken
- Lokaal aangemaakte content is privé per browser/sessie totdat een latere fase backend-save introduceert

## Requirements

- Twee patronen voor "iets toevoegen", afhankelijk van of het doel een vertikale lijst of een horizontale tab-rij is
- Vertikale lijsten in de sidebar: inline _"+ nieuw hoofdstuk"_- of _"+ nieuwe pagina"_-rij onderaan de lijst, subtiel gestyled met gestippelde border om het _+_-icoon en lichtere tekst — niet als losse iconen naast headings
- Horizontale tab-rijen: klein _+_-icoon aan het einde van de rij — voor variant-tabs (feature 8) en content-tabs (feature 1)
- _+_-icoon op overflow tab-rijen blijft sticky aan de rechterkant zichtbaar tijdens horizontaal scrollen — altijd bereikbaar, geen verstopte action achter een vergrendelde rand
- _+_-icoon zit altijd in tab-order voor toetsenbord-navigatie, ook als de zichtbare tabs eerst gescrolld moeten worden
- Klik op _+_ opent een inline naam-input op de plek van het toegevoegde item
- Enter bevestigt; het nieuwe item verschijnt direct in de UI
- Bij een pagina, variant of tab opent het nieuwe item meteen in edit-mode (feature 10) klaar voor inhoud
- Nieuwe variant inherit de huidige pagina-content als startpunt — de gebruiker begint niet vanaf nul
- Tab-markup wordt automatisch in het bron-bestand ingevoegd; nieuwe tab opent direct in edit-mode
- Rechts-klik op een bestaand item geeft een context-menu met _hernoemen_ en _verwijderen_
- Lokaal aangemaakte items zijn alleen voor die browser/sessie zichtbaar — privé per definitie, net als drafts
- Lokale structuur-mutaties worden bewaard in een overlay die bij het renderen van de sidebar wordt gemerged met de echte content-tree
- Mutaties zijn gescheiden per taal
- Latere uitbreiding (niet in deze fase): drag-and-drop herordenen van items in de sidebar
- Latere uitbreiding (niet in deze fase): backend-save als onderdeel van een commit/PR-flow waarin "+ new page" zowel het markdown-bestand als de navigatie-config in één commit toevoegt

Vereist dat feature 2 (section sidebar) en feature 10 (edit-modus) gebouwd zijn.
