# Mobiele layout

## Summary

Op smal scherm collapsed de drie-koloms desktop-layout naar één kolom met overlays die vanuit de header opgeroepen kunnen worden. Alle features blijven bereikbaar, maar de layout past zich aan aan beperkte schermruimte.

## Goals

- Volledige functionaliteit op telefoon en smal scherm — niets verdwijnt
- Tap-targets en overlay-flows zijn duim-vriendelijk
- Toegankelijkheid blijft minimaal WCAG 2.1 AA

## Requirements

- Drie-koloms-layout (sidebar | content | rechter panel) collapsed naar één kolom met overlays
- Header (feature 3) blijft zichtbaar; een hamburger-knop links opent de sidebar (feature 2) als slide-in van links
- Rechter panel (feature 5) wordt een bottom-sheet of een slide-in van rechts, oproepbaar via een knop in de actiebalk, afhankelijk van de panel-keuze
- Resize-handle van het rechter panel vervalt op mobiel — geen drag op klein scherm
- Pagina-actiebalk (feature 7) blijft naast de H1, maar collapsed naar een dropdown-menu op extra-smalle schermen (bijvoorbeeld onder 480 pixels breed)
- Card trainer (feature 14): op mobiel volledig scherm in plaats van 70%
- Code-editor (feature 13) opent als full-screen modal op mobiel zodat de gebruiker genoeg ruimte heeft om te typen
- Smart ToC (feature 5): niet als rechter panel maar als _"Op deze pagina"_-dropdown bovenaan de content, met hetzelfde scroll-driven gedrag in uitgevouwen state
- Touch-targets volgen WCAG 2.1 AA — minimaal 44 bij 44 pixels tap-area
- Iedere muis- of scroll-interactie heeft een toetsenbord-equivalent (incl. smart ToC, cards-overlay en panel-switcher)

Vereist dat feature 3 (header), feature 2 (sidebar), feature 5 (panel-switcher), feature 7 (actiebalk), feature 13 (code-editor) en feature 14 (card trainer) gebouwd zijn.
