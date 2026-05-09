# Changelog en navigatie onderaan pagina

## Summary

Onder de pagina-content verschijnt eerst een commit-history-timeline van die pagina en daarna twee prev/next-kaarten gebaseerd op de sidebar-volgorde. Voor lezers die willen zien wanneer en waarom een pagina is gewijzigd, en die door een hoofdstuk willen lezen als een boek.

## Goals

- Lezers krijgen op iedere pagina inzicht in de wijzigings-historie zonder de repository te openen
- Lezers kunnen per pagina lineair vooruit en achteruit navigeren binnen de huidige sidebar-scope én de huidige variant
- Aan een eindpunt van een sectie is altijd een logische volgende klik beschikbaar in plaats van een doodlopende kaart
- De volgorde op de pagina is voorspelbaar: content, daarna changelog, daarna prev/next

## Requirements

- Onder de pagina-content rendert eerst de changelog: een verticale timeline gegroepeerd per versie met datum, en per commit eronder een hash, auteur (avatar + naam), commit-bericht en optioneel een PR-link
- Eén doorlopende verticale lijn loopt door alle items in de timeline (versions én commits); geen dubbele lijnen of gaten, consistent met de sidebar-lijnregel (zie Section sidebar, feature 2)
- Onder de changelog renderen twee prev/next-kaarten naast elkaar
- De volgorde van prev/next wordt afgeleid uit de afgevlakte sidebar-tree (zie Section sidebar, feature 2) in de volgorde van de `nav`-array
- Prev/Next is variant-bewust: de navigatie blijft binnen de huidige variant zolang de doelpagina die variant heeft (zie Sub-header met variant-tabs, feature 8); zo niet, fallback naar default-content
- Op de eerste pagina van een scope (geen vorige) of de laatste (geen volgende) blijven beide kaarten zichtbaar; de niet-beschikbare kant is gedimd en toont een fallback-bestemming één niveau hoger (bijv. de scope-overview)
- Hash, auteur en eventuele PR-link in de changelog zijn klikbaar en linken naar de bron
- Pagina-volgorde op het scherm is altijd: content → changelog → prev/next; geen andere blokken ertussen
- De changelog werkt ook offline voor pagina's die in de cache staan (zie PWA en offline-werking, feature 17), zolang de commit-data bij de pagina is mee-gecached
- Prev/Next en alle changelog-links voldoen aan WCAG 2.1 AA en hebben een toetsenbord-equivalent
