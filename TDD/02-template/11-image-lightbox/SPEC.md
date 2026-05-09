# Image lightbox

## Summary

Klik op een afbeelding in een artikel opent een fullscreen overlay met de afbeelding op volledige resolutie en de markdown-alt-text als caption. Voor lezers die screenshots, diagrammen en network-visualisaties willen inzoomen op detail-niveau.

## Goals

- Lezers kunnen iedere inline-afbeelding bekijken op maximale resolutie zonder een tab te openen
- De alt-text uit markdown wordt direct als caption hergebruikt zodat auteurs niets extra hoeven te schrijven
- De scope blijft bewust afgebakend zodat gallery- en zoom-gedrag in latere iteraties zonder UI-breuk kan worden toegevoegd

## Requirements

- Klik op een inline-afbeelding opent een fullscreen overlay met de afbeelding op volledige resolutie
- De markdown alt-text van de afbeelding verschijnt als caption naast of onder de afbeelding in de lightbox
- Sluiten van de lightbox kan via Esc, klik buiten de afbeelding of een sluit-knop
- Bij ontbrekende alt-text rendert de lightbox de afbeelding zonder caption maar laat het sluiten en het tonen niet falen
- De overlay is donker zodat de afbeelding contrast heeft met de achtergrond
- Voor v1 expliciet niet meegenomen: multi-image gallery met thumbnails en pijltjes-navigatie tussen afbeeldingen, pinch-to-zoom op mobiel, image-annotatie tools
- De afbeelding zelf wordt geleverd door de algemene image-pipeline (zie Markdown rendering & content-engine, feature 1) en heeft geen aparte asset-route
- De lightbox is volledig toetsenbord-bedienbaar en voldoet aan WCAG 2.1 AA: focus blijft binnen de overlay, sluit-actie via Esc, sluit-knop bereikbaar via Tab
- Lightbox werkt offline op pagina's die in de cache staan (zie PWA en offline-werking, feature 17), zolang de afbeelding mee is gecached
