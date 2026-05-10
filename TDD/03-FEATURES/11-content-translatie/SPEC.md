# Content-translatie (TMS-strategie)

## Summary

Content-translatie wordt geleverd via een Translation Management System (TMS) ipv per-taal markdown-files in de hoofdcodebase. De codebase blijft in één bron-taal (Nederlands); vertalingen leven in aparte translation-repo's of bij een TMS-provider en worden via een sync-pipeline naar deploy-time-output gestuurd. Inspiratie: het model dat Microsoft en andere grote docs-platforms gebruiken om duizenden pagina's onderhoudbaar te houden zonder de hoofd-codebase te overladen met taal-varianten.

## Goals

- Eén-bron-codebase: auteurs schrijven in NL, geen `.nl.md`/`.en.md` proliferatie naast bron-files
- Vertalers werken in een eigen tool/repo, niet in de hoofdcodebase
- Build-tijd of runtime delivery van vertalingen zonder dat de UI kennis heeft van de vertaalbron
- Schaalbaar van NL+EN naar willekeurig veel talen zonder repo-overload

## Requirements

- Bron-taal is Nederlands (matcht `defaultLocale` uit i18n, customization 02 in 01-FOUNDATION)
- Vertaal-output mapt 1-op-1 op de bron-tree (zelfde paden, andere talen)
- De docs-app probeert eerst de actieve-taal-versie via een TMS-aware path-strategie en valt terug op de bron met een duidelijke "vertaling nog niet beschikbaar"-hint
- Auteurs hoeven geen handmatige sync te doen: een tool of pipeline zorgt voor de TMS-roundtrip (export bron → vertaling → import vertaalde output)
- TMS-provider keuze (open: Crowdin / Lokalise / Phrase / git-based / eigen oplossing) wordt later gemaakt op basis van: kosten, SCIM/SSO-integratie, API-volwassenheid, ondersteuning voor markdown met frontmatter, en revisie-workflow

## Constraints

- **Geen content-translatie in de hoofdcodebase** — geen `<page>.<lang>.md` siblings naast bron-files; dit was bewust uitgesloten in i18n (customization 02 in 01-FOUNDATION)
- **Geen runtime machine-translation** — vertalingen zijn menselijk gemaakt of MT+post-edit, gepast door een TMS-pipeline, niet on-demand in de browser
- **Geen blokkade op release** — een pagina zonder vertaling toont in de bron-taal met optionele "vertaling nog niet beschikbaar"-hint; nooit een 404 omdat een vertaling ontbreekt
- **Niet eerste-release scope** — komt na alle andere 03-FEATURES items, wanneer content-volume vertaling rechtvaardigt en de UI-lagen stabiel zijn

## Open implementation questions

Concrete implementatie wordt uitgewerkt zodra deze feature aan de beurt komt. Hoofdvragen om dan te beantwoorden:

- Welke TMS / repo-strategie (provider versus zelf-host versus monorepo-met-translation-folder versus separate translations-repo per taal)
- Hoe de resolver de actieve-taal-content laadt: build-time-injectie, CDN-fetch, edge-function, of statisch per deploy-target
- Hoe niet-vertaalde-pagina's gemarkeerd worden in de UI (bron-fallback met badge boven content?)
- Hoe in-app drafts (feature 01 in 03-FEATURES) en tree-mutaties (feature 02 in 03-FEATURES) zich verhouden tot vertaal-overlays — drafts en tree-keys zullen op dat moment een `{lang}`-segment moeten krijgen (zie i18n, customization 02 in 01-FOUNDATION § Constraints)
- Hoe rich content (callouts, code-blocks, MDC-blocks, mermaid) door de TMS-pipeline overleeft zonder corruptie van placeholders
- Hoe de search-index (zie Search, customization 11 in 02-TEMPLATE) per taal opgebouwd wordt
