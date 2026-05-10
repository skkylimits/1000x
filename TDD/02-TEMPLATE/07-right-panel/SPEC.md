# Right panel

## Summary

Deze customization voegt het rechter-panel-skelet toe als drie-kolom-layout-container (sidebar links, content midden, rechter panel rechts) inclusief resize-handle, open/dicht-mechanica en de rij icon-only panel-switcher buttons bovenaan het panel. Het skelet is een lege container die latere customizations en features (smart ToC, code-editor, card-trainer, comments) vullen zonder eigen chrome te bouwen. De Nuxt UI docs-template levert geen vergelijkbare drie-kolom-shell met page-bound switcher; deze customization vervangt dat deel volledig. Voor lezers die het rechter panel als vaste plek in de UI verwachten en voor latere features die er hun view in willen renderen.

## Goals

- Lezers krijgen een vaste plek aan de rechterkant waar tab- en level-bewuste tools verschijnen
- Het skelet is content-loos zelf en biedt een uniforme container die latere views kunnen vullen zonder eigen layout-werk te doen
- Open/dicht, breedte en actieve view worden onthouden tussen sessies zodat de gebruiker zijn voorkeur niet steeds opnieuw hoeft te zetten
- Welke switcher-knoppen zichtbaar zijn hangt af van de pagina; irrelevante tools worden niet getoond
- Aanpassen van de panel-mechanica (resize-bounds, default-breedte, switcher-set) raakt geen content-rendering of breadcrumb/actiebalk

## Requirements

### Drie-kolom skelet

- Het content-skelet biedt drie kolommen op desktop: sidebar links (zie Section sidebar, customization 02), content midden, rechter panel rechts
- Tussen content en rechter panel zit een resize-handle die de breedte aanpast binnen min ~220px en max ~480px; default ~280px
- Het rechter panel is op desktop standaard open en sluitbaar via een toggle in de pagina-actiebalk (zie Page chrome, customization 06); bij sluiten krijgt de content-kolom de vrijgekomen breedte
- Open/dicht-staat, breedte en actieve panel-view worden onthouden als gebruiker-voorkeur (zie Settings, feature 03 in 03-FEATURES)
- Het skelet biedt een container voor de AI-slide-panel (zie AI assistent, feature 10 in 03-FEATURES) die over de content heen kan klappen zonder het skelet zelf te raken
- Op smal scherm collapsed het rechter panel naar een bottom-sheet of slide-in (zie Mobiele layout, feature 07 in 03-FEATURES); de resize-handle vervalt

### Panel-switcher buttons

- Bovenaan het rechter panel staat een rij icon-only knoppen die de panel-inhoud wisselen; iedere knop heeft een tooltip op hover met een korte naam
- De zichtbaarheid van panel-knoppen is afhankelijk van de pagina/module:
  - **ToC** (zie Smart ToC, customization 08), **Card trainer** (zie feature 05 in 03-FEATURES) en **Comments** (zie feature 06 in 03-FEATURES) zijn overal beschikbaar
  - **Code editor** (zie feature 04 in 03-FEATURES) verschijnt alleen op pagina's met een programmeertaal of code-use-case
  - **Graph view** en **News feed** komen later
- Panel-switches zijn instant zonder kruislingse fade- of slide-animatie; alleen de inhoud verwisselt en de resize-handle blijft op zijn plek
- De content van iedere panel-view leeft in haar eigen customization of feature; deze customization levert alleen de switcher-knoppen en het swap-mechaniek

### Algemeen

- Het skelet, de resize-handle, de open/dicht-mechaniek en de switcher-buttons zijn volledig toetsenbord-bedienbaar (WCAG 2.1 AA)
- Geen gedeelde state met een eventueel template-versie van de rechter-kolom; deze customization vervangt dat deel volledig
