# Internationalisatie

## Summary

NL als standaardtaal, EN als secundair, voor zowel UI-strings als markdown-content. Iedere pagina kan een taal-versie hebben (`page.nl.md`, `page.en.md`) die naadloos integreert met de folder-based levels (zie Levels, customization 04 in 02-template) en file-based tabs (zie Tabs, customization 05 in 02-template) — i18n is een orthogonale dimensie die voor élk content-pad onafhankelijk werkt. Voor lezers die in hun voorkeurstaal willen werken en auteurs die per taal aparte markdown-bestanden onderhouden.

## Goals

- Lezers kunnen in één klik tussen NL en EN wisselen, met directe vervanging van strings én content
- Auteurs kunnen per taal aparte markdown-bestanden schrijven zonder dat de routing of structuur breekt
- Lokale drafts en lokale tree-mutaties blijven per taal strikt gescheiden zodat een NL-edit nooit per ongeluk de EN-versie raakt
- Een derde taal toevoegen vereist alleen UI-strings en markdown-files, geen code-wijziging in features

## Requirements

- Standaardtaal is Nederlands; Engels is de tweede beschikbare taal in de eerste release
- Alle UI-strings zijn extern vertaalbaar in translation-files (geen hardcoded teksten in components)
- Markdown-content per taal volgt de naamconventie `<page>.<lang>.md` en kan gecombineerd worden met varianten in de vorm `<page>.<variant>.<lang>.md`
- Taalwissel gebeurt via een icon-only knop in de header (zie Header, customization 03 in 02-template) die een klein menu opent met de beschikbare talen
- Na taalwissel vervangen UI-strings én de gerenderde markdown direct; de URL behoudt de gekozen taal zodat links deelbaar zijn
- Lokale drafts (zie View / Edit-toggle met lokale drafts, feature 01 in 03-features) en lokale tree-mutaties (zie In-app content management, feature 02 in 03-features) bevatten de taal in hun sleutel zodat NL en EN volledig gescheiden blijven
- Wanneer een pagina geen versie heeft in de gekozen taal, krijgt de lezer een fallback naar de default-taal met een melding dat de pagina niet in de gewenste taal beschikbaar is
- Variant-content (Levels (customization 04) en Tabs (customization 05) in 02-template) wordt per taal apart bijgehouden; switchen van taal binnen dezelfde variant is mogelijk
- De `nav`-array in een directory's `index.md` (zie Section sidebar, Section sidebar, customization 02 in 02-template) gebruikt slugs zodat de volgorde taal-onafhankelijk is
- De gekozen taal wordt onthouden tussen sessies als gebruiker-voorkeur (zie Settings, feature 03 in 03-features)
