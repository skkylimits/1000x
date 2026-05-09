# PWA en offline-werking

## Summary

De app is installeerbaar als native app op desktop en mobiel, en bezochte pagina's blijven werken zonder netwerk door automatische caching. Modules kunnen ook expliciet voor offline-gebruik worden gedownload.

## Goals

- Native-app-gevoel op alle apparaten via één install-stap
- Lezers kunnen door content browsen zonder netwerk-afhankelijkheid
- Modules zijn geforceerd-cachebaar voor onderweg of bij beperkte connectie
- Drafts en lokale wijzigingen werken sowieso offline als bijproduct

## Requirements

- App is installeerbaar via standaard browser install-flow op desktop en mobiel — icon, naam en theme-color worden geleverd door de app
- Bezochte pagina's worden automatisch gecached, samen met hun assets — _cache-as-you-go_ strategie
- Geen blanket precache in de eerste release; eerste site-bezoek blijft licht
- Pagina's die nooit zijn bezocht en zonder netwerk worden opgevraagd: tonen een offline-fallback met duidelijke melding
- Knop _"Download voor offline"_ per module forceert de hele module-content in de cache
- Module-grootte wordt vooraf getoond zodat de gebruiker een geïnformeerde keuze kan maken
- Voortgangs-indicator tijdens module-download
- Drafts (feature 10) en lokale tree-mutaties (feature 11) zitten al in lokale opslag en werken sowieso offline
- Code-uitvoering (feature 13) draait client-side en blijft offline werken zodra de runtime is gecached

Vereist dat feature 1 (markdown rendering) gebouwd is. Profiteert van features 10 en 11 (al lokaal werkend) en feature 13 (cached runtimes).
