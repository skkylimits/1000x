# Wiskundige formules en diagrammen

## Summary

Wiskundige formules via inline (`$…$`) en block (`$$…$$`) syntax, en diagrammen via een code-block met taal `mermaid`. Beide zijn opt-in per pagina zodat de runtime alleen laadt waar nodig. Voor auteurs van security en CS-content die cryptografie, complexity-analyse, attack-flows of sequence diagrams willen tonen.

## Goals

- Auteurs kunnen formules en diagrammen direct in markdown schrijven zonder externe tooling
- Pagina's zonder formules of diagrammen krijgen geen extra payload
- Diagrammen passen automatisch hun thema aan op light/dark
- Bewuste opt-in voorkomt dat de baseline rendering (zie Markdown rendering & content-engine, feature 1) deze runtimes stilletjes meelaadt

## Requirements

- Inline-wiskunde wordt geschreven als `$…$` en block-niveau-wiskunde als `$$…$$`
- Diagrammen worden geschreven als een code-block met taal `mermaid` en ondersteunen minstens flowcharts, sequence diagrams, system diagrams en ER-diagrammen
- De wiskunde-runtime laadt alleen op pagina's die daadwerkelijk een formule bevatten (frontmatter-vlag of content-detectie)
- De diagram-runtime laadt alleen op pagina's die daadwerkelijk een diagram bevatten
- Pagina's zonder formules of diagrammen hebben geen runtime-overhead voor deze features
- Block-formules verschijnen gecentreerd; inline-formules staan in de prose-flow
- Diagrammen renderen op de plek van het code-block en schalen mee met de container-breedte
- Diagrammen passen het thema (light/dark) aan in lijn met de site-keuze
- Wiskunde- en diagram-fouten breken de pagina niet; bij een renderfout verschijnt een nette inline melding op de plek van het element
- Wiskunde en diagrammen zijn bewust afgesplitst van de baseline markdown-rendering (zie Markdown rendering & content-engine, feature 1) zodat ze niet stilletjes in de baseline kruipen
- Gerenderde formules en diagrammen voldoen aan WCAG 2.1 AA: voldoende contrast, alt-tekst voor diagrammen, en toetsenbord-toegankelijk waar interactie mogelijk is
