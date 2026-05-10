# Mobiele layout

## Summary

De drie-kolom-layout (sidebar | content | rechter panel) collapsed op smal scherm naar één content-kolom met overlays. Sidebar verschijnt als slide-in van links via een hamburger-knop; het rechter panel als bottom-sheet of slide-in van rechts. Voor lezers die op telefoon of tablet werken en een touch-vriendelijke interface verwachten.

## Goals

- Lezers kunnen op een telefoon comfortabel lezen, zoeken, navigeren en oefenen
- Iedere desktop-feature blijft bereikbaar op mobiel, eventueel via een ander affordance
- Touch-doelen voldoen aan WCAG 2.1 AA en de pagina blijft bedienbaar zonder cursor-precisie

## Requirements

- Op smal scherm vervalt de drie-kolom-layout en wordt content de enige primaire kolom
- De header (zie Header, customization 03 in 02-template) blijft zichtbaar en krijgt een hamburger-knop links die de sidebar als slide-in van links opent
- De vijf actie-knoppen rechts in de header blijven bereikbaar; bij ruimtegebrek kunnen ze in een overflow-menu landen
- Het rechter panel (zie Right panel, customization 07 in 02-template) verschijnt als bottom-sheet of slide-in van rechts, opgeroepen via een knop in de pagina-actiebalk; de resize-handle vervalt op mobiel
- De pagina-actiebalk (zie Page chrome, customization 06 in 02-template) blijft inline naast de H1, maar collapsed naar een dropdown-menu op extra-smalle schermen (richtlijn: < 480px)
- De Card trainer (zie Card trainer, feature 05 in 03-features) draait full-screen in plaats van 70%
- De code-editor (zie Code-editor met browser-based execution, feature 04 in 03-features) draait als full-screen modal zodat de gebruiker genoeg ruimte heeft om te typen
- De smart ToC verschijnt op mobiel niet als rechter panel, maar als _"On this page"_-dropdown bovenaan de content; het scroll-driven gedrag blijft hetzelfde in de uitgevouwen state
- Touch-doelen zijn minimaal 44 × 44 px (WCAG 2.1 AA)
- Native horizontaal scrollen werkt op alle tab-rijen (TabBar uit Tabs customization 05 in 02-template, AppLevelHeader uit Levels customization 04, search-resultaten als die scrollen) via touch-swipe
- Sidebar-collapse, panel-keuze en gekozen tab worden onthouden tussen sessies, conform Settings (zie Settings, feature 03 in 03-features)
- Geen functionaliteit uit de desktop-versie is exclusief desktop; iedere feature heeft een mobile pendant
