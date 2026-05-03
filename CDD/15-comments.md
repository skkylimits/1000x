# Comment-systeem

## Summary

Iedere pagina heeft een eigen threaded comment-sectie met replies, likes en sortering. Bedoeld voor discussie en stemmen op verbetersuggesties. In de eerste release een frontend-stub; backend-keuze volgt later.

## Goals

- Lezers kunnen discussiëren en feedback geven per pagina
- Stemmen op verbetersuggesties wordt zichtbaar via likes
- De UI is volledig functioneel ook al is de backend nog niet gekozen
- Moderation is niet nodig in de huidige scope (intern, alleen werknemers)

## Requirements

- Comments zijn beschikbaar via een panel-optie rechts (feature 5)
- UI is een replica van een YouTube-comments-flow: threaded replies, likes, sorteer op _Top_ of _Newest_
- Iedere comment toont auteur, body, timestamp en like-aantal
- Like-knop en reply-knop zitten direct beschikbaar per comment
- Reply maakt een nieuwe thread aan; replies zijn ingesprongen onder hun parent zodat de hiërarchie visueel duidelijk is
- Sorteer-toggle bovenaan switcht tussen _Top_ en _Newest_
- Eerste release: frontend-component met read-only stub of mock-data — geen werkende backend
- Backend-keuze (eigen backend / Giscus / Discourse / andere) wordt later gemaakt
- Moderation-functionaliteit komt pas in beeld als een breder publiek toegang krijgt; niet in huidige scope

Vereist dat feature 5 (panel-switcher) gebouwd is.
