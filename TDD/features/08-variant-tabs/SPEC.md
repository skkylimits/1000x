# Sub-header met variant-tabs

## Summary

Generieke secundaire navigatie-balk onder de hoofd-header voor pagina's die meerdere varianten van dezelfde inhoud aanbieden — denk aan skill-niveaus (Junior/Mid/Senior), perspectieven (Aanvaller/Verdediger) of platformen (Windows/Linux/macOS). Iedere variant is een aparte markdown-file. Voor lezers die dezelfde pagina op hun eigen niveau of perspectief willen lezen.

## Goals

- Lezers zien in één oogopslag welke varianten beschikbaar zijn én welke ze nu lezen
- Auteurs onderhouden iedere variant in een aparte file zodat drafts en wijzigingen niet door elkaar lopen
- Een gekozen variant is deelbaar via de URL en wordt onthouden tussen sessies
- Bij beperkte ruimte blijven alle varianten zichtbaar; de actieve houdt prioriteit

## Requirements

- Pagina's zonder `variants`-declaratie tonen geen sub-header
- Iedere variant heeft een verplichte `id` (slug, gebruikt in querystring en filename), een `label` (zichtbare tekst) en een `icon` (verplicht; zonder icon werkt het overflow-gedrag niet)
- Variant-content leeft in aparte files volgens het patroon `<page>.<variant>.<lang>.md`; tijdens het tree-bouwen collapsen die files tot één logische node (zie Section sidebar, feature 2)
- De sub-header toont alleen de variant-tabs zonder statisch label ervoor (geen "Niveau:" of "Variant:") omdat de betekenis per pagina verschilt
- Varianten kunnen gecombineerd worden met content-tabs (zie Markdown rendering & content-engine, feature 1); binnen iedere variant kan de pagina interne tabs hebben en de smart ToC blijft tab-bewust binnen de actieve variant
- De gekozen variant wordt vastgelegd in een querystring (`?variant=<id>`) zodat links deelbaar zijn
- Bij hernieuwd bezoek aan een variant-pagina wordt de laatst-gekozen variant geselecteerd (zie Settings, feature 12)
- Overflow-gedrag is collapse, geen scroll: passen alle varianten met icon + label binnen de container, dan worden ze zo getoond; passen ze niet, dan collapsen non-actieve varianten naar icon-only en blijft de actieve variant in icon + label zichtbaar
- Bij hover of focus op een gecollapsde variant verschijnt het label als tooltip
- Het `+`-icoon voor een nieuwe variant uit In-app content management (feature 11) blijft door dit collapse-gedrag altijd zichtbaar zonder sticky-positionering
- Horizontale dividers tussen secties (header, sub-header, content) lopen edge-to-edge met de outer container, zonder inset of whitespace aan de zijkanten
- De active-state-underline van een geselecteerde variant-tab landt op de divider van de container in plaats van zwevend erboven, consistent met het hoofdmenu (zie Header met dropdown-menu's, feature 3)
- Iedere variant-tab is via toetsenbord bereikbaar en navigeerbaar (WCAG 2.1 AA)
- Prev/Next-navigatie (zie Changelog en navigatie onderaan pagina, feature 6) blijft variant-bewust en valt terug op default-content als de doelpagina de variant niet heeft
