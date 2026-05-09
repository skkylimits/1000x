# Sidebar replacement

## Summary

Deze customization vervangt de auto-sidebar van de Nuxt UI docs-template door de scope-bound versie uit Section sidebar (feature 2), inclusief variant-collapse uit Sub-header met variant-tabs (feature 8). Resultaat is dezelfde plek in de UI maar fundamenteel ander gedrag: scope-grenzen, doorlopende active-line en variant-collapse in plaats van een platte auto-sidebar. Voor lezers die per module een afgebakende navigatie willen in plaats van een endless tree.

## Goals

- Lezers krijgen scope-bound navigatie per module in plaats van de hele site-tree
- De sidebar wordt de gedeelde tree-bron voor alle andere nav-surfaces (header-dropdowns, prev/next, smart ToC, breadcrumb)
- Variant-files collapsen tot één logische node zodat de sidebar niet vervuild wordt door drie versies van dezelfde pagina
- Lokale tree-mutaties uit In-app content management (feature 11) verschijnen direct in de sidebar zonder full reload

## Requirements

- De navigatie-tree wordt opgebouwd uit drie lagen die samengevoegd worden: filesystem-walk, frontmatter (per pagina en per directory `index.md`), en lokale tree-mutaties (zie In-app content management, feature 11)
- Een directory's `index.md` bepaalt of die directory een sidebar-scope-grens is via één frontmatter-veld met de waarden "self", "children" of geen veld (erft van parent)
- Walk-up-algoritme bepaalt de actieve scope: vanaf de huidige route omhoog tot de eerste node met expliciete scope-waarde; geen match betekent fallback naar de top-level categorie
- Volgorde-prioriteit: expliciete `nav: [...]` array op slugs, daarna `order: N` per pagina, daarna alfabetisch op title
- Sidebar-rendering: scope-label bovenaan met verplicht icon; daaronder chapters met chevron rechts of pages direct in een ingesprongen container; pages zonder chapter staan in dezelfde container alsof er een onzichtbaar standaard-chapter is (zie Section sidebar, feature 2)
- Pages binnen één container delen één doorlopende verticale lijn aan de linkerkant: grijs voor inactief, info-kleur op de hoogte van de actieve pagina, zonder dubbele lijnen of gat
- Iedere chapter en scope-label heeft een verplicht icon uit de frontmatter; ontbrekend icon levert een build-error
- Variant-files (`<page>.<variant>.<lang>.md`) collapsen tot één logische node met een `variants`-lijst (zie Sub-header met variant-tabs, feature 8); ze verschijnen niet als drie aparte sidebar-entries
- Een directory's `index.md` rendert als de directory zelf en verschijnt nooit als kind van zichzelf in de tree
- De sidebar voedt downstream surfaces (header-dropdowns — zie Header met dropdown-menu's, feature 3 — prev/next — zie Changelog en navigatie onderaan pagina, feature 6 — smart ToC — zie Rechter panel met conditionele panel-switcher en smart ToC, feature 5 — en breadcrumb)
- Sidebar-collapse-state wordt onthouden tussen sessies (zie Settings, feature 12)
- Tijdens SSG bevat de initiële render alleen filesystem + frontmatter; lokaal aangemaakte items verschijnen pas na hydratie en zijn per definitie privé
- Een platte lookup-structuur naast de tree garandeert constant-time scope-walks per page-change
- De auto-sidebar van de baseline-template wordt volledig vervangen; geen mengvorm waarbij delen van de oude sidebar blijven leven
- Iedere navigatie-actie is toetsenbord-bedienbaar (WCAG 2.1 AA)
