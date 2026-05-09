# Variant tabs

## Summary

Deze customization voegt de secundaire navigatie-balk onder de hoofd-header toe voor pagina's die meerdere varianten van dezelfde inhoud aanbieden — die levert de baseline-template niet. Pagina's zonder `variants`-frontmatter tonen geen sub-header, dus simpele pagina's krijgen geen lege chrome. Voor lezers die dezelfde inhoud op hun eigen niveau of perspectief willen lezen (Junior/Mid/Senior, Aanvaller/Verdediger, Windows/Linux/macOS) en auteurs die varianten in aparte files onderhouden.

## Goals

- Lezers zien in één oogopslag welke varianten beschikbaar zijn én welke ze nu lezen
- Auteurs onderhouden iedere variant in een aparte file zodat drafts en wijzigingen niet door elkaar lopen
- Variant-keuze is deelbaar via URL en wordt onthouden tussen sessies
- Bij beperkte ruimte blijven alle varianten zichtbaar; de actieve houdt prioriteit
- Pagina's zonder varianten tonen geen sub-header; geen lege chrome op simpele pagina's

## Requirements

- Pagina's met `variants`-frontmatter krijgen een sub-header onder de hoofd-header met variant-tabs (icon + label per variant); pagina's zonder `variants`-declaratie tonen geen sub-header
- Iedere variant heeft drie velden: `id` (slug, gebruikt in querystring en filename), `label` (zichtbare tekst) en `icon` (Iconify-referentie). Het `icon`-veld is **verplicht**; zonder werkt het overflow-gedrag niet en levert het een build-error
- De sub-header toont alleen de variant-tabs zonder statisch label ervoor (geen "Niveau:" of "Variant:") — de betekenis verschilt per pagina, dus elk vast label zou misleidend zijn op de volgende pagina
- Variant-content leeft in aparte files volgens het patroon `<page>.<variant>.<lang>.md`; tijdens het tree-bouwen collapsen die files tot één logische node (zie Section sidebar, customization 02); de sub-header leest het `variants`-veld van die node
- De gekozen variant wordt opgeslagen in een querystring (`?variant=<id>`) zodat een variant-specifieke URL deelbaar is
- De laatst gekozen variant per pagina wordt onthouden als gebruiker-voorkeur (zie Settings, feature 03 in 03-features); bij terugkeer is dat de actieve variant
- Overflow-gedrag is collapse, geen scroll: passen alle varianten met icon + label binnen de container, dan worden ze zo getoond; passen ze niet, dan collapsen non-actieve varianten naar icon-only en blijft de actieve variant in icon + label zichtbaar zodat de gebruiker weet waar hij is
- Op hover of focus van een collapsed variant verschijnt het label als tooltip
- Variant-tabs combineren met content-tabs (zie Content tabs, customization 06) is toegestaan: varianten in de sub-header, content-tabs binnen de actieve variant; de smart ToC (zie customization 07) blijft tab-bewust binnen de actieve variant
- Variant-aware prev/next (zie Changelog en navigatie onderaan pagina, customization 08) blijft binnen de actieve variant zolang de doelpagina die variant heeft, anders fallback naar default-content
- Horizontale dividers tussen secties (header, sub-header, content) lopen edge-to-edge met de outer container, zonder inset of whitespace aan de zijkanten
- De divider onder de sub-header loopt edge-to-edge; de active-state-underline van een geselecteerde variant-tab landt op die divider zonder gat ertussen, consistent met de hoofd-header (zie Header, customization 03)
- Het `+`-icoon voor een nieuwe variant uit In-app content management (zie feature 02 in 03-features) blijft door het collapse-gedrag altijd zichtbaar zonder sticky-positionering
- Sub-header is volledig toetsenbord-bedienbaar; pijltjes-toetsen schakelen tussen tabs (WCAG 2.1 AA)
