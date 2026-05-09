# Variant-tabs sub-header

## Summary

Deze customization voegt de secundaire navigatie-balk onder de hoofd-header toe voor pagina's die meerdere varianten van dezelfde inhoud aanbieden — die levert de baseline-template niet. Pagina's zonder `variants`-frontmatter tonen geen sub-header, dus simpele pagina's krijgen geen lege chrome. Voor lezers die dezelfde inhoud op hun eigen niveau of perspectief willen lezen (Junior/Mid/Senior, Aanvaller/Verdediger, Windows/Linux/macOS) en auteurs die varianten in aparte files onderhouden.

## Goals

- Lezers schakelen in één klik tussen relevante varianten van dezelfde pagina
- De actieve variant blijft altijd zichtbaar, ook bij overloop van de tab-rij
- Variant-keuze is deelbaar via URL en wordt onthouden tussen sessies
- Pagina's zonder varianten tonen geen sub-header; geen lege chrome op simpele pagina's

## Requirements

- Pagina's met `variants`-frontmatter (zie Sub-header met variant-tabs, feature 8) krijgen een sub-header onder de hoofd-header met variant-tabs (icon + label per variant)
- Pagina's zonder `variants`-declaratie tonen geen sub-header
- Iedere variant heeft een verplicht icon; ontbrekend icon levert een build-error
- Bij meer varianten dan binnen de container passen, collapsen non-actieve varianten naar icon-only; de actieve variant blijft icon + label zichtbaar zodat de gebruiker altijd weet waar hij is
- Op hover of focus van een collapsed variant verschijnt het label als tooltip
- De gekozen variant wordt opgeslagen in een querystring (`?variant=…`) zodat een variant-specifieke URL deelbaar is
- De laatst gekozen variant per pagina wordt onthouden als gebruiker-voorkeur (zie Settings, feature 12); bij terugkeer is dat de actieve variant
- Variant-files (`page.<id>.<lang>.md`) worden door de tree gemerged tot één logische node (zie Sidebar replacement, customization 02); de sub-header leest het `variants`-veld van die node
- Variant-aware prev/next (zie Page bottom, customization 08) blijft binnen de actieve variant zolang de doelpagina die variant heeft, anders fallback naar default-content
- De divider onder de sub-header loopt edge-to-edge over de outer container; de active-state-underline landt op die divider zonder gat ertussen, consistent met de hoofd-header (zie Header, customization 03)
- Variant-tabs combineren met content-tabs (zie Content tabs, customization 06) is toegestaan; varianten zitten in de sub-header, content-tabs binnen de actieve variant
- De `+`-knop voor _nieuwe variant_ (zie In-app content management, feature 11) blijft altijd zichtbaar zonder sticky positionering
- Sub-header is volledig toetsenbord-bedienbaar; pijltjes-toetsen schakelen tussen tabs (WCAG 2.1 AA)
