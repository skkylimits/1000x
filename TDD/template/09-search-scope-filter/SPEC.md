# Search scope filter

## Summary

Deze customization breidt de standaard search van de Nuxt UI docs-template uit met een scope-toggle in de command palette: zoeken binnen de huidige sectie of over de hele site. Bouwt voort op de basis-functionaliteit uit Search (feature 9) en is functioneel geïsoleerd; kan eerder of later in de customization-volgorde worden uitgevoerd.

## Goals

- Lezers kunnen kiezen tussen "zoek alleen in deze sectie" en "zoek overal" zonder de palette te verlaten
- De toggle is herkenbaar persistent voor de lezer: de laatst-gekozen scope is de default bij hernieuwd openen
- De customization breidt de bestaande template-search uit; geen vervanging van de hele search-laag

## Requirements

- De command palette uit Search (feature 9) krijgt een extra toggle die schakelt tussen scope "huidige sectie" en scope "alles"
- "Huidige sectie" gebruikt de actieve sidebar-scope uit Section sidebar (feature 2 en customization 02 Sidebar replacement) om de zoekruimte te beperken
- "Alles" zoekt over de hele site, identiek aan het standaard-gedrag
- De toggle is bedienbaar via klik én via toetsenbord, zonder de palette te sluiten
- De laatst-gekozen scope is de default bij hernieuwd openen (zie Settings, feature 12)
- Resultaten tonen de breadcrumb zodat de lezer ziet uit welke scope een resultaat komt, ook in de "alles"-modus
- De scope-toggle verandert geen UI buiten de palette; geen extra header-knop of sidebar-affordance
- Bij in-app aangemaakte pagina's (zie In-app content management, feature 11) werkt de scope-filter correct: een item dat lokaal binnen een scope is aangemaakt verschijnt in de "huidige sectie"-resultaten van die scope
- De customization is geïsoleerd en heeft geen runtime-afhankelijkheid op andere customizations behalve de tree-bron
- De palette voldoet aan WCAG 2.1 AA en alle scope-affordances zijn toetsenbord-bedienbaar
- De template's standaard search-pipeline wordt niet vervangen; alleen de scope-laag wordt erbovenop gelegd zodat een latere upgrade van de search-index (zie Search, feature 9) zonder UI-werk kan
