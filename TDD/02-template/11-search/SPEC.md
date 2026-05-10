# Search

## Summary

Command palette via `Cmd/Ctrl+K` of het search-icoon in de header (zie Header, customization 03) met full-text zoeken over titels, koppen, body en code-blocks. De baseline-template levert de search-pipeline; deze customization breidt de palette uit met een scope-toggle ("zoek binnen huidige sectie" vs "zoek overal"). Voor lezers die snel willen springen in plaats van klikken door de sidebar, en die bij grotere docs-trees binnen één scope willen blijven.

## Goals

- Lezers kunnen vanuit elke pagina binnen twee toetsen op een resultaat staan
- Zoekresultaten geven genoeg context (breadcrumb, snippet) om te beslissen zonder te klikken
- Lezers kunnen kiezen tussen "zoek alleen in deze sectie" en "zoek overal" zonder de palette te verlaten
- De eerste release leunt op out-of-the-box full-text search zonder eigen index-pipeline; latere iteraties zijn een upgrade-pad zonder UI-breuk
- In-app aangemaakte pagina's (zie In-app content management, feature 02 in 03-features) zijn vindbaar zodra ze bestaan

## Requirements

### Basisgedrag (uit de baseline-template)

- De command palette opent met `Cmd+K` op macOS en `Ctrl+K` op overige platforms, en via het search-icoon in de header
- Sluiten gebeurt met `Esc` of door buiten de palette te klikken
- Toetsenbord-affordances (`Cmd+K`) verschijnen alleen binnenin de geopende palette of als tooltip op het search-icoon, niet in de header-knop zelf
- Het zoekveld accepteert vrije tekst; resultaten verschijnen real-time tijdens typen
- Resultaten zijn navigeerbaar met pijltjestoetsen; `Enter` springt naar het gekozen resultaat
- Iedere resultaat-regel toont titel, breadcrumb-pad en een korte snippet
- Eerste release: indexering en matching gebeuren via de ingebouwde search-laag van het content-systeem zonder eigen pipeline

### Scope-toggle (de customization-laag)

- De command palette krijgt een extra toggle die schakelt tussen scope **"huidige sectie"** en scope **"alles"**
- "Huidige sectie" gebruikt de actieve sidebar-scope uit Section sidebar (customization 04) om de zoekruimte te beperken
- "Alles" zoekt over de hele site, identiek aan het standaard-gedrag
- De toggle is bedienbaar via klik én via toetsenbord, zonder de palette te sluiten
- De laatst-gekozen scope is de default bij hernieuwd openen (zie Settings, feature 03 in 03-features)
- Resultaten tonen de breadcrumb zodat de lezer ziet uit welke scope een resultaat komt, ook in de "alles"-modus
- De scope-toggle verandert geen UI buiten de palette; geen extra header-knop of sidebar-affordance
- Bij in-app aangemaakte pagina's werkt de scope-filter correct: een item dat lokaal binnen een scope is aangemaakt verschijnt in de "huidige sectie"-resultaten van die scope

### Architectuur en latere iteraties

- De template's standaard search-pipeline wordt niet vervangen; alleen de scope-laag wordt erbovenop gelegd zodat een latere upgrade van de search-index zonder UI-werk kan
- Latere iteraties beantwoorden expliciet wat geïndexeerd wordt (titels, headings, body, code-blocks), gedrag voor i18n (zie i18n, customization 02 in 01-foundation) (multi-locale of per-taal), offline-zoeken in PWA-context (zie PWA en offline-werking, feature 08 in 03-features), en hoe in-app aangemaakte pagina's in de zoekindex landen
- De search-laag is ontworpen zodat een upgrade naar een robuustere index-strategie (Pagefind, MiniSearch met eigen index, etc.) geen wijziging vereist in de UI

### Toegankelijkheid

- Volledige toetsenbord-bediening en WCAG 2.1 AA-compliance voor de palette en de scope-toggle
