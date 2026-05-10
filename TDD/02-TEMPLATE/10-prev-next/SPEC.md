# Prev / next

## Summary

Deze customization vervangt de OOTB `queryCollectionItemSurroundings`-walk door een prev/next die leest uit `useNavTree` (zie Section sidebar, customization 02). Reden: OOTB walkt de hele collection plat zonder scope-besef, dus zou prev aan het eind van Git automatisch doorspringen naar /syntax/javascript. Onze tree weet al wat een scope-grens is en wat een tabs-container leaf is; één walk op die tree is goedkoper dan eerst OOTB roepen en het resultaat dan filteren. Level-awareness komt gratis via URL-nesting (zie Levels, customization 04 — folder-based levels betekent dat een walk binnen de scope vanzelf binnen de actieve level blijft). Voor lezers die door een hoofdstuk willen lezen als een boek.

## Goals

- Lezers kunnen per pagina lineair vooruit en achteruit navigeren binnen de huidige sidebar-scope
- Aan een eindpunt van een scope is altijd een logische volgende klik beschikbaar in plaats van een doodlopende kaart
- Geen sprongen tussen secties: einde van Git → géén volgende = volgende JavaScript-pagina
- De wrapper extends OOTB; geen replace van de Nuxt Content prev/next-pipeline

## Requirements

- Onder de changelog (zie Changelog, customization 09) renderen twee prev/next-kaarten naast elkaar
- De volgorde wordt afgeleid uit de afgevlakte sidebar-tree (zie Section sidebar, customization 02) in de volgorde van de `nav`-array, gefilterd op de huidige scope
- Bij pagina's onder een levels-container (zie Levels, customization 04): prev/next blijft natuurlijk binnen de actieve level want de routes zijn folder-based nested. Geen aparte level-resolver nodig
- Bij pagina's onder een tabs-container (zie Tabs, customization 05): tabs zijn alternatieven, geen sequentie. Prev/next slaat tabs-children over of dimmt ze (open keuze; default: prev/next van de tabs-container is de buur van de tabs-container, niet de individuele tabs)
- Op de eerste pagina van een scope (geen vorige) of de laatste (geen volgende) blijven beide kaarten zichtbaar; de niet-beschikbare kant is gedimd en toont een fallback-bestemming één niveau hoger (bv. de scope-overview of de naburige scope)
- Pagina-volgorde op het scherm is altijd: content → changelog → prev/next; prev/next staat onderaan de pagina
- De template's standaard prev/next wordt volledig vervangen; geen mengvorm
- Iedere kaart is toetsenbord-bedienbaar (WCAG 2.1 AA)

## Constraints

- **Geen file-suffix-magic** voor varianten; URL bepaalt prev/next-doel (variant-aware-resolver is overbodig dankzij folder-based levels in Levels customization 04)
- **Geen cross-scope prev/next** — je verlaat een scope alleen via header, sidebar of een levels/tabs-bar
- **Geen aparte querystring-state** voor prev/next; URL is single source of truth
