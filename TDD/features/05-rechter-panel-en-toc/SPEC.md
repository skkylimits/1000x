# Rechter panel met conditionele panel-switcher en smart ToC

## Summary

Rechter kolom met standaard de Table of Contents van de huidige pagina, en een knoppenrij bovenaan om het panel te wisselen naar code-editor, card trainer, comments of (later) graph/news. De panel-container blijft staan bij elke wissel; alleen de inhoud verwisselt. Voor lezers die context-gebonden tools naast de pagina willen, niet als losse modals.

## Goals

- Lezers kunnen tussen panels schakelen zonder context-verlies; resize en breedte blijven behouden
- De smart ToC is volledig scroll-driven en past zich aan de hoogte van het scherm én aan de actieve content-tab aan
- Welke panel-knoppen zichtbaar zijn hangt af van de pagina; irrelevante tools worden niet getoond
- Open/dicht-staat, breedte en gekozen view zijn persistente gebruiker-voorkeuren

## Requirements

- Het rechter panel is op desktop standaard open en toont de ToC van de huidige pagina
- Bovenaan het panel staat een rij icon-only knoppen die de panel-inhoud wisselen; iedere knop heeft een tooltip op hover
- De zichtbaarheid van panel-knoppen is afhankelijk van de pagina/module: ToC en card trainer (zie Card trainer, feature 14) en comments (zie Comment-systeem, feature 15) zijn overal beschikbaar; de code-editor (zie Code-editor met browser-based execution, feature 13) verschijnt alleen op pagina's met een programmeertaal of code-use-case; graph view en news feed komen later
- Tussen content-kolom en panel zit een resize-handle waarmee de gebruiker de breedte aanpast binnen een minimum (~220px) en maximum (~480px); default is ~280px
- De panel-toggle in de pagina-actiebalk (zie Pagina-actiebalk, feature 7) of een toetsenbordcombinatie sluit het panel volledig; de content-kolom krijgt dan de vrijgekomen breedte
- Panel-switches zijn instant zonder kruislingse fade- of slide-animatie; alleen de inhoud verwisselt en de resize-handle blijft op zijn plek
- Smart ToC met scroll-driven gedrag: past de volledige ToC in het scherm, dan worden alle koppen direct getoond zonder expand/collapse-affordances; past hij niet, dan zijn standaard alleen H2's zichtbaar en vouwen H3/H4 onder een H2 automatisch open zodra de gebruiker voorbij die H2 scrollt
- Bij alleen H2's op de pagina is de ToC een gewone scrollbare lijst zonder collapse-gedrag
- Tab-bewuste ToC: bij content-tabs (zie Markdown rendering & content-engine, feature 1) reflecteert de ToC alleen de koppen van de actief geselecteerde tab; switchen van tab herrendert de ToC en anchors springen alleen naar koppen binnen de actieve tab
- Open/dicht-staat, gekozen breedte en actieve view worden onthouden tussen sessies als gebruiker-voorkeur (zie Settings, feature 12)
- Iedere panel-switch en de resize-handle hebben een toetsenbord-equivalent (WCAG 2.1 AA)
- Op smal scherm geldt de mobiele variant van het panel (zie Mobiele layout, feature 16)
