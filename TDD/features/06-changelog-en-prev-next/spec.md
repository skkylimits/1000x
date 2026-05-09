# Changelog en navigatie onderaan pagina

## Summary

Onderaan elke pagina staat een blok met de wijzigingsgeschiedenis, gevolgd door snelkoppelingen naar de vorige en volgende pagina in leesvolgorde.

## Goals

- Lezers kunnen op één plek zien wanneer een pagina voor het laatst is bijgewerkt en door wie
- Sequentiële navigatie tussen aangrenzende pagina's is altijd één klik weg
- De gebruiker voelt zich nooit "opgesloten" op een eindpunt — er is altijd een vervolg

## Requirements

- Direct onder de content rendert een changelog-blok met de wijzigingsgeschiedenis
- Changelog wordt weergegeven als een **verticale timeline gegroepeerd per versie**, in Nuxt UI Pro changelog-stijl
- Per versie wordt getoond: tag-icoon, versie-badge (bv. `v0.3`), datum van die versie
- Per commit binnen een versie wordt getoond: commit-hash (kort), auteur (avatar plus naam), commit-bericht en optioneel een PR-nummer als link
- Eén doorlopende verticale lijn loopt links door alle items — door versies én door de commits eronder. Geen twee parallelle lijnen
- Daaronder staan twee kaarten naast elkaar van gelijke breedte met chevron-iconen, voor _Vorige_ en _Volgende_ pagina
- Volgorde op de pagina is altijd: content → changelog → prev/next
- Prev/Next volgt de structuur van de zijbalk — sequentiële leesvolgorde binnen de huidige sectie
- Op de eerste pagina van een sectie (geen vorige) of de laatste pagina (geen volgende) blijven beide kaarten zichtbaar
- De niet-beschikbare kaart is gedimd en toont een fallback-bestemming één niveau hoger (bv. _"Sectie-overzicht"_ als de gebruiker op de eerste pagina van een sectie zit)
- Prev/Next is variant-bewust: het navigeert binnen de huidige variant zolang de doelpagina die variant ook heeft, anders fallback naar default-content

Vereist dat feature 1 (markdown rendering) en feature 2 (section sidebar voor leesvolgorde) gebouwd zijn.
