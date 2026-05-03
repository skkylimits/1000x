# Search

## Summary

Een command palette voor snel naar elke pagina te springen, oproepbaar via een toetsenbord-shortcut of het search-icoon in de header. Indexeert alle inhoud van het systeem.

## Goals

- Lezers vinden binnen seconden de pagina die ze zoeken, zonder door de sidebar te navigeren
- Toegankelijk via toetsenbord (Cmd/Ctrl+K) én muis (search-icoon)
- Werkt zonder netwerk in PWA-context

## Requirements

- Cmd/Ctrl+K opent een command palette overlay
- Ook bereikbaar via het search-icoon in de header (feature 3)
- Modal verschijnt centraal op het scherm met één zoek-input bovenaan
- Resultaten verschijnen tijdens het typen — incremental search
- Resultaten tonen paginatitel, breadcrumb (sectie + hoofdstuk) en optioneel een snippet met de match
- Toetsenbord-navigatie: pijltjes omhoog en omlaag om door resultaten te bewegen, Enter om te navigeren
- Sluiten via Escape of klik buiten de modal
- Search indexeert alle gerenderd content — minimaal titels, headings en body-tekst
- In-app aangemaakte pagina's (feature 11) zijn ook doorzoekbaar
- Werkt in alle ondersteunde talen (zie feature 4)
- Werkt offline in PWA-context (zie feature 17)

Vereist dat feature 1 (markdown rendering) en feature 3 (header met search-icoon) gebouwd zijn.
