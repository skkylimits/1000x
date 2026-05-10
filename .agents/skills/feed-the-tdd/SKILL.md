---
name: feed-the-tdd
description: Use when the user wants to feed a code-review lesson, recurring agent-mistake, or new project rule into the TDD documentation. Triggers on phrases like "feed-the-tdd", "feeden naar tdd", "tdd voeden", "/feed-the-tdd", or explicit invocation. Routes the rule to the correct doc (AGENTS.md / TDD/ARCHITECTURE.md / TDD/TOOLING-STRATEGY.md / a stage-README / a per-customization SPEC) by applying the heuristic "would a fresh agent only reading AGENTS.md repeat this mistake?". Do NOT trigger on generic mentions of "lesson learned", "rule" or "compounding" alone — only when explicitly tied to TDD documentation updates.
---

# feed-the-tdd

Route a code-review lesson or recurring agent-mistake to the right TDD doc. Apply the project's compounding-learning loop without bloating AGENTS.md.

## Step 1 — Capture the lesson

If the user invoked you without a clear description (e.g., bare `/feed-the-tdd`), ask:
- What mistake the agent made, or what rule they want to encode
- Optionally: which task / feature / customization surfaced it

If they gave you a description directly (e.g., `/feed-the-tdd "agent installeerde Pinia voorbarig"`), use that and skip the prompt.

## Step 2 — Classify

Apply this decision tree to determine the target doc:

| Aard van de regel | Target |
|---|---|
| **Cross-cutting agent-gedrag** ("altijd via composable, nooit raw fetch") | `AGENTS.md` |
| **Architecturale beslissing** ("Pinia komt pas bij feature X") | `TDD/ARCHITECTURE.md` |
| **Tooling / lint** ("geen Prettier") | `TDD/TOOLING-STRATEGY.md` |
| **Stage-specifieke decision-rule** ("OOTB-first voor template") | `TDD/02-TEMPLATE/README.md` (of 01-FOUNDATION / 03-FEATURES README) |
| **Domain-specifiek contract** ("tabs-container = sidebar leaf") | De relevante `SPEC.md` in `02-TEMPLATE/<n>/` of `03-FEATURES/<n>/` |

Verklaar je classificatie kort aan de user voor je verder gaat.

## Step 3 — Pas de heuristiek toe

Vraag: **"Zou een fresh agent die ALLEEN `AGENTS.md` leest en daarna een task pakt deze fout opnieuw maken?"**

- **Ja** → de regel is cross-cutting, hoort in `AGENTS.md`. Als de primaire target ook `AGENTS.md` is: alleen daar toevoegen. Als de primaire target elders is (ARCHITECTURE / TOOLING / etc.): voeg in `AGENTS.md` een **one-liner cross-ref toe** met "zie [target] § [sectie]"
- **Nee, alleen als de agent de specialisatie-doc niet leest** → laat het in de specialisatie-doc, niet in `AGENTS.md` (anders bloat 'ie)

## Step 4 — Lees target doc en stel toevoeging voor

1. Lees de target-doc
2. Vind de juiste sectie (bestaande regels-sectie, "Niet doen", anti-patterns, requirements, etc.)
3. Match de bestaande bullet-stijl en formattering precies
4. Stel de exacte toevoeging voor (full text van de bullet)
5. Toon waar het ingevoegd wordt en de AGENTS.md cross-ref one-liner als die er is

## Step 5 — Confirm + apply

1. Toon de diff aan de user
2. Vraag bevestiging
3. Pas de wijzigingen toe via `Edit` tool
4. Touch de gewijzigde files via `wsl -d Ubuntu -- touch <pad>` zodat VS Code reloadt
5. Run `git status -s` zodat de user ziet wat veranderd is

## Voorbeelden

**Voorbeeld 1 — cross-cutting:**

User: *"feeden naar tdd: agent installeerde een eigen breadcrumb-composable terwijl `<UBreadcrumb>` OOTB werkt"*

Classificatie: cross-cutting agent-gedrag (geldt voor élke component-keuze).
Target: `AGENTS.md` — toevoegen onder "Niet doen": *"Geen eigen composable bouwen voor wat Nuxt UI v4 OOTB levert (bv. `<UBreadcrumb>`, `<UContentToc>`); zie OOTB-first decision-rule in `TDD/02-TEMPLATE/README.md`"*.
Heuristiek: ja, fresh agent zou herhalen → blijft in AGENTS.md.

**Voorbeeld 2 — architecturaal:**

User: *"feeden: agent gebruikte queryCollectionItemSurroundings direct in een page component"*

Classificatie: architecturaal (Regel 1 — single entry-point).
Target: `TDD/ARCHITECTURE.md` § Anti-patterns. Voeg toe: *"queryCollectionItemSurroundings direct in een page component — gebruik usePrevNext (customization 10)"*.
Heuristiek: ja, fresh agent zou herhalen → ook één-regel cross-ref in `AGENTS.md` "Niet doen": *"Geen direct queryCollectionItemSurroundings in pages — zie ARCHITECTURE.md Regel 1"*.

**Voorbeeld 3 — domain:**

User: *"feeden: agent vergat dat tabs-container in de sidebar als één leaf-entry rendert, niet als chapter"*

Classificatie: domain-specifiek (alleen relevant voor section-sidebar).
Target: `TDD/02-TEMPLATE/02-section-sidebar/SPEC.md` § Requirements / Sidebar-rendering.
Heuristiek: nee — fresh agent met alleen AGENTS.md zou hier niet aan denken want 't is sidebar-implementation-detail. Blijft in SPEC, geen AGENTS-cross-ref.

## Niet doen

- **Niet alles in AGENTS.md proppen** — het hele punt van deze skill is dat AGENTS.md compact blijft (~150 regels max)
- **Niet de existing bullet-stijl negeren** — match de toon en lengte van bestaande regels in dezelfde sectie
- **Niet zonder confirmation schrijven** — toon altijd eerst de diff, wacht op user-go-ahead
- **Geen duplicates** — check of de regel al in een andere doc staat voordat je 'm toevoegt

## Wanneer NIET aanslaan

Als de user gewoon "lesson learned" of "we moeten dit onthouden" zegt zonder explicit te willen feeden naar TDD-docs — niet triggeren. Wacht op expliciete trigger ("feed-the-tdd", "feeden naar tdd", "/feed-the-tdd").