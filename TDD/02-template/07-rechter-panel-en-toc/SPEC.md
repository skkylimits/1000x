# Rechter panel met smart ToC

## Summary

Deze customization vervangt de standaard ToC van de Nuxt UI docs-template door de scroll-driven, tab-bewuste en variant-bewuste smart ToC. De ToC leeft in het rechter-panel-skelet uit Page chrome (customization 05) en deelt z'n knoppenrij met latere panel-views (code-editor, card trainer, comments). Voor lezers die een ToC willen die zich automatisch aanpast aan de beschikbare ruimte, de actieve content-tab en de actieve variant — zonder zelf knopjes om te klappen.

## Goals

- Lezers krijgen een ToC die zich automatisch aanpast aan beschikbare ruimte, actieve tab en actieve variant
- Geen handmatige expand/collapse meer; het scroll-driven gedrag is volledig automatisch
- Anchors springen nooit naar een verborgen kop binnen een inactieve tab of variant
- Welke panel-knoppen zichtbaar zijn hangt af van de pagina; irrelevante tools worden niet getoond
- Default-template-ToC wordt volledig vervangen; geen mengvorm

## Requirements

### Smart ToC-gedrag

- De standaard ToC van de baseline-template wordt vervangen door de smart ToC die in het rechter-panel verschijnt; geen mengvorm
- Past de volledige ToC in het scherm, dan worden alle koppen direct getoond zonder expand/collapse-affordances
- Past de ToC niet, dan zijn standaard alleen H2's zichtbaar; H3/H4 onder een H2 vouwen automatisch open zodra de gebruiker voorbij die H2 scrollt
- Bij alleen H2's op de pagina is de ToC een gewone scrollbare lijst zonder collapse-gedrag
- Geen UI-affordance om handmatig open/dicht te klappen; gedrag is volledig scroll-driven
- De ToC is scroll-gesynchroniseerd: terwijl de lezer scrollt, highlight de ToC de actieve kop in real-time

### Tab- en variant-bewust

- Tab-bewust: bij content-tabs (zie Markdown rendering, customization 01, en Content tabs, customization 06) reflecteert de ToC alleen de koppen van de actief geselecteerde tab; switchen van tab herrendert de ToC
- Anchors springen alleen naar koppen binnen de actieve tab; nooit naar een verborgen kop in een inactieve tab
- Variant-bewust: bij pagina's met varianten (zie Variant tabs, customization 04) reflecteert de ToC de koppen van de actieve variant; switchen van variant herrendert de ToC

### Panel-switcher buttons (de knoppenrij bovenaan het panel)

- Bovenaan het rechter-panel staat een rij icon-only knoppen die de panel-inhoud wisselen; iedere knop heeft een tooltip op hover met een korte naam
- De zichtbaarheid van panel-knoppen is afhankelijk van de pagina/module:
  - **ToC**, **Card trainer** (zie feature 05 in 03-features) en **Comments** (zie feature 06 in 03-features) zijn overal beschikbaar
  - **Code editor** (zie feature 04 in 03-features) verschijnt alleen op pagina's met een programmeertaal of code-use-case
  - **Graph view** en **News feed** komen later
- Panel-switches zijn instant zonder kruislingse fade- of slide-animatie; alleen de inhoud verwisselt en de resize-handle blijft op zijn plek
- De panel-container, resize-handle en open/dicht-toggle leven in Page chrome (customization 05); deze customization vult alleen de inhoud

### Mobiel & toegankelijkheid

- Op smal scherm verschijnt de smart ToC niet in een rechter-panel maar als _"On this page"_-dropdown bovenaan de content (zie Mobiele layout, feature 07 in 03-features); het scroll-driven gedrag blijft hetzelfde in de uitgevouwen state
- De ToC en de panel-switcher zijn volledig toetsenbord-bedienbaar (WCAG 2.1 AA)
