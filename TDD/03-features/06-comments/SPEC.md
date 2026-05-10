# Comment-systeem

## Summary

YouTube-stijl comments met threaded replies, likes en sortering op _Top_ of _Newest_, beschikbaar als panel-optie (zie Right panel en Smart ToC, customizations 07 en 08 in 02-template). Bedoeld voor vragen, feedback en stemmen op verbetersuggesties via de like-functie.

## Goals

- Lezers kunnen op iedere pagina-context vragen en feedback achterlaten
- Threaded replies en likes zijn duidelijk zichtbaar zodat populaire feedback bovenaan komt
- Eerste release levert de frontend-component zodat backend-keuze later gemaakt kan worden zonder UI-werk
- Moderation komt pas in beeld zodra een breder publiek toegang krijgt

## Requirements

- Comments zijn beschikbaar als panel-optie in de panel-switcher op iedere pagina
- Het comments-panel toont sorteer-tabs bovenaan met de keuzes _Top_ en _Newest_
- Onder de sorteer-tabs verschijnt een lijst van comment-items met avatar, naam, tijd, body, like-knop en _reply_-affordance
- Replies zijn ingesprongen onder hun parent (threaded)
- Likes vormen het stem-mechanisme voor _Top_-sortering
- Eerste release: read-only stub of mock-data; schrijven is mogelijk pas zodra een identity-laag beschikbaar is
- De backend-keuze (eigen backend, externe service, etc.) wordt later gemaakt; de frontend-component is daarvoor agnostisch
- Moderation-functionaliteit (verwijderen, rapporteren, markeren) is in de huidige scope niet vereist en komt pas zodra de gebruikersgroep daarom vraagt
- Iedere comment-actie en sorteer-tab is toetsenbord-bedienbaar (WCAG 2.1 AA)
- Op mobiel werkt het panel volgens de mobiele layout (zie Mobiele layout, feature 07 in 03-features)
