# Smart ToC

## Summary

**Default: gebruik Nuxt UI's `<UContentToc>` zoals 'ie OOTB werkt.** Pas wanneer onze content-modellen het OOTB-gedrag aantoonbaar onvoldoende maken (bv. file-based tabs of folder-based levels die ervoor zorgen dat de ToC verkeerde headings toont, of een ToC die niet past op het scherm en daarom unhelpful wordt), bouwen we de scroll-driven smart-ToC eroverheen. De ToC leeft in het rechter-panel-skelet uit Right panel (customization 07).

Per de OOTB-first decision-rule (zie `02-TEMPLATE/README.md`): file-based tabs en folder-based levels lossen de tab/level-awareness al automatisch op via routing — elke route heeft een eigen body, dus `<UContentToc>` toont automatisch de juiste headings. Het enige wat OOTB mogelijk niet biedt is het scroll-driven auto-fit-gedrag voor lange pagina's. Dat is wat deze customization toevoegt — als 't blijkt nodig te zijn.

## Goals

- Lezers krijgen een ToC die werkt op alle pagina's, ongeacht of ze in een tabs-container of levels-folder zitten
- Geen handmatige expand/collapse-knoppen — auto-fit (alle headings als ze passen) of scroll-driven reveal als ze niet passen
- Anchors blijven binnen de huidige page-body; geen risico op springen naar verborgen koppen want elke tab/level heeft een eigen URL
- Bouw alleen wat OOTB niet voldoet — gebruik `<UContentToc>` als basis

## Requirements

### Smart ToC-gedrag

- Begin met `<UContentToc>` OOTB. Voeg het scroll-driven auto-fit-gedrag pas toe wanneer een lange pagina aantoont dat de OOTB-versie unhelpful wordt (te lange scrollende ToC die de panel-hoogte overschrijdt zonder progressie-indicatie)
- Past de volledige ToC in het scherm, dan worden alle koppen direct getoond zonder expand/collapse-affordances
- Past de ToC niet, dan zijn standaard alleen H2's zichtbaar; H3/H4 onder een H2 vouwen automatisch open zodra de gebruiker voorbij die H2 scrollt
- Bij alleen H2's op de pagina is de ToC een gewone scrollbare lijst zonder collapse-gedrag
- Geen UI-affordance om handmatig open/dicht te klappen; gedrag is volledig scroll-driven
- De ToC is scroll-gesynchroniseerd: terwijl de lezer scrollt, highlight de ToC de actieve kop in real-time

### Bron van de koppen

- De ToC leest de headings (H2/H3/H4) uit de body van de huidige route — geen tree-walk, geen custom tab-state-tracking, geen variant-resolver
- Voor pagina's onder een tabs-container (zie Tabs, customization 05): elke tab is een eigen route met eigen body, dus de ToC toont automatisch de koppen van de actieve tab zonder extra logic
- Voor pagina's onder een levels-container (zie Levels, customization 04): elke level-pagina heeft een eigen URL, dus de ToC toont automatisch de koppen van de actieve level-pagina
- Voor inline MDC `::tabs`-blocks binnen één pagina (Markdown rendering, customization 01): die blokken hebben typisch geen H2/H3-koppen die in de ToC moeten verschijnen (kleine snippets); als ze wel koppen hebben, verschijnen ze gewoon in de ToC zonder filter — bewuste keuze om edge-cases simpel te houden

### Container en switcher

- De panel-container, resize-handle, open/dicht-toggle én de rij icon-only switcher-knoppen leven in Right panel (customization 07); deze customization vult alleen de inhoud van de ToC-view en levert de bijbehorende switcher-knop voor "ToC"
- De ToC-knop in de switcher is overal beschikbaar; andere panel-views (Code editor, Card trainer, Comments) leven in hun eigen customization of feature

### Mobiel & toegankelijkheid

- Op smal scherm verschijnt de smart ToC niet in een rechter-panel maar als _"On this page"_-dropdown bovenaan de content (zie Mobiele layout, feature 07 in 03-FEATURES); het scroll-driven gedrag blijft hetzelfde in de uitgevouwen state
- De ToC is volledig toetsenbord-bedienbaar (WCAG 2.1 AA); pijltjes-toetsen navigeren tussen kop-links, `Enter` activeert
- Anchors springen smooth naar het heading; `prefers-reduced-motion` schakelt smooth-scroll uit

## Constraints

- **Geen tab-resolver** of variant-resolver custom logic; URL bepaalt welke body de ToC leest
- **Geen ToC-rendering buiten het rechter-panel** (op desktop) of de mobiele dropdown — geen inline-ToC binnen content of header
- **Geen handmatige expand/collapse-affordances** in de UI; gedrag is volledig scroll-driven
- **Geen jumping naar verborgen content** — onmogelijk geworden door de file-based-tabs/levels architectuur
