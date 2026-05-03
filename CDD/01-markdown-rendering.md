# Markdown rendering & content-engine

## Summary

Pagina's worden geschreven in markdown en gerenderd als gestylede, interactieve documentatie. Dit is de basis-laag waar alle andere features op rusten — zonder gerenderde markdown is er geen pagina om te lezen, te bewerken of mee te interacteren.

## Goals

- Lezers kunnen pagina's met opgemaakte content lezen: koppen, code, tabs, callouts en media
- Lange pagina's kunnen gecondenseerd worden zonder de bron-file op te splitsen
- Content blijft eenvoudig te onderhouden in markdown — één bron-bestand per pagina
- Het frontmatter-schema is forward-compatible zodat refactoren mogelijk blijft zonder honderden pagina's handmatig aan te passen

## Requirements

- Headings van H1 tot en met H4 zijn ondersteund, met klikbare anchor-links die deelbare URL-fragmenten genereren
- Code blocks tonen syntax highlighting per taal en hebben een copy-knop
- In-page tabs splitsen lange pagina's in sub-secties zonder de file op te delen; iedere tab heeft eigen H2/H3-koppen
- Bij meer tabs dan in beeld passen scrollt de tab-rij horizontaal — touch-swipe, trackpad-scroll en shift+scrollwheel werken native
- Een subtiele schaduw aan de zichtbare rand van een scrollende tab-rij signaleert dat er meer tabs zijn
- Callouts, afbeeldingen en embedded media zijn ondersteund
- Assets (afbeeldingen, media) leven in een vaste mappenstructuur die de content-tree spiegelt — één bron-locatie, makkelijk te vinden
- UI-screenshots blijven taal-onafhankelijk waar mogelijk; alleen écht taal-gevoelige beelden krijgen per taal een eigen versie
- Iedere pagina heeft impliciet een schema-versie via frontmatter (default versie 1)
- Onbekende frontmatter-velden geven tijdens development een waarschuwing maar laten de pagina gewoon renderen — geen crashes
- Bij breaking changes in het frontmatter-schema kan een pagina worden gemigreerd via een versie-ophoging die oude velden naar de nieuwe vorm vertaalt
- Toekomstige content-ingestie kan externe bronnen (video's, social posts, nieuwsartikelen) automatisch omzetten naar markdown-pagina's met frontmatter — output blijft een gewoon markdown-bestand zodat de rest van het systeem niets hoeft te weten van de bron
