# Image lightbox

## Summary

Deze customization voegt een fullscreen lightbox-overlay toe voor afbeeldingen in markdown-content. Klik op een inline-afbeelding opent de afbeelding op volledige resolutie met alt-text als caption. Sluiten via `Esc`, klik buiten de afbeelding of een sluit-knop. Voor lezers die screenshots, terminal-output, network-diagrammen of andere visuele content willen kunnen inzoomen zonder een aparte tab te openen.

## Goals

- Lezers kunnen elke inline-afbeelding direct vergroot bekijken zonder de pagina te verlaten
- Auteurs hoeven geen extra markup of frontmatter te schrijven; klikbaarheid is automatisch op iedere `<img>` in de prose
- De lightbox blijft licht en niet-blokkerend; geen runtime-payload op pagina's zonder afbeeldingen
- De afbeelding zelf komt uit de bestaande image-pipeline (zie Markdown rendering, customization 01); deze customization voegt alleen de overlay toe

## Requirements

- Klik op een inline-afbeelding (rendered uit markdown image-syntax) opent een fullscreen overlay met de afbeelding op volledige resolutie
- De markdown alt-text van de afbeelding verschijnt als caption naast of onder de afbeelding in de lightbox
- Bij ontbrekende alt-text rendert de lightbox de afbeelding zonder caption maar laat het sluiten en het tonen niet falen
- Sluiten kan via `Esc`-toets, klik buiten de afbeelding op de overlay-achtergrond, of een expliciete sluit-knop in de overlay
- De overlay is donker (≥ 80% opacity) zodat de afbeelding contrast heeft met de achtergrond
- De afbeelding zelf wordt geleverd door de algemene image-pipeline (zie Markdown rendering, customization 01) en heeft geen aparte asset-route
- De overlay laadt alleen wanneer een lezer voor het eerst op een afbeelding klikt; geen runtime-payload op pagina's zonder kliks
- Focus blijft binnen de lightbox-overlay zolang die open is (focus trap); na sluiten keert focus terug naar de geklikte afbeelding
- De overlay voldoet aan WCAG 2.1 AA: voldoende contrast, toetsenbord-toegankelijk, sluit-knop met accessible name
- Op smal scherm vult de afbeelding de volledige viewport-breedte; bij touchscreen blijft tap-out-to-close werken

## Constraints

- **Niet in v1**: multi-image gallery met thumbnails en pijltjes-navigatie tussen afbeeldingen, pinch-to-zoom op mobiel, image-annotatie tools, image-rotation
- **Geen** custom asset-route voor lightbox-images; gebruik dezelfde image-pipeline als de inline render
- **Geen** lightbox-trigger via aparte component-syntax; klik op iedere markdown-image is automatisch klikbaar
