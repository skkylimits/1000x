# Settings

## Summary

Eigen pagina of dialog in kaart-stijl voor gebruiker-voorkeuren: taal, thema, editor-instellingen, drafts beheren, profiel en UI-state reset. Dient ook als centraal punt voor het data-loss safety net (export/import drafts). Voor lezers om hun werkomgeving te tunen.

## Goals

- Lezers vinden alle voorkeuren op één plek zonder door verschillende menu's te zoeken
- Drafts en lokale tree-mutaties zijn altijd exporteerbaar zodat geen werk verloren gaat (zie View / Edit-toggle met lokale drafts, feature 01 in 03-features en In-app content management, feature 02 in 03-features)
- Destructieve acties zoals _Wis alle drafts_ en _UI-state reset_ vereisen altijd bevestiging
- UI-state-voorkeuren synchroniseren in een latere fase over apparaten zodra een identity-laag beschikbaar is

## Requirements

- Settings is bereikbaar via het settings-icoon in de header (zie Header, customization 03 in 02-template)
- De inhoud is opgedeeld in een grid van kaarten, elk één onderwerp; vormgeving volgt de huisstijl van het 1000x-systeem
- Kaart _Voorkeurstaal_: keuze tussen NL en EN (zie Internationalisatie, i18n, customization 02 in 01-foundation)
- Kaart _Thema_: light/dark-toggle plus keuze uit een paar font-families en accent-kleuren binnen het ontwerp-systeem
- Kaart _Editor-voorkeuren_: fontgrootte, regel-hoogte, tab-size en optionele vim-mode voor de code-editor (zie Code-editor met browser-based execution, feature 04 in 03-features) en de markdown-editor (zie View / Edit-toggle met lokale drafts, feature 01 in 03-features)
- Kaart _Drafts beheren_: knoppen _Export drafts_ (downloadt alle drafts en lokale tree-mutaties als ZIP), _Import drafts_ (leest een eerder geëxporteerde ZIP terug), en _Wis alle lokale drafts_ met bevestigingsdialog
- Kaart _Profiel-informatie_: zichtbaar maar grotendeels niet-functioneel in de eerste release (naam, avatar, e-mail, _wachtwoord wijzigen_-link); volledig actief vanaf de fase met IAM
- Kaart _UI-state reset_: knop wist alle onthouden UI-keuzes (panel-keuze, sidebar collapse-state, laatst-bezochte level per scope) na bevestiging
- Onthouden UI-state in de eerste release: panel-keuze, sidebar collapse-state per chapter, laatst-bezochte level per levels-container (zie Levels, customization 04 in 02-template), en de panel-breedte + panel-view uit het rechter panel (zie Right panel, customization 07 in 02-template) — bewaard in lokale browser-opslag via het `settingsStore`-interface uit Section sidebar (customization 02 in 02-template)
- Vanaf de IAM-fase verhuist UI-state naar het gebruikersprofiel zodat hij over apparaten heen synct
- Wijzigingen op een kaart worden direct toegepast zonder save-knop, behalve destructieve acties die altijd een bevestigingsdialog tonen
- Settings is volledig toetsenbord-bedienbaar en voldoet aan WCAG 2.1 AA
