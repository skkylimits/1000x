# Section sidebar

## Summary

Eén navigatie-tree die zichzelf bouwt uit het filesystem en frontmatter, en alle nav-surfaces van de app voedt: sidebar, header-dropdowns, prev/next, smart ToC, breadcrumb en variant-collapse. Geen losse navigatie-bestanden of hardcoded arrays. Voor lezers die door modules en hoofdstukken navigeren en voor auteurs die hun structuur uitsluitend in markdown bepalen.

## Goals

- Eén bron van navigatie-data voedt alle surfaces; structuur-wijziging vereist nooit code-aanpassing
- Lezers zien altijd dezelfde sidebar-scope binnen een module en herkennen het ritme van iedere docs-tak
- De actieve pagina is altijd visueel duidelijk zonder dubbele lijnen of gaten
- Tree-mutaties uit In-app content management (feature 11) verschijnen direct in alle surfaces zodra ze gemaakt zijn
- Sidebar-volgorde ondersteunt zowel didactische boek-volgorde als alfabetische referentie-volgorde

## Requirements

- De navigatie-tree wordt opgebouwd uit drie lagen die samengevoegd worden: filesystem-walk, frontmatter (per pagina en per directory `index.md`) en lokale tree-mutaties; iedere wijziging triggert rerender van alle nav-surfaces
- Een directory's `index.md` bepaalt of die directory een sidebar-scope-grens is via één frontmatter-veld met de waarden "self" (toon scope zelf), "children" (toon alleen kinderen) of geen veld (erft van parent)
- Walk-up-algoritme bepaalt de scope: vanaf de huidige route omhoog tot de eerste node met expliciete scope-waarde; geen match betekent fallback naar de top-level categorie
- Volgorde-prioriteit: expliciete `nav: [...]` array in een directory's `index.md` (op slugs, niet titles), daarna `order: N` per pagina als escape-hatch, daarna alfabetisch op title
- Filenames zijn inhoudelijk (geen volgordeprefixes); een hoofdstuk tussenvoegen kost één regel in de nav-array zonder renames
- Header-dropdowns (zie Header met dropdown-menu's, feature 3) lezen uit dezelfde tree en tonen icon en description per child uit frontmatter
- Prev/Next-navigatie (zie Changelog en navigatie onderaan pagina, feature 6) wordt afgeleid uit de afgevlakte tree in nav-array-volgorde en blijft variant-bewust zolang de doelpagina die variant heeft
- Drie variant-files (`page.junior.nl.md`, `page.mid.nl.md`, `page.senior.nl.md`) collapsen tot één logische node met een `variants`-lijst; switching gebeurt via querystring (zie Sub-header met variant-tabs, feature 8)
- Sidebar-rendering: scope-label bovenaan met icon, daaronder chapters met chevron rechts of pages direct in een ingesprongen container; pages zonder chapter staan in dezelfde container alsof er een onzichtbaar standaard-chapter is
- Pages binnen één ingesprongen container delen één doorlopende verticale lijn aan de linkerkant: grijs voor inactief, info-kleur op de hoogte van de actieve pagina, zonder dubbele lijnen of gat
- Iedere chapter en scope-label heeft een verplicht icon uit de frontmatter; ontbrekend icon levert een build-error
- Een directory's `index.md` rendert als de directory zelf en verschijnt nooit als kind van zichzelf in de tree
- Sidebar-collapse-state, gekozen panel en gekozen tab worden opgeslagen als gebruiker-voorkeur (zie Settings, feature 12); in latere fases verhuist deze state naar het gebruikersprofiel
- Een platte lookup-structuur naast de tree garandeert dat scope-walks per page-change constant-time zijn
- Tijdens SSG bevat de initiële render alleen filesystem + frontmatter; lokaal aangemaakte items (feature 11) verschijnen pas na hydratie en zijn per definitie privé
- Een breadcrumb (sectie / hoofdstuk / pagina) wordt uit dezelfde tree gevoed en verschijnt bovenaan de pagina-content
