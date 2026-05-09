# Smart ToC

## Summary

Deze customization vervangt de standaard ToC van de Nuxt UI docs-template door de scroll-driven, tab-bewuste en variant-bewuste smart ToC uit Rechter panel met conditionele panel-switcher en smart ToC (feature 5), inclusief reflectie van content-koppen per variant (zie Sub-header met variant-tabs, feature 8). Bouwt voort op het rechter-panel-skelet uit Layout chrome.

## Goals

- Lezers krijgen een ToC die zich automatisch aanpast aan beschikbare ruimte, actieve tab en actieve variant
- Geen handmatige expand/collapse meer; het scroll-driven gedrag is volledig automatisch
- Anchors springen nooit naar een verborgen kop binnen een inactieve tab of variant
- Default-template-ToC wordt volledig vervangen; geen mengvorm

## Requirements

- De standaard ToC van de baseline-template wordt vervangen door de smart ToC die in het rechter panel verschijnt (zie Rechter panel met conditionele panel-switcher en smart ToC, feature 5)
- Smart-gedrag bij beschikbare ruimte: past de volledige ToC in het scherm, dan worden alle koppen direct getoond zonder expand/collapse-affordances; past hij niet, dan zijn standaard alleen H2's zichtbaar en vouwen H3/H4 onder een H2 automatisch open zodra de gebruiker voorbij die H2 scrollt
- Bij alleen H2's op de pagina is de ToC een gewone scrollbare lijst zonder collapse-gedrag
- Geen UI-affordance om handmatig open/dicht te klappen; gedrag is volledig scroll-driven
- Tab-bewust: bij content-tabs (zie Markdown rendering & content-engine, feature 1) reflecteert de ToC alleen de koppen van de actief geselecteerde tab; switchen van tab herrendert de ToC
- Anchors springen alleen naar koppen binnen de actieve tab; nooit naar een verborgen kop in een inactieve tab
- Variant-bewust: bij pagina's met varianten (zie Sub-header met variant-tabs, feature 8) reflecteert de ToC de koppen van de actieve variant; switchen van variant herrendert de ToC
- De ToC is scroll-gesynchroniseerd: terwijl de lezer scrollt, highlight de ToC de actieve kop in real-time
- Op smal scherm verschijnt de smart ToC niet in een rechter panel maar als _"On this page"_-dropdown bovenaan de content (zie Mobiele layout, feature 16); het scroll-driven gedrag blijft hetzelfde in de uitgevouwen state
- De ToC voldoet aan WCAG 2.1 AA en is volledig toetsenbord-bedienbaar
- De customization bouwt op het rechter-panel-skelet uit Layout chrome (customization 03)
