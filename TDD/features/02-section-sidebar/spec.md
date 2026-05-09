# Section sidebar

## Summary

Een navigatie-balk links die de structuur van de huidige sectie toont — hoofdstukken en pagina's — met één consistent visueel rhythm ongeacht of een sectie hoofdstukken heeft of niet. Het is de foundation waar alle navigatie-surfaces in het systeem hun data uit halen.

## Goals

- Eén bron voor alle navigatie-surfaces: sidebar, header-dropdowns, prev/next, smart Table of Contents, breadcrumb bovenaan de pagina
- Lezers zien alleen de structuur van hun huidige sectie, niet aanverwante onderwerpen
- Visueel consistent ongeacht of een sectie hoofdstukken heeft of niet
- Reageert direct op nieuwe pagina's of hoofdstukken die via de UI worden aangemaakt
- Geen hardcoded nav-arrays of losse navigatie-bestanden — de boom komt uit de filesystem en frontmatter

## Requirements

- Sidebar toont alleen de huidige sectie, bepaald via een walk-up algoritme vanaf de huidige route tot een sectie-grens
- Een sectie-grens wordt aangegeven via één frontmatter-veld op de overzichtspagina van een directory; één veld, één gedrag — geen losse type-vlaggen of runtime-discrimination
- Bovenaan de sidebar staat een scope-label met icoon (de sectie-naam zoals JavaScript, Git, AI)
- Hoofdstukken renderen als rijen met een icoon links en een chevron rechts — gebruiker klikt om ze te openen of dichtklappen. De chevron staat aan de rechterkant van de rij (niet naast het icoon), het icoon van het hoofdstuk staat links
- Pagina's onder een uitgevouwen hoofdstuk staan ingesprongen onder hun parent
- Secties zonder hoofdstukken gebruiken hetzelfde visuele rhythm — pagina's staan in dezelfde ingesprongen container alsof er een onzichtbaar standaard-hoofdstuk is
- Een doorlopende verticale lijn loopt links van de pagina-rijen — grijs voor inactieve pagina's, accent-gekleurd op de actieve rij; één continue lijn, geen twee parallelle met een gat ertussen
- Iconen zijn verplicht voor élk hoofdstuk én élke scope-label; ontbrekende iconen leveren een build-error op (iconen dragen mede de overflow-collapse en header-dropdown rendering — een ontbrekend icon breekt UX-flows downstream)
- Index-pagina's verschijnen nooit als losse nav-entry — ze representeren de directory zelf en worden getoond bij klikken op de parent
- Volgorde van pagina's binnen een hoofdstuk volgt deze prioriteit: een expliciete didactische volgorde-lijst → een per-pagina order-veld als escape-hatch voor uitzonderingen → alfabetisch op titel als fallback
- Filenames blijven inhoudelijk (bv. `closures.md`), niet genummerd; tussenvoegen van een hoofdstuk vergt geen renames
- Pagina's met varianten (zie feature 8) collapsen tot één nav-entry, niet één per variant
- Sidebar-collapse-state wordt onthouden als gebruiker-voorkeur over sessies heen
- Rechts-klik op een item geeft toegang tot _hernoemen_ en _verwijderen_ (zie feature 11)
- Onderaan relevante lijsten staan inline rijen voor het toevoegen van nieuwe hoofdstukken of pagina's (zie feature 11)
- De navigatie-boom is reactief — iedere wijziging in de bron-data triggert een rerender van alle navigatie-surfaces
- Lokaal aangemaakte items verschijnen pas na hydratie in de sidebar; acceptabel omdat ze per definitie privé zijn
- Performance-doel: sidebar-scope-walk gebruikt een efficiënte lookup-structuur voor constant-time lookups bij iedere page-change, niet een full tree-walk

Vereist dat feature 1 (markdown rendering) gebouwd is voor de content-bron.
