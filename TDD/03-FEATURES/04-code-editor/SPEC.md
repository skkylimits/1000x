# Code-editor met browser-based execution

## Summary

Code-editor als panel-optie in de panel-switcher (zie Right panel en Smart ToC, customizations 07 en 08 in 02-TEMPLATE) op pagina's met een programmeertaal of code-use-case; alle execution draait client-side zonder sandbox-backend. Iedere hoofdstukpagina kan een challenge bevatten met directe pass/fail-feedback. Voor lezers die programmeren en security willen oefenen in de browser.

## Goals

- Lezers kunnen code schrijven en uitvoeren zonder iets te installeren of een server-call te maken
- Iedere taal die wordt toegevoegd kiest zelf de runtime; één faalde runtime raakt geen andere talen
- Challenges geven directe pass/fail-feedback zodat oefenen iteratief is
- User-code kan geen netwerkaanvallen of data-exfiltratie uitvoeren tegen de host
- De editor blijft offline werken zodra de runtime is gecached (zie PWA en offline-werking, feature 08 in 03-FEATURES)

## Requirements

- De code-editor verschijnt als panel-optie alleen op pagina's met een programmeertaal of code-use-case (Syntax-module, delen van Xpl01ts en Lab)
- Switchen naar de code-editor vervangt de ToC tijdelijk; de resize-handle blijft werken zodat de editor breder kan
- Iedere hoofdstukpagina kan een challenge bevatten met directe pass/fail-feedback
- Execution-model: alle code draait client-side in een geïsoleerde worker; voor JavaScript direct, voor andere talen via een vooraf-gecompileerde WebAssembly-runtime
- De runtime per taal wordt gekozen op het moment dat die taal wordt toegevoegd; geen vooraf vastgelegde matrix
- Tests/assertions draaien in de worker en sturen een pass/fail-signaal terug
- Bij een runtime-failure (CDN-blok, corrupt bundle, browser-incompatibel) toont de editor een melding en blijft de code bewerkbaar; geen netwerk-call breekt de pagina
- Een runtime-failure voor één taal raakt geen andere talen of paginafuncties
- User-code heeft geen netwerk-toegang in de eerste release: `fetch`, `XMLHttpRequest` en sockets zijn geblokkeerd in de execution-omgeving
- Voor talen met een package-ecosysteem geldt een whitelist van vooraf goedgekeurde packages; imports buiten de whitelist worden geweigerd
- De content-security policy van de site is strikt over `connect-src` (alleen eigen origin en de AI-route); user-code kan geen externe origin bereiken
- Editor-voorkeuren (fontgrootte, regel-hoogte, tab-size, optionele vim-mode) zijn instelbaar via Settings (zie Settings, feature 03 in 03-FEATURES)
- Op mobiel wordt de editor full-screen zodat de gebruiker genoeg ruimte heeft om te typen (zie Mobiele layout, feature 07 in 03-FEATURES)
- Iedere editor-actie en run-knop is toetsenbord-bedienbaar (WCAG 2.1 AA)
