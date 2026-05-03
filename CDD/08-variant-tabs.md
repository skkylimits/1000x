# Sub-header met variant-tabs

## Summary

Een optionele tweede nav-rij onder de hoofdheader voor pagina's die meerdere _varianten_ van dezelfde inhoud aanbieden — skill-niveaus, perspectieven, OS-keuzes etc. Verschijnt alleen op pagina's die er bewust voor opt-in.

## Goals

- Eén pagina kan meerdere doorsnedes van een onderwerp aanbieden zonder dat verschillende doelgroepen elkaars content hoeven te zien
- Welke varianten beschikbaar zijn is per pagina anders — generiek genoeg voor meerdere use cases (skill-levels, perspectives, OS, etc.)
- Variant-keuze is deelbaar via een URL-parameter
- Bij ruimtegebrek blijft het overzicht behouden; opties verdwijnen niet uit beeld

## Requirements

- Sub-header verschijnt alleen op pagina's die varianten declareren in hun frontmatter; pagina's zonder declaratie hebben geen sub-header
- Iedere variant heeft drie velden: een unieke identifier (gebruikt in URL en filename), een zichtbaar label, en een verplicht icoon
- Het icoon-veld is verplicht omdat het collapse-gedrag erop leunt
- De sub-header toont alleen de variant-tabs, zonder statisch label ervoor — geen _"Niveau:"_ of _"Variant:"_ — omdat de betekenis per pagina verschilt en elk vast label op een volgende pagina misleidend zou zijn
- Iedere variant heeft eigen content in een aparte file
- Varianten en content-tabs (feature 1) kunnen gecombineerd worden op één pagina; de ToC blijft tab-bewust binnen de actieve variant
- De gekozen variant wordt onthouden in een URL-parameter zodat links deelbaar zijn
- Overflow-gedrag: als alle varianten met icon + label binnen de container passen, alles zo tonen; passen ze niet, dan collapsen niet-actieve varianten naar icon-only
- De actieve variant blijft altijd in icon + label zichtbaar — gebruiker weet altijd waar hij is
- Bij hover of focus op een collapsed variant verschijnt het label als tooltip
- Variant-tab-overflow gedraagt zich expliciet anders dan content-tabs (feature 1, horizontaal scrollen): variant-tabs zijn een prominente navigatie-keuze waar alle opties in één oogopslag zichtbaar moeten zijn
- Een _+_-knop aan het einde voegt een nieuwe variant toe (zie feature 11) en blijft daardoor altijd zichtbaar zonder sticky-positionering
- Active-state-underline van een geselecteerde tab landt exact op de bottom-divider van de sub-header — niet zwevend met een gat ertussen
- Horizontale dividers tussen sub-secties lopen edge-to-edge met de container, geen inset of whitespace aan de zijkanten
- Prev/Next-navigatie (feature 6) blijft variant-bewust: navigeer binnen de huidige variant waar mogelijk

Vereist dat feature 1 (markdown rendering), feature 3 (header voor positionering) en feature 4 (i18n voor taal-variant-combinatie) gebouwd zijn.
