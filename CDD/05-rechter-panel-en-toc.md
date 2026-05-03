# Rechter panel met panel-switcher en smart Table of Contents

## Summary

Een paneel rechts van de content dat standaard de inhoudsopgave van de huidige pagina toont en kan switchen naar andere views afhankelijk van de pagina — code-editor, flashcards, comments, graph view, news feed. Het paneel is de container voor alle context-specifieke leeshulp.

## Goals

- Lezers hebben directe toegang tot een navigeerbare inhoudsopgave die meeschuift met scroll-positie
- Het paneel is uitbreidbaar: nieuwe panel-types kunnen worden toegevoegd zonder de layout aan te passen
- Iedere panel-type verschijnt alleen waar hij relevant is — geen visuele ruis op pagina's waar hij niets toevoegt
- Gebruikers passen de breedte aan naar eigen voorkeur

## Requirements

- Standaard view in het paneel is de Table of Contents van de huidige pagina
- Bovenaan het paneel staat een rij icon-only knoppen om te switchen tussen beschikbare views, met tooltip op hover
- Welke views beschikbaar zijn hangt af van de pagina/module: ToC overal beschikbaar, code-editor alleen op programmeertaal-pagina's, cards overal, comments overal, graph view (later) en news feed (later) waar relevant
- Een knop verschijnt alleen als hij een zinvolle use case heeft op de huidige pagina
- Tussen content en panel zit een drag-handle waarmee gebruikers de breedte aanpassen
- Smart ToC-gedrag bij voldoende ruimte: alle koppen tegelijk tonen
- Smart ToC-gedrag bij ruimtegebrek: standaard alleen H2's tonen; zodra de gebruiker voorbij een H2 scrollt, vouwen de bijbehorende H3's en H4's automatisch open
- Geen expand/collapse-pijltjes in de ToC — gedrag is volledig scroll-gestuurd
- Bij alleen H2's op de pagina: gewone scrollbare lijst zonder auto-expand
- Tab-bewuste ToC: bij content-tabs (feature 1) reflecteert de ToC alleen de koppen van de actief geselecteerde tab; switchen van tab herrendert de ToC
- Anchor-links springen alleen naar koppen binnen de actieve tab — nooit naar verborgen content
- Andere views (code-editor, cards, comments) vervangen de ToC binnen hetzelfde paneel maar behouden het uiterlijk en de drag-handle

Vereist dat feature 1 (markdown rendering met tabs) gebouwd is.
