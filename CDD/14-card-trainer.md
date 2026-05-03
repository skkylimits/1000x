# Card trainer

## Summary

Een leer-modus die de pagina-content omzet in flashcards, een quiz of een examen voor zelfstudie. Beschikbaar op elke pagina via de panel-switcher.

## Goals

- Lezers kunnen actief studeren op pagina-inhoud, niet alleen passief lezen
- Drie complementaire modi voor verschillende leer-momenten
- Cards kunnen handmatig worden gedefinieerd in eerste release; auto-generatie volgt later
- De trainer-overlay is groot genoeg om er in te kunnen werken zonder afgeleid te worden door de pagina

## Requirements

- _Cards_-icoon in de panel-switcher (feature 5) start de trainer
- Bij activatie verschijnt een keuzemenu voor _Flashcards_, _Quiz_ of _Exam_
- Bij keuze schuift een paneel van links naar rechts in beeld over ongeveer 70% van het scherm op desktop
- Op mobiel (feature 16): paneel neemt het hele scherm in
- Sluiten dismist het paneel terug naar links
- _Flashcards_-modus: simpele voor/achter-kant flow waarbij de gebruiker een card omdraait
- _Quiz_-modus: multiple-choice flow met antwoord-feedback per vraag
- _Exam_-modus: getimed met submit-flow voor afronding aan het eind
- Cards worden in eerste release handmatig gedefinieerd in markdown frontmatter of in een aparte file naast de pagina
- Auto-generatie uit pagina-inhoud volgt later en gebruikt de AI-laag (feature 19)

Vereist dat feature 1 (markdown rendering) en feature 5 (panel-switcher) gebouwd zijn.
