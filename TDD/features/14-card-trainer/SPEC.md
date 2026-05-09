# Card trainer (flashcards / quiz / exam)

## Summary

Drie leer-modes — Flashcards, Quiz en Exam — beschikbaar via de Cards-knop in de panel-switcher (zie Rechter panel met conditionele panel-switcher en smart ToC, feature 5). Bij keuze schuift een groot panel van links naar rechts in beeld over de docs-content. Voor lezers die actief willen oefenen op iedere docs-pagina.

## Goals

- Lezers kunnen op iedere pagina een leer-sessie starten zonder de pagina te verlaten
- Cards zijn auteur-gestuurd in de eerste release; auto-generatie volgt later op basis van AI
- De docs-content blijft beschikbaar als context tijdens een sessie

## Requirements

- De Card trainer is bereikbaar via een knop in de panel-switcher op iedere pagina
- Bij activatie verschijnt een keuze tussen drie modes: Flashcards, Quiz en Exam
- Na keuze schuift een panel van links naar rechts in beeld dat ongeveer 70% van het scherm bedekt
- Sluiten van het panel laat het naar links wegschuiven; de docs-content komt weer volledig in beeld
- Cards worden in de eerste release gedefinieerd in de frontmatter van de pagina of in een aparte file naast de pagina
- Iedere mode toont een progress-indicator en pass/fail-feedback per card of vraag
- Op mobiel beslaat het panel het volledige scherm in plaats van 70% (zie Mobiele layout, feature 16)
- Auto-generatie van cards uit de pagina-inhoud volgt in een latere fase en gebruikt de AI-laag (zie AI assistent in slide-panel, feature 19)
- Het panel is volledig toetsenbord-bedienbaar (WCAG 2.1 AA): navigeren tussen cards, antwoorden, sluiten
- De docs-content blijft achter het panel zichtbaar als context; het panel mag niet de URL veranderen zodat de lezer in dezelfde pagina-context blijft
