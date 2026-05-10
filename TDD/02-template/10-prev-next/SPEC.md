# Prev / next

## Summary

Deze customization vervangt de standaard prev/next van de Nuxt UI docs-template door variant-aware prev/next-kaarten gebaseerd op de sidebar-volgorde uit `useNavTree()`. De template's prev/next is platte volgorde-walker over `queryCollectionItemSurroundings`; deze customization wraps dat met variant-awareness en een sensible fallback aan de scope-randen. Voor lezers die door een hoofdstuk willen lezen als een boek, ook wanneer ze in een specifieke variant zitten.

## Goals

- Lezers kunnen per pagina lineair vooruit en achteruit navigeren binnen de huidige sidebar-scope én de huidige variant
- Aan een eindpunt van een sectie is altijd een logische volgende klik beschikbaar in plaats van een doodlopende kaart
- De template's standaard prev/next wordt volledig vervangen door deze variant-bewuste wrapper

## Requirements

- Onder de changelog (zie Changelog, customization 09) renderen twee prev/next-kaarten naast elkaar
- De volgorde wordt afgeleid uit de afgevlakte sidebar-tree (zie Section sidebar, customization 02) in de volgorde van de `nav`-array
- Prev/Next is variant-bewust: blijft binnen de huidige variant zolang de doelpagina die variant heeft (zie Variant tabs, customization 03); zo niet, fallback naar default-content
- Op de eerste pagina van een scope (geen vorige) of de laatste (geen volgende) blijven beide kaarten zichtbaar; de niet-beschikbare kant is gedimd en toont een fallback-bestemming één niveau hoger (bv. de scope-overview)
- Pagina-volgorde op het scherm is altijd: content → changelog → prev/next; prev/next staat onderaan de pagina
- De template's standaard prev/next wordt volledig vervangen; geen mengvorm
- Iedere kaart is toetsenbord-bedienbaar (WCAG 2.1 AA)
