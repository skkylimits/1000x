# View / Edit-toggle met lokale drafts

## Summary

Iedere pagina heeft een live markdown-editor in edit-modus; alle wijzigingen worden lokaal in de browser bewaard per pagina én per taal. Geen backend, geen account, geen netwerk in de eerste release. Voor lezers die direct correcties of aanvullingen willen maken zonder een publicatie-flow te doorlopen.

## Goals

- Lezers kunnen vanuit elke pagina edits beginnen zonder iets te installeren of in te loggen
- Drafts overleven een refresh, een browser-restart en het wisselen tussen pagina's
- Bij vol lokaal opslag verliest de gebruiker geen werk: er is altijd een export-route en een waarschuwing op tijd
- Drafts zijn deelbaar of overdraagbaar tussen browsers en apparaten via export/import
- Een latere migratie naar grotere lokale opslag of naar een backend-flow vereist geen UI-wijziging

## Requirements

- De View/Edit-toggle in de pagina-actiebalk (zie Page chrome, customization 06 in 02-template) wisselt de pagina tussen gerenderde view en een live markdown-editor
- Edits worden continu lokaal in de browser bewaard per pagina én per taal (zie Internationalisatie, i18n, customization 02 in 01-foundation); een NL-edit raakt nooit de EN-versie en omgekeerd
- Na refresh, browser-restart of paginawissel komt een lopende draft automatisch terug; een banner _"je hebt onopgeslagen wijzigingen"_ blijft zichtbaar tot de gebruiker hem reset
- Bij volle lokale opslag (quota exceeded) verschijnt een melding _"lokale opslag vol — exporteer je werk of wis oude drafts"_ met directe acties zodat geen werk verloren gaat
- Vanuit Settings (zie Settings, feature 03 in 03-features) kan de gebruiker alle drafts en lokale tree-mutaties (zie In-app content management, feature 02 in 03-features) exporteren als één ZIP in een gedocumenteerd JSON-formaat met versie en payload
- Vanuit Settings kan de gebruiker een eerder geëxporteerde ZIP importeren; conflict-strategie is dat bestaande lokale items winnen en geïmporteerde items met dezelfde sleutel onder een suffix worden bewaard zodat niets stilletjes overschreven wordt
- Export/import dekt ook scenario's waarin een gebruiker browser-data wist, een ander apparaat gebruikt of werk wil delen met een collega
- De storage-laag is ontworpen zodat een latere migratie naar een grotere browser-storage geen sleutel- of datamodel-wijziging vereist
- Latere fases laten ruimte voor backend-save (publish naar een PR-flow met markdown als bron van waarheid), drafts-per-gebruiker en real-time collab; geen van die fases breken de eerste release
- Iedere edit-actie heeft een toetsenbord-equivalent en de editor voldoet aan WCAG 2.1 AA
