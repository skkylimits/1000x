# Math en diagrammen

## Summary

Deze customization voegt twee opt-in markdown-extensies toe die de baseline-rendering uit Markdown rendering (customization 01) niet biedt: wiskundige formules via **KaTeX** en diagrammen via **Mermaid**. Beide raken alleen het markdown-render-pad en zijn opt-in per pagina, zodat de runtime alleen laadt waar nodig. Voor auteurs die formules of diagrammen direct in markdown willen tonen zonder externe tooling — security/CS-content (cryptografie-formules, complexity-analyse) en architectuur-uitleg (attack-flows, request-lifecycles, ER-diagrammen).

## Goals

- Auteurs kunnen formules en diagrammen direct in markdown gebruiken zonder externe tooling of asset-pipeline
- Pagina's zonder formules of diagrammen krijgen geen extra runtime-payload
- Beide extensies zijn bewust afgesplitst van de baseline rendering (zie Markdown rendering, customization 01) zodat ze niet stilletjes in de baseline kruipen
- Diagrammen passen automatisch hun thema/contrast aan op light/dark

## Requirements

### Wiskundige formules (KaTeX)

- Inline-wiskunde wordt geschreven als `$…$` en block-niveau-wiskunde als `$$…$$`
- De wiskunde-runtime laadt alleen op pagina's die daadwerkelijk een formule bevatten (frontmatter-vlag of content-detectie tijdens render)
- Block-formules verschijnen gecentreerd; inline-formules staan in de prose-flow
- Renderfouten breken de pagina niet; bij een fout verschijnt een nette inline melding op de plek van het element
- KaTeX is gekozen boven MathJax: kleiner, sneller, voldoende voor 95% van de wiskunde die we hier nodig hebben

### Diagrammen (Mermaid)

- Diagrammen worden geschreven als een code-block met taal `mermaid` en ondersteunen minstens flowcharts, sequence diagrams, system diagrams en ER-diagrammen
- De diagram-runtime laadt alleen op pagina's die daadwerkelijk een diagram bevatten
- Diagrammen renderen op de plek van het code-block en schalen mee met de container-breedte
- Diagrammen passen het thema (light/dark) aan in lijn met de site-keuze
- Renderfouten breken de pagina niet; bij een fout verschijnt een nette inline melding op de plek van het element

### Algemeen

- Pagina's zonder formules of diagrammen hebben geen runtime-overhead voor deze extensies
- Beide extensies werken offline op pagina's die in de cache staan (zie PWA en offline-werking, feature 08 in 03-FEATURES), zolang de assets mee zijn gecached
- Gerenderde formules en diagrammen voldoen aan WCAG 2.1 AA: voldoende contrast, alt-tekst voor diagrammen waar mogelijk
