---
title: Prose Test Pagina
description: Een test-pagina die alle basis-markdown-elementen oefent voor visuele verificatie van de typografie
schemaVersion: 1
---

Deze pagina dient als visuele smoke-test voor de basis-typografie van Nuxt Content. Alle elementen hieronder horen leesbaar en consistent gestyled te zijn voordat we doorgaan naar code-blokken (stap 2) en MDC-blokken (stap 3).

## Hoofdstuk-niveau (H2)

Een H2 markeert een hoofdsectie binnen een pagina. De ankerlink rechts naast de titel hoort zichtbaar te worden bij hover, zodat je een directe link naar deze sectie kunt kopiëren.

### Sub-sectie (H3)

Onder een H2 hangen H3's voor sub-onderwerpen. Elk hoort iets kleiner gerenderd te worden dan de H2 erboven, met voldoende ruimte erboven om de hiërarchie visueel duidelijk te houden.

#### Detail-niveau (H4)

H4 is het laagste niveau dat we gebruiken. Dieper geneste headings zijn een teken dat de pagina opgesplitst moet worden in tabs of aparte pagina's.

## Lijsten

Een ongeordende lijst voor opsommingen zonder volgorde:

- Leesbaarheid is belangrijker dan beknoptheid
- Functies horen één ding goed te doen
- Tests beschrijven het gedrag, niet de implementatie
	- Geneste regel: integratie-tests beschrijven gedrag over meerdere modules heen
	- Geneste regel: unit-tests beschrijven gedrag van één functie
- Code die niet bestaat heeft geen bugs

Een geordende lijst voor stappen die in volgorde uitgevoerd horen te worden:

1. Begrijp het probleem voor je code schrijft
2. Schrijf de simpelste oplossing die werkt
3. Refactor pas als het patroon zich drie keer herhaalt
4. Documenteer alleen wat niet uit de code zelf af te lezen is

## Citaten en inline-elementen

> Het schrijven van leesbare code is een vorm van respect voor de volgende ontwikkelaar — vaak ben je dat zelf, zes maanden later.

In een paragraaf kun je `inline code` gebruiken voor symboolnamen, **vetgedrukte tekst** voor nadruk, en *cursieve tekst* voor lichte accenten. Combinaties zoals **belangrijke `variabelenaam`** horen ook nog leesbaar te blijven.

## Links

Een interne link naar de [home-pagina](/) en een externe link naar de [Nuxt-documentatie](https://nuxt.com). Beide horen in de accent-kleur (rood) gestyled te worden, met onderscheid tussen interne en externe links waar relevant.

---

## Tabel

Een vergelijking van drie programmeertalen op een paar dimensies:

| Taal       | Typesysteem         | Primair gebruiksgebied             |
| ---------- | ------------------- | ---------------------------------- |
| TypeScript | Statisch, gradueel  | Webapplicaties, frontend en server |
| Rust       | Statisch, strikt    | Systems programming, performance   |
| Python     | Dynamisch, optional | Data, scripting, prototyping       |
