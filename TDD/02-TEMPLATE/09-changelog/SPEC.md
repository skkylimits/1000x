# Changelog

## Summary

**Default: gebruik Nuxt UI v4's `<UChangelog>`-component** als basis voor de timeline-rendering — dat is de OOTB-oplossing voor versie-grouping, commit-rijen en de doorlopende verticale lijn. Deze customization voegt alleen de **data-layer** toe: een server-route die git-commit-history per pagina ophaalt en omzet naar het format dat `<UChangelog>` verwacht. Per de OOTB-first decision-rule (zie `02-TEMPLATE/README.md`): geen rebuild van de timeline-UI, alleen de git-data-pipeline die de component voedt. Voor lezers die willen zien wanneer en waarom een pagina is gewijzigd zonder de repository te openen.

## Goals

- Lezers krijgen op iedere pagina inzicht in de wijzigings-historie zonder de repository te openen
- Hergebruik Nuxt UI's `<UChangelog>` (en haar styling — doorlopende lijn, version-badges, commit-rijen) als renderer; bouw geen eigen timeline
- De positie op de pagina is voorspelbaar: changelog komt direct onder de content, vóór prev/next

## Requirements

- Onder de pagina-content rendert `<UChangelog>` (Nuxt UI v4) met items uit de git-history van de huidige pagina-file. Format: per versie/release een group met datum + commits eronder (hash-chip, auteur avatar + naam, commit-bericht, optionele PR-link)
- De data-layer bestaat uit een server-route (`server/api/changelog/[...path].ts`) die `git log --follow` runt op de pagina-file en de output mapt naar `<UChangelog>`'s items-prop format
- Hash, auteur en eventuele PR-link zijn klikbaar en linken naar de bron — gebruik `<UChangelog>`'s eigen link-rendering
- Pagina-volgorde op het scherm is altijd: content → changelog → prev/next (zie Prev/next, customization 10); geen andere blokken ertussen
- De changelog werkt offline voor pagina's die in de cache staan (zie PWA en offline-werking, feature 08 in 03-FEATURES), zolang de commit-data is mee-gecached. SSG: pre-render de changelog-data per pagina tijdens build-time
- Iedere link is toetsenbord-bedienbaar (WCAG 2.1 AA) — `<UChangelog>` regelt dit, custom werk overschrijft het niet
