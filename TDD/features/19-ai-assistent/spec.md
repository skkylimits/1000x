# AI assistent in slide-panel

## Summary

Een uitschuifbaar paneel rechts met een chatbot die de huidige pagina als context kent. Beschikbaar op elke pagina. Bewust geïsoleerd zodat een AI-uitval nooit andere features raakt.

## Goals

- Lezers kunnen vragen stellen over de huidige pagina zonder de pagina te verlaten
- AI is op elke pagina beschikbaar via één consistent paneel
- AI-uitval beïnvloedt nooit andere features — het systeem blijft volledig werken zonder AI
- Toekomstige uitbreidingen (RAG, generatie-acties, fine-tuned wiki-LLM) bouwen op deze laag voort

## Requirements

- AI-knop in de header (feature 3) opent een slide-panel
- Paneel klapt over de content heen vanaf de rechterrand en is dichtklapbaar
- Chat-stijl conversatie met input onderaan en berichten erboven
- Antwoorden verschijnen geleidelijk via streaming
- Eerste release: alleen chat-UI met basis-context — frontmatter en eerste deel van pagina-content meegestuurd als context
- Failure-UX: bij elke vorm van AI-uitval (offline, server fout, rate-limit, timeout, provider down) toont het paneel één duidelijke melding _"AI is even niet beschikbaar"_ met één retry-knop
- Geen automatische retry-storms
- Andere features blijven volledig werken; AI is geïsoleerd in één paneel zodat een AI-uitval nooit de docs zelf raakt
- Sluit-affordance: X-knop of klik buiten het paneel
- Latere uitbreiding (niet in eerste release): elke pagina als gestructureerde, LLM-vriendelijke export aanleveren — markdown plus metadata bundeltje
- Latere uitbreiding: full LLM-mode met embeddings van de hele site en RAG over alle docs in plaats van alleen de huidige pagina
- Latere uitbreiding: gefinetuned model dat als kennis-assistent over de hele knowledge base optreedt
- Latere uitbreiding: generatie-acties vanuit de pagina-actiebalk dropdown (feature 7) zoals _Genereer PowerPoint_ en _Genereer documentatie_

Vereist dat feature 1 (markdown rendering) en feature 3 (header met AI-icoon) gebouwd zijn.
