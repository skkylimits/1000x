# Content tabs

## Summary

Deze customization voegt content-tabs binnen markdown-pagina's toe; de Nuxt UI docs-template levert deze niet als gemakkelijk hergebruikbaar MDC-block. Lange pagina's kunnen daarmee gecondenseerd worden zonder de file op te splitsen, en de tabs vormen de basis voor de tab-bewuste smart ToC (zie Smart ToC, customization 05) en de "+ nieuwe tab"-affordance uit In-app content management (feature 11). Voor lezers die binnen één pagina tussen onderwerpen willen schakelen zonder te navigeren, en voor auteurs die hun content gestructureerd willen aanbieden.

## Goals

- Lezers kunnen lange pagina's tab-voor-tab doorlopen zonder pagina-navigatie
- Auteurs groeperen content in tabs zonder de file op te splitsen of nieuwe routes aan te maken
- Tabs zijn de bron-data voor de tab-bewuste smart ToC en voor het "+ nieuwe tab"-affordance uit feature 11
- Tab-keuzes blijven deelbaar via een URL en worden onthouden tussen sessies

## Requirements

- Een markdown-pagina kan content-tabs bevatten als MDC-block; iedere tab heeft een eigen titel, optioneel icon, en eigen H2–H4-koppen
- De ToC (zie Smart ToC, customization 05) reflecteert alleen de koppen van de actief geselecteerde tab; tab-switch herrendert de ToC
- Anchor-links binnen een pagina springen alleen naar koppen binnen de actieve tab — een ToC-link verwijst nooit naar verborgen content
- De gekozen tab wordt bewaard in een querystring zodat een tab-specifieke URL deelbaar is
- De laatst gekozen tab per pagina wordt onthouden als gebruiker-voorkeur (zie Settings, feature 12); bij terugkeer is die de actieve tab
- Bij meer tabs dan binnen de container passen scrollt de tab-rij horizontaal native (touch-swipe, trackpad-scroll, shift+scrollwheel); tabs raken nooit verborgen achter een vergrendelde rand
- Een subtiele visuele indicator signaleert dat er meer tabs zijn dan zichtbaar wanneer de rij overschrijdt
- Het "+ nieuwe tab"-icoon (zie In-app content management, feature 11) blijft altijd zichtbaar en bedienbaar tijdens horizontale scroll, ook in tab-order voor toetsenbordnavigatie
- Content-tabs zijn combineerbaar met variant-tabs in de sub-header (zie Sub-header met variant-tabs, feature 8); variant-keuze leeft op pagina-niveau, content-tabs binnen de actieve variant
- Iedere tab is volledig toetsenbord-bedienbaar (WCAG 2.1 AA): pijltjes-toetsen schakelen tussen tabs, Enter activeert
- De template-versie van content-rendering wordt uitgebreid, niet vervangen — bestaande prose, code-blocks en callouts blijven functioneel werken binnen en buiten tabs
