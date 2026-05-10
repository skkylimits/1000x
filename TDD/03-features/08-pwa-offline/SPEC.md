# PWA en offline-werking

## Summary

De app is installeerbaar op desktop en mobiel via een Web App Manifest, en werkt offline via een service-worker met cache-as-you-go. Lezers kunnen daarnaast per module expliciet content downloaden voor offline gebruik. Voor lezers die in trein, vliegtuig of op locatie willen blijven werken zonder netwerk.

## Goals

- Lezers kunnen de app als native ervaring installeren op alle gangbare platforms
- Pagina's die de lezer al heeft bezocht zijn offline beschikbaar zonder iets aan te zetten
- Een module kan in één klik volledig naar offline worden gehaald, met duidelijke voortgang en grootte
- Drafts (zie View / Edit-toggle met lokale drafts, feature 01 in 03-features), lokale tree-mutaties (zie In-app content management, feature 02 in 03-features) en code-execution (zie Code-editor met browser-based execution, feature 04 in 03-features) blijven offline werken
- Eerste site-bezoek blijft licht: geen blanket precache van alle content

## Requirements

- De app is installeerbaar via een Web App Manifest met icon, naam en theme-color
- Een service-worker levert offline-werking met cache-as-you-go: bezochte pagina's én hun assets (CSS, JS, fonts, images) blijven daarna offline beschikbaar
- Geen blanket precache in de eerste release; eerste bezoek aan de site blijft klein
- Niet-bezochte pagina's tonen offline een fallback-melding met duidelijke uitleg en eventueel een verwijzing naar wel-beschikbare content
- Per module is er een knop _"Download voor offline"_ die de hele module-content forceert in de cache
- De module-grootte wordt vooraf getoond zodat de gebruiker een geïnformeerde keuze kan maken
- Tijdens download verschijnt een voortgangsindicator
- Drafts en lokale tree-mutaties leven in lokale browser-opslag en werken sowieso offline
- Code-execution (zie Code-editor met browser-based execution, feature 04 in 03-features) blijft offline werken zodra de WASM-runtime in de cache zit
- De search (zie Search, customization 11 in 02-template) heeft in latere iteraties een offline-mode-strategie; de eerste release maakt geen sterke offline-search-belofte
- Bij een service-worker-update krijgt de gebruiker een prompt of automatische refresh zonder dat lopende drafts verloren gaan
- Iedere offline-affordance (download-knop, offline-melding) is toetsenbord-bedienbaar en voldoet aan WCAG 2.1 AA
