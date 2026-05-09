# Pagina-actiebalk

## Summary

Een rij actie-knoppen inline naast de paginatitel met de meest gebruikte acties op de huidige pagina: schakelen tussen lezen en bewerken, en het kopiëren of openen van de pagina-inhoud in andere tools.

## Goals

- Acties op de pagina (lezen/bewerken, kopiëren, openen elders) zijn binnen handbereik
- Acties zijn visueel gegroepeerd zodat semantisch verschillende acties niet door elkaar lopen
- De actiebalk neemt geen aparte rij in beslag — hij hoort bij de titel

## Requirements

- Vier knoppen, gegroepeerd in twee segmented buttons, inline rechts naast de paginatitel (H1) — niet als losse rij erboven
- Eerste segmented button: _View_ | _Edit_, één gedeelde border, geen gap tussen segmenten, één verticale divider, het actieve segment heeft een gevulde achtergrond, het andere blanco
- Tweede segmented button: _Copy page_ + dropdown-chevron, één gedeelde rounded border, één verticale divider tussen tekst en chevron, identieke hoogte
- Tussen de twee groepen zit een kleine gap — dat zijn semantisch verschillende acties
- Binnen elke groep: alles aaneengesloten, geen whitespace, identieke hoogte
- Klik op _View_ of _Edit_ wisselt tussen lees- en bewerkmodus (zie feature 10)
- Klik op _Copy page_ kopieert de hele pagina-inhoud naar het klembord
- Klik op de chevron opent een dropdown met opties: _Copy as markdown_, _Open in Claude_, _Open in ChatGPT_, _View as markdown_
- Toekomstige dropdown-opties (niet in eerste release): _Genereer PowerPoint_ en _Genereer documentatie_ — afhankelijk van de AI-laag (feature 19)
- Op extra-smalle schermen collapsed de hele actiebalk naar een dropdown-menu (zie feature 16)

Vereist dat feature 1 (markdown rendering) gebouwd is.
