# Markdown rendering & content-engine

## Summary

Iedere docs-pagina is een markdown-bestand met frontmatter dat server-side gerenderd wordt naar een interactieve HTML-pagina. Dit is de fundering waar alle andere features (sidebar, ToC, search, varianten, drafts) op bouwen — markdown blijft de bron van waarheid, er is geen content-database. Bedoeld voor lezers die de pagina consumeren én voor auteurs die in markdown schrijven.

## Goals

- Lezers krijgen een rijke, gerenderde pagina met koppen, code, callouts, embeds en tabs zonder losse navigatie
- Auteurs kunnen lange pagina's condenseren met content-tabs zonder het bestand op te splitsen
- Frontmatter levert metadata voor downstream features (sidebar-orden, varianten, panels) zonder eigen parser per feature
- Onbekende of nieuwe frontmatter-velden breken bestaande pagina's niet
- Externe content (video's, artikelen, social) kan via een latere ingestie-pipeline als gewone markdown landen zonder dat de rest van het systeem dat hoeft te weten

## Requirements

- Pagina-content wordt server-side gerenderd vanuit markdown-bestanden inclusief koppen H1 t/m H4 met anchor-links
- Code-blocks worden gerenderd met syntax highlighting per taal
- Callouts, afbeeldingen en embeds renderen inline binnen de prose-stijl
- Content-tabs zijn ondersteund: meerdere tabs binnen één pagina, elk met eigen H2/H3-koppen die downstream door de smart ToC worden opgepikt (zie Rechter panel met smart ToC, feature 5)
- Bij meer content-tabs dan in beeld passen scrollt de tab-rij horizontaal via touch-swipe, trackpad-scroll en shift+scrollwheel; aan de rand toont een visuele hint dat er meer is
- Het `+`-icoon voor een nieuwe tab uit In-app content management (feature 11) blijft tijdens horizontaal scrollen altijd zichtbaar en bedienbaar, ook via toetsenbord
- Anchor-links naar koppen werken binnen de actief geselecteerde tab; nooit naar een verborgen kop in een inactieve tab
- Iedere pagina kent een impliciete `schemaVersion` (default 1); onbekende frontmatter-velden geven een dev-warning maar laten de pagina renderen
- Migration-scripts kunnen frontmatter ophogen naar een nieuwe schemaVersion zonder pagina's handmatig aan te passen
- Afbeeldingen en media volgen een mappenstructuur die de content-tree spiegelt; UI-screenshots zijn standaard taal-onafhankelijk en alleen écht taalgevoelige beelden krijgen per taal een eigen versie
- Afbeeldingen worden geoptimaliseerd (resize per breakpoint, moderne formaten, lazy-loading) zonder dat auteurs daar in markdown iets voor hoeven te doen
- Migratie naar een CDN voor assets is mogelijk zonder de mappenstructuur of markdown-references te wijzigen
- De content-laag levert een toekomstige ingestie-pipeline (externe bron naar markdown) zonder dat downstream features iets weten van de bron
- Alle interactieve elementen voldoen aan WCAG 2.1 AA en hebben een toetsenbord-equivalent voor elke muis- of scroll-actie
