# Changelog

## Summary

Deze customization rendert onder de pagina-content een changelog-timeline met versie-grouping en commit-details (hash, auteur, bericht, optionele PR-link). De Nuxt UI docs-template levert geen changelog-surface; dit is een toevoeging op het content-pad. Voor lezers die willen zien wanneer en waarom een pagina is gewijzigd zonder de repository te openen.

## Goals

- Lezers krijgen op iedere pagina inzicht in de wijzigings-historie zonder de repository te openen
- De changelog-timeline volgt dezelfde "één doorlopende lijn"-regel als de sidebar
- De positie op de pagina is voorspelbaar: changelog komt direct onder de content, vóór prev/next

## Requirements

- Onder de pagina-content rendert eerst de changelog: een verticale timeline gegroepeerd per versie met datum, en per commit eronder een hash, auteur (avatar + naam), commit-bericht en optioneel een PR-link
- Eén doorlopende verticale lijn loopt door alle items in de timeline (versions én commits); geen dubbele lijnen of gaten, consistent met de sidebar-lijnregel (zie Section sidebar, customization 02)
- Hash, auteur en eventuele PR-link zijn klikbaar en linken naar de bron
- Pagina-volgorde op het scherm is altijd: content → changelog → prev/next (zie Prev/next, customization 10); geen andere blokken ertussen
- De changelog werkt offline voor pagina's die in de cache staan (zie PWA en offline-werking, feature 08 in 03-features), zolang de commit-data is mee-gecached
- Iedere link is toetsenbord-bedienbaar (WCAG 2.1 AA)
