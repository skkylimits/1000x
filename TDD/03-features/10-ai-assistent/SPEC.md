# AI assistent in slide-panel

## Summary

Een knop in de header (zie Header met dropdown-menu's, feature 3) opent een chat-panel dat over de content heen klapt, met de huidige pagina als context. Antwoorden streamen real-time via een server-route. Voor lezers die de docs als kennis-assistent willen gebruiken en pagina-specifieke vragen willen stellen.

## Goals

- Lezers krijgen een AI-assistent met pagina-context zonder de pagina te verlaten
- AI-uitval raakt nooit andere features; het panel is bewust geïsoleerd
- Latere uitbreidingen (RAG over de hele site, generatie-acties vanuit de pagina-actiebalk, gefinetuned wiki-LLM) bouwen voort op dezelfde UI

## Requirements

- Het AI-icoon in de header opent een slide-panel dat over de content heen klapt en dichtklapbaar is
- Het panel toont bovenaan een titel en sluit-knop; daaronder de chat-history; onderin een input-veld met send-knop
- Antwoorden streamen real-time via een server-route
- De huidige pagina levert basis-context (frontmatter en eerste deel van pagina-content) in de eerste release
- Bij elke vorm van AI-uitval (offline, 5xx, rate-limit, timeout, provider down) toont het panel een nette melding _"AI is even niet beschikbaar"_ met één retry-knop; geen automatische retry-storms
- Andere features blijven volledig functioneel bij AI-uitval; het AI-panel is bewust geïsoleerd zodat een uitval nooit de docs zelf raakt
- Het panel is sluitbaar via de X-knop, klik buiten het panel of een toetsenbordcombinatie
- Op mobiel beslaat het panel volgens de mobiele layout een groter deel van het scherm (zie Mobiele layout, feature 16)
- Latere fase: LLM-text export per pagina (gestructureerde, LLM-vriendelijke tekst-bundel met markdown en metadata)
- Latere fase: full LLM-mode met embeddings van de hele site en RAG over alle docs in plaats van alleen de huidige pagina
- Latere fase: gefinetuned of grounded model dat als kennis-assistent over de hele knowledge base optreedt
- Latere fase: generatie-acties (_Genereer PowerPoint_, _Genereer documentatie_) vanuit de pagina-actiebalk-dropdown (zie Pagina-actiebalk, feature 7), die dezelfde AI-laag gebruiken
- Het panel is volledig toetsenbord-bedienbaar en voldoet aan WCAG 2.1 AA
