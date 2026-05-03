# Settings

## Summary

Een instellingen-pagina waar de gebruiker voorkeuren beheert — taal, thema, editor-voorkeuren en draft-beheer. Ontworpen als kaart-grid waar elk onderwerp zijn eigen kaart heeft.

## Goals

- Alle gebruiker-instellingen op één centrale plek
- Drafts kunnen geëxporteerd, geïmporteerd of gewist worden
- UI-state-keuzes (panel, sidebar, variant) zijn resetbaar
- Wijzigingen zijn direct actief — geen "save"-knop nodig per kaart

## Requirements

- Settings is een eigen pagina of dialog, ontworpen als kaart-grid waarin elke kaart één onderwerp dekt
- Bereikbaar via het Settings-icoon in de header (feature 3)
- Kaart _Voorkeurstaal_: NL/EN-keuze, koppelt aan i18n (feature 4)
- Kaart _Thema_: light/dark, plus keuze uit beschikbare font-families en accent-kleuren binnen het ontwerp-systeem
- Kaart _Editor-voorkeuren_: fontgrootte, regel-hoogte, tab-size, optionele vim-mode (instelling voor feature 13)
- Kaart _Drafts beheren_: _Export drafts_ als archief, _Import drafts_ vanuit archief, en _Wis alle lokale drafts_ met bevestigingsdialog (zie feature 10 en 11)
- Kaart _Profiel-informatie_: naam, avatar, e-mail, _wachtwoord wijzigen_-link — zichtbaar maar grotendeels niet-functioneel in de eerste release; volledig actief vanaf latere fase met IAM
- Kaart _UI-state reset_: wist alle onthouden UI-keuzes (panel-keuze, sidebar collapse-state, gekozen variant, gekozen content-tab)
- Wijzigingen aan een kaart zijn direct actief, geen save-knop per kaart
- Destructieve acties (drafts wissen, UI-state reset) hebben een bevestigingsdialog
- UI-state wordt in eerste release lokaal bewaard
- Vanaf latere fase met identity-laag verhuist UI-state naar het gebruikersprofiel zodat hij over apparaten heen synct

Vereist dat feature 4 (i18n), feature 10 (drafts) en feature 11 (lokale tree-mutations voor export) gebouwd zijn.
