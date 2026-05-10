# Internationalisatie

## Summary

NL als standaardtaal, EN als secundair voor **UI-strings**. Markdown-content blijft in de bron-taal (Nederlands); content-translatie naar andere talen volgt later via een aparte TMS-strategie (zie Content-translatie, feature 11 in 03-FEATURES) zodat de codebase niet overloaded raakt met `<page>.<lang>.md` siblings. Voor lezers die in hun voorkeurstaal de UI willen bedienen ongeacht de taal van de docs-content.

## Goals

- Lezers kunnen in één klik tussen NL en EN UI wisselen
- Alle UI-strings zijn extern vertaalbaar in `i18n/locales/{lang}.json`
- Een derde UI-taal toevoegen vereist alleen een nieuwe locale-file, geen code-wijziging in components

## Requirements

- Standaardtaal is Nederlands; Engels is de tweede UI-taal in de eerste release
- Alle UI-strings zijn extern vertaalbaar in `i18n/locales/{lang}.json` — placeholder-titels zoals ToC-header (`toc.title`), knop-labels, aria-labels, notFound-meldingen leven daar; geen hardcoded teksten in components of `app.config.ts`
- Taalwissel gebeurt via een icon-only knop in de header (zie Header, customization 03 in 02-TEMPLATE) die een klein menu opent met de beschikbare talen
- Na taalwissel vervangen alle UI-strings direct; URL en gerenderde markdown-content blijven onveranderd
- De gekozen taal wordt onthouden tussen sessies als gebruiker-voorkeur (zie Settings, feature 03 in 03-FEATURES)
- Markdown-content is **niet** vertaalbaar binnen deze customization — content blijft in de bron-taal totdat de TMS-strategie (feature 11 in 03-FEATURES) geïmplementeerd is

## Constraints

- **Geen runtime-translation-API's of online services** — Nuxt i18n in static mode; vertaling-strings leven in `i18n/locales/{lang}.json`
- **Geen `<page>.<lang>.md` content-siblings** — content-translatie hoort bij de TMS-strategie (feature 11 in 03-FEATURES). Deze customization raakt het content-laag bewust niet aan zodat de codebase niet overloaded raakt met taal-varianten en de bron-tree onderhoudbaar blijft
- **Geen taal-keuze UI in deze customization** — de taalwissel-knop wordt geleverd door Header (customization 03 in 02-TEMPLATE); deze customization levert de i18n-laag, de translation-files en de useI18n-integratie
- **Geen meer dan twee UI-talen in de eerste release** — NL + EN. Een derde toevoegen werkt zodra een nieuwe locale-file bestaat (geen code-change), maar is bewust niet eerste-release scope
- **Geen automatische machine-translation pipeline voor UI-strings** — translaties worden bewust geschreven; pas zodra de TMS-strategie (feature 11 in 03-FEATURES) staat is een MT-laag voor content (en eventueel ook UI) een optie
