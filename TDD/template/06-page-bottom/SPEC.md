# Page bottom

## Summary

Deze customization vervangt de standaard prev/next van de Nuxt UI docs-template door de changelog-timeline plus de prev/next-kaarten uit Changelog en navigatie onderaan pagina (feature 6), inclusief de edge-case-fallback bij een eindpunt van een sectie. Bouwt voort op de tree-bron uit Sidebar replacement.

## Goals

- Lezers zien op iedere pagina een commit-history en lineaire prev/next-navigatie
- Aan een eindpunt van een sectie blijven beide kaarten zichtbaar; de niet-beschikbare kant wijst naar een fallback één niveau hoger
- De changelog-timeline volgt dezelfde "één doorlopende lijn"-regel als de sidebar
- De template's standaard prev/next wordt volledig vervangen

## Requirements

- Onder de pagina-content rendert eerst de changelog: een verticale timeline gegroepeerd per versie met datum, en per commit eronder een hash, auteur (avatar + naam), commit-bericht en optioneel een PR-link (zie Changelog en navigatie onderaan pagina, feature 6)
- Eén doorlopende verticale lijn loopt door alle items in de timeline (versions én commits); geen dubbele lijnen of gaten, consistent met de sidebar-lijnregel uit Sidebar replacement
- Onder de changelog renderen twee prev/next-kaarten naast elkaar
- De volgorde van prev/next wordt afgeleid uit de afgevlakte sidebar-tree (zie Section sidebar, feature 2 en customization 02 Sidebar replacement) in de volgorde van de `nav`-array
- Prev/Next is variant-bewust: blijft binnen de huidige variant zolang de doelpagina die variant heeft (zie Sub-header met variant-tabs, feature 8); zo niet, fallback naar default-content
- Op de eerste pagina van een scope (geen vorige) of de laatste (geen volgende) blijven beide kaarten zichtbaar; de niet-beschikbare kant is gedimd en toont een fallback-bestemming één niveau hoger
- Hash, auteur en eventuele PR-link in de changelog zijn klikbaar en linken naar de bron
- Pagina-volgorde op het scherm is altijd: content → changelog → prev/next; geen andere blokken ertussen
- De template's standaard prev/next wordt volledig vervangen door deze customization
- De changelog werkt offline voor pagina's die in de cache staan (zie PWA en offline-werking, feature 17), zolang de commit-data is mee-gecached
- Iedere link en kaart is toetsenbord-bedienbaar (WCAG 2.1 AA)
