# Internationalisatie

## Summary

Het systeem draait standaard in het Nederlands met Engels als secundaire taal. UI-tekst en content zijn beide vertaalbaar; nieuwe talen kunnen later worden toegevoegd zonder herstructurering.

## Goals

- Lezers kiezen hun voorkeurstaal en de hele applicatie volgt: UI én content
- Nieuwe talen kunnen later worden toegevoegd zonder bestaande pagina's of code te raken
- Lokale wijzigingen (drafts, content-mutaties) blijven gescheiden per taal
- I18n is vanaf het begin in alle componenten verweven, niet later geretrofit

## Requirements

- Standaardtaal is Nederlands; Engels is beschikbaar als tweede taal
- Alle UI-strings worden geserveerd via translation files — geen hardcoded teksten in componenten
- Markdown content wordt per taal aangeboden in aparte bestanden (bv. `page.nl.md` en `page.en.md`)
- Taal kan gecombineerd worden met varianten (zie feature 8); een variant heeft per taal zijn eigen bestand (bv. `page.junior.nl.md`)
- De taalkeuze is bereikbaar via het taal-icoon in de header (feature 3); een picker toont de beschikbare talen met een selectie-indicator
- De gekozen taal wordt onthouden over sessies heen
- Lokale opslag (drafts, content-mutaties) is gescheiden per taal — sleutels bevatten een taal-component
- Pagina's tonen indien beschikbaar de variant in de gekozen taal; bij ontbreken volgt een fallback naar default-content met indicator dat alleen de andere taal beschikbaar is
- Nieuwe talen toevoegen vergt alleen een translation-file en eventueel content-vertalingen — geen architectuur-aanpassingen

Vereist dat feature 1 (markdown rendering) en feature 3 (header met taal-icoon) gebouwd zijn.
