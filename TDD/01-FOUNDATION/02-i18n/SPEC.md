# Internationalisatie

## Summary

NL als standaardtaal, EN als secundair, voor zowel UI-strings als markdown-content. Iedere pagina kan een taal-versie hebben (`page.nl.md`, `page.en.md`) die naadloos integreert met de folder-based levels (zie Levels, customization 04 in 02-TEMPLATE) en file-based tabs (zie Tabs, customization 05 in 02-TEMPLATE) — i18n is een orthogonale dimensie die voor élk content-pad onafhankelijk werkt. Voor lezers die in hun voorkeurstaal willen werken en auteurs die per taal aparte markdown-bestanden onderhouden.

## Goals

- Lezers kunnen in één klik tussen NL en EN wisselen, met directe vervanging van strings én content
- Auteurs kunnen per taal aparte markdown-bestanden schrijven zonder dat de routing of structuur breekt
- Lokale drafts en lokale tree-mutaties blijven per taal strikt gescheiden zodat een NL-edit nooit per ongeluk de EN-versie raakt
- Een derde taal toevoegen vereist alleen UI-strings en markdown-files, geen code-wijziging in features

## Requirements

- Standaardtaal is Nederlands; Engels is de tweede beschikbare taal in de eerste release
- Alle UI-strings zijn extern vertaalbaar in translation-files (geen hardcoded teksten in components)
- Markdown-content per taal volgt de naamconventie `<page>.<lang>.md`; levels (folders) en tabs (sibling-files) zijn orthogonaal aan i18n — ieder level- of tab-bestand heeft zijn eigen `.nl.md`/`.en.md`-suffix
- Taalwissel gebeurt via een icon-only knop in de header (zie Header, customization 03 in 02-TEMPLATE) die een klein menu opent met de beschikbare talen
- Na taalwissel vervangen UI-strings én de gerenderde markdown direct; de URL behoudt de gekozen taal zodat links deelbaar zijn
- Lokale drafts (zie View / Edit-toggle met lokale drafts, feature 01 in 03-FEATURES) en lokale tree-mutaties (zie In-app content management, feature 02 in 03-FEATURES) bevatten de taal in hun sleutel zodat NL en EN volledig gescheiden blijven
- Wanneer een pagina geen versie heeft in de gekozen taal, krijgt de lezer een fallback naar de default-taal met een melding dat de pagina niet in de gewenste taal beschikbaar is
- Level- en tab-content (zie Levels, customization 04 en Tabs, customization 05 in 02-TEMPLATE) wordt per taal apart bijgehouden; switchen van taal binnen dezelfde level of tab is mogelijk
- De `nav`-array in een directory's `index.md` (zie Section sidebar, customization 02 in 02-TEMPLATE) gebruikt slugs zodat de volgorde taal-onafhankelijk is
- De gekozen taal wordt onthouden tussen sessies als gebruiker-voorkeur (zie Settings, feature 03 in 03-FEATURES)

## Constraints

- **Geen runtime-translation-API's of online services** — Nuxt i18n in static mode; vertaling-strings leven in `i18n/locales/{lang}.json` en in markdown-files per taal
- **Geen automatische machine-translation pipeline** — auteurs schrijven per taal apart en bewust; de architectuur ondersteunt dat zonder code-wijziging
- **Geen taal-keuze UI in deze customization** — de taalwissel-knop in de header leeft bij Header (customization 03 in 02-TEMPLATE); hier alleen de routing- en content-laag
- **Geen draft-persistence-laag** — drafts per taal apart-houden is verantwoordelijkheid van View / Edit-toggle (feature 01 in 03-FEATURES); deze customization levert alleen de `{lang}`-conventie voor de keys
- **Geen meer dan twee talen in de eerste release** — NL + EN. Een derde taal toevoegen werkt zodra de markdown-files en JSON-translations bestaan (geen code-change), maar is bewust niet eerste-release scope
