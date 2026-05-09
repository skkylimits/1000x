# Search

## Summary

Command palette via Cmd/Ctrl+K of het search-icoon in de header (zie Header met dropdown-menu's, feature 3) met full-text zoeken over titels, koppen, body en code-blocks. Voor lezers die snel willen springen in plaats van klikken door de sidebar.

## Goals

- Lezers kunnen vanuit elke pagina binnen twee toetsen op een resultaat staan
- Zoekresultaten geven genoeg context (breadcrumb, snippet) om te beslissen zonder te klikken
- De eerste release leunt op out-of-the-box full-text search zonder eigen index-pipeline; latere iteraties zijn een upgrade-pad zonder UI-breuk
- In-app aangemaakte pagina's (zie In-app content management, feature 11) zijn vindbaar zodra ze bestaan

## Requirements

- De command palette opent met Cmd+K op macOS en Ctrl+K op overige platforms, en via het search-icoon in de header
- Sluiten gebeurt met Esc of door buiten de palette te klikken
- Toetsenbord-affordances (`Cmd+K`) verschijnen alleen binnenin de geopende palette of als tooltip op het search-icoon, niet in de header-knop zelf
- Het zoekveld accepteert vrije tekst; resultaten verschijnen real-time tijdens typen
- Resultaten zijn navigeerbaar met pijltjestoetsen; Enter springt naar het gekozen resultaat
- Iedere resultaat-regel toont titel, breadcrumb-pad en een korte snippet
- Eerste release: indexering en matching gebeuren via de ingebouwde search-laag van het content-systeem zonder eigen pipeline
- Latere iteraties beantwoorden expliciet wat geïndexeerd wordt (titels, headings, body, code-blocks), gedrag voor i18n (zie Internationalisatie, feature 4) (multi-locale of per-taal), offline-zoeken in PWA-context (zie PWA en offline-werking, feature 17), en hoe in-app aangemaakte pagina's in de zoekindex landen
- De search-laag is ontworpen zodat een upgrade naar een robuustere index-strategie geen wijziging vereist in de UI
- Volledige toetsenbord-bediening en WCAG 2.1 AA-compliance voor de palette
