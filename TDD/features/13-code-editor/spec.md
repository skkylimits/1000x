# Code-editor met browser-based execution

## Summary

Programmeertaal-pagina's hebben een runnable code-editor die code direct in de browser uitvoert, met directe pass/fail-feedback per challenge. Geen execution-backend in de eerste release.

## Goals

- Lezers oefenen programmeren met directe feedback, zonder de browser te verlaten
- Iedere taal-runtime laadt onafhankelijk; uitval van één taal raakt geen andere
- Geen netwerk- of backend-dependency voor het uitvoeren van code
- Veiligheid: code uitvoeren is geïsoleerd van de site en de gebruiker

## Requirements

- Code-editor is beschikbaar als panel-optie in de panel-switcher (feature 5), niet als losse knoppenrij
- Editor-knop verschijnt alleen op pagina's met een programmeertaal of andere code-use-case
- Switchen naar de editor vervangt tijdelijk de ToC binnen het paneel; de drag-handle blijft werken zodat de editor breder kan
- Editor heeft syntax highlighting, regelnummers en optionele vim-mode (instelbaar via Settings, feature 12)
- Iedere taal-pagina bevat een _challenge_ in de editor met start-code en een opdracht-beschrijving
- _Run_-knop voert de code uit; output verschijnt onder de editor
- Tests draaien automatisch en geven pass/fail-feedback
- Code-uitvoering gebeurt volledig client-side — geen sandbox-backend in deze fase
- De runtime per taal wordt gekozen op het moment dat de taal wordt toegevoegd, niet vooraf vastgelegd in een matrix
- Een runtime-failure voor één taal raakt geen andere talen of pagina-functies; het is altijd één taal-runtime tegelijk
- Failure-UX: als een runtime niet kan laden (bv. CDN-blok, corrupt bundle, browser-incompatibel), toont de editor een melding en blijft de code bewerkbaar — de gebruiker kan blijven leren, alleen niet runnen
- Geen netwerk-toegang vanuit user-code: fetch, XMLHttpRequest en sockets zijn geblokkeerd om data-exfiltratie via challenge-code te voorkomen
- Voor talen met een package-ecosysteem geldt een whitelisted-packages-policy; alleen vooraf goedgekeurde packages zijn beschikbaar, de runtime weigert imports van andere modules
- De whitelist groeit per onderwerp/hoofdstuk naarmate er behoefte ontstaat
- Op mobiel: editor opent als full-screen modal voor genoeg typeruimte (zie feature 16)

Vereist dat feature 1 (markdown rendering) en feature 5 (panel-switcher) gebouwd zijn.
