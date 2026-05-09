# View / Edit-toggle met lokale drafts

## Summary

Iedere pagina kan van lees-modus naar markdown-editor geschakeld worden. Wijzigingen worden lokaal in de browser bewaard — geen backend, geen account, geen netwerk vereist.

## Goals

- Lezers kunnen pagina's bewerken zonder account, server of netwerk
- Werk gaat nooit verloren door een refresh, tab-sluit of crash
- Drafts kunnen worden geëxporteerd zodat werk gedeeld kan worden tussen apparaten of collega's
- De gebruiker behoudt controle: niets wordt stilletjes overschreven

## Requirements

- Edit-knop zit in de pagina-actiebalk (feature 7) naast de paginatitel
- Klik op _Edit_ opent een live markdown-editor in plaats van de lees-view
- Wijzigingen worden continu lokaal opgeslagen tijdens het typen
- Een persistente banner toont _"je hebt onopgeslagen wijzigingen"_ tot de gebruiker reset of publiceert
- Drafts worden bewaard per pagina én per taal apart
- Refresh of tab sluiten en terugkomen: de draft is automatisch terug
- Bij volle browser-opslag verschijnt een banner _"lokale opslag vol — exporteer je werk of wis oude drafts"_ met directe acties
- Vanuit Settings (feature 12) kan de gebruiker alle drafts én lokale tree-mutaties exporteren als één archief in een gedocumenteerd formaat (versie + payload)
- Vanuit Settings kan de gebruiker een eerder geëxporteerd archief importeren
- Bij conflict tijdens import: bestaande lokale items winnen; geïmporteerde items met dezelfde sleutel worden behouden onder een _.imported_-suffix zodat niets stilletjes overschreven wordt
- De export/import-flow lost ook scenario's op waarin een gebruiker browser-data wist, een ander apparaat gebruikt, of werk wil delen met een collega
- Geen backend-save in deze fase — die wordt later toegevoegd via een commit/PR-flow
- De architectuur staat toe dat de lokale-storage-laag later vervangen wordt door een ruimere lokale-store of een ingelogde-gebruiker-sync zonder dat sleutels of datamodel veranderen

Vereist dat feature 1 (markdown rendering) en feature 7 (pagina-actiebalk) gebouwd zijn.
